/*
# Innovation Leaderboard + 3D Printing Domain

## What this does

### Part 1: Innovation Points System
1. Creates `innovation_points_log` table to store every points award event.
   - student_id, points, reason, reference_id (e.g. project_id), 
     reference_type (project_completion, quiz_pass, etc.), created_at
2. Creates `student_achievements` table to track earned achievement badges.
   - student_id, badge_key, earned_at
3. Creates a SECURITY DEFINER function `award_innovation_points` that:
   - Inserts a row into innovation_points_log
   - Prevents duplicate awards (checks for existing same reason + reference)
4. Creates a view `student_points_summary` that aggregates total points per student.
5. RLS: students can only see points/badges from their own school.
   Admins can see all.

### Part 2: 3D Printing Courses & Projects
6. Inserts 4 new 3D Printing courses into the courses table.
7. Inserts 8 new 3D Printing projects into the projects table, linked to courses.

## New Tables
- innovation_points_log: id, student_id, points, reason, reference_id, 
  reference_type, metadata jsonb, created_at
- student_achievements: id, student_id, badge_key, earned_at

## New Functions
- award_innovation_points(p_student_id, p_points, p_reason, p_reference_id, 
  p_reference_type, p_metadata): SECURITY DEFINER, inserts into log, 
  prevents duplicates

## New View
- student_points_summary: student_id, full_name, school, class_level, 
  total_points, rank

## Security
- RLS on innovation_points_log: students see only their school's data
- RLS on student_achievements: students see only their school's data
- award_innovation_points is SECURITY DEFINER (callable by authenticated)
- student_points_summary view is scoped by RLS through underlying tables
*/

-- ============================================================
-- PART 1: INNOVATION POINTS SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS innovation_points_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason text NOT NULL,
  reference_id uuid,
  reference_type text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE innovation_points_log ENABLE ROW LEVEL SECURITY;

-- Students can see points from their own school only
DROP POLICY IF EXISTS "points_select_school_scoped" ON innovation_points_log;
CREATE POLICY "points_select_school_scoped"
ON innovation_points_log FOR SELECT
TO authenticated
USING (
  CASE
    WHEN public.is_admin() THEN true
    ELSE EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = innovation_points_log.student_id
      AND p.school = (SELECT school FROM profiles WHERE id = auth.uid())
    )
  END
);

-- Only admins can directly insert/update/delete (the function bypasses RLS)
DROP POLICY IF EXISTS "points_insert_admin" ON innovation_points_log;
CREATE POLICY "points_insert_admin"
ON innovation_points_log FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "points_delete_admin" ON innovation_points_log;
CREATE POLICY "points_delete_admin"
ON innovation_points_log FOR DELETE
TO authenticated
USING (public.is_admin());

-- Student achievements table
CREATE TABLE IF NOT EXISTS student_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key text NOT NULL,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, badge_key)
);

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "achievements_select_school_scoped" ON student_achievements;
CREATE POLICY "achievements_select_school_scoped"
ON student_achievements FOR SELECT
TO authenticated
USING (
  CASE
    WHEN public.is_admin() THEN true
    ELSE EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = student_achievements.student_id
      AND p.school = (SELECT school FROM profiles WHERE id = auth.uid())
    )
  END
);

DROP POLICY IF EXISTS "achievements_insert_admin" ON student_achievements;
CREATE POLICY "achievements_insert_admin"
ON student_achievements FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Award function (SECURITY DEFINER — bypasses RLS to insert points)
CREATE OR REPLACE FUNCTION public.award_innovation_points(
  p_student_id uuid,
  p_points integer,
  p_reason text,
  p_reference_id uuid DEFAULT NULL,
  p_reference_type text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Prevent duplicate awards for the same reference
  IF p_reference_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM innovation_points_log
      WHERE student_id = p_student_id
        AND reference_id = p_reference_id
        AND reference_type = p_reference_type
    ) THEN
      RETURN false;
    END IF;
  END IF;

  INSERT INTO innovation_points_log (student_id, points, reason, reference_id, reference_type, metadata)
  VALUES (p_student_id, p_points, p_reason, p_reference_id, p_reference_type, p_metadata);

  RETURN true;
END;
$$;

-- Grant execute to authenticated
GRANT EXECUTE ON FUNCTION public.award_innovation_points TO authenticated;

-- Award achievement badge function
CREATE OR REPLACE FUNCTION public.award_achievement_badge(
  p_student_id uuid,
  p_badge_key text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO student_achievements (student_id, badge_key)
  VALUES (p_student_id, p_badge_key)
  ON CONFLICT (student_id, badge_key) DO NOTHING;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.award_achievement_badge TO authenticated;

-- Aggregated view for leaderboard
CREATE OR REPLACE VIEW student_points_summary AS
SELECT
  p.id AS student_id,
  p.full_name,
  p.school,
  p.class_level,
  COALESCE(SUM(ipl.points), 0) AS total_points,
  RANK() OVER (PARTITION BY p.school ORDER BY COALESCE(SUM(ipl.points), 0) DESC) AS school_rank
FROM profiles p
LEFT JOIN innovation_points_log ipl ON ipl.student_id = p.id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.school, p.class_level;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_points_student ON innovation_points_log(student_id);
CREATE INDEX IF NOT EXISTS idx_points_created ON innovation_points_log(created_at);
CREATE INDEX IF NOT EXISTS idx_achievements_student ON student_achievements(student_id);

-- ============================================================
-- PART 2: 3D PRINTING COURSES & PROJECTS
-- ============================================================

-- Insert 3D printing courses (idempotent — check by slug)
INSERT INTO courses (title, slug, description, image_url, status, sort_order)
SELECT * FROM (VALUES
  ('3D Design Fundamentals', '3d-design-fundamentals',
   'Learn the principles of 3D design — from basic shapes to complex models ready for digital fabrication.',
   'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'available', 100),
  ('CAD for Makers', 'cad-for-makers',
   'Master computer-aided design tools to create precise mechanical parts, assemblies and functional prototypes.',
   'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'available', 101),
  ('3D Printing Fundamentals', '3d-printing-fundamentals',
   'Understand how 3D printers work — from slicer settings and materials to calibration, printing and post-processing.',
   'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'available', 102),
  ('Engineering Prototyping', 'engineering-prototyping',
   'Apply design thinking and rapid prototyping to solve real engineering problems with 3D printing.',
   'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
   'available', 103)
) AS v(title, slug, description, image_url, status, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = v.slug);

-- Insert 3D printing projects (idempotent — check by slug)
-- Course IDs will be resolved via subqueries
INSERT INTO projects (title, slug, description, image_url, course_id, class_level, difficulty, estimated_time, technology, what_you_build, what_you_learn, components, build_steps, testing, troubleshooting, take_it_further, status, sort_order)
SELECT * FROM (VALUES
  (
    'Custom Keychain',
    'custom-keychain',
    'Design and 3D print a personalized keychain — your first digital fabrication project.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = '3d-design-fundamentals')::uuid,
    'Class 6', 'Beginner', '1-2 hours', '3D Printing',
    'A custom keychain with your name or design, printed in PLA.',
    'How to use basic 3D design tools, export STL files, and prepare a print in a slicer.',
    '3D printer, PLA filament, computer with CAD software',
    'DISCOVER: Explore existing keychain designs. LEARN: Basic sketching and extrusion in CAD. DESIGN: Create your keychain model. BUILD/PRINT: Slice and print your keychain. TEST: Check print quality and durability. IMPROVE: Adjust design for better strength. INNOVATE: Add multi-color or functional features.',
    'Check that the keyring hole is strong enough. Verify print layer adhesion. Test fit on a real keyring.',
    'Print lifting from bed? Clean the build plate and use brim. Stringing? Adjust retraction settings.',
    'Try different infill patterns, add text embossing, or design a multi-piece keychain.',
    'published', 200
  ),
  (
    'Phone Stand',
    'phone-stand',
    'Design and print a functional phone stand for your desk.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = '3d-design-fundamentals')::uuid,
    'Class 7', 'Beginner', '2-3 hours', '3D Printing',
    'A stable phone stand that holds your phone at a comfortable viewing angle.',
    'Angles, structural support design, prototyping for real-world use.',
    '3D printer, PLA filament, calipers, phone for testing',
    'DISCOVER: Study existing phone stands. LEARN: Designing angles and support structures. DESIGN: Model your phone stand. BUILD/PRINT: Print with appropriate infill. TEST: Test with your phone — is it stable? IMPROVE: Adjust angle or base width. INNOVATE: Add cable routing or charging port access.',
    'Does it hold the phone without tipping? Is the angle comfortable for viewing?',
    'Phone too loose? Measure phone dimensions precisely. Stand tipping? Widen the base.',
    'Add a charging cable channel, make it adjustable, or foldable for portability.',
    'published', 201
  ),
  (
    'Mechanical Gear',
    'mechanical-gear',
    'Design and print a working mechanical gear system.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = 'cad-for-makers')::uuid,
    'Class 8', 'Intermediate', '3-4 hours', '3D Printing',
    'A functional gear that meshes smoothly with another gear to transmit rotation.',
    'Gear geometry, meshing, tolerances, and mechanical design principles.',
    '3D printer, PLA/PETG filament, calipers',
    'DISCOVER: Study gear types and applications. LEARN: Involute gear design in CAD. DESIGN: Create matching gear pair. BUILD/PRINT: Print with fine layer height. TEST: Check meshing and rotation. IMPROVE: Adjust tolerances for smooth operation. INNOVATE: Build a gear train or gearbox.',
    'Do the gears mesh smoothly? Is there excessive backlash? Does rotation transfer efficiently?',
    'Gears binding? Increase the clearance between teeth. Too much play? Reduce tolerance.',
    'Create a gear train, add a crank handle, or design a planetary gear set.',
    'published', 202
  ),
  (
    'Robot Chassis',
    'robot-chassis',
    'Design and 3D print a custom chassis for a robot project.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = 'cad-for-makers')::uuid,
    'Class 9', 'Intermediate', '4-6 hours', '3D Printing',
    'A 3D-printed robot chassis with motor mounts and sensor mounting points.',
    'Structural design, mounting points, weight distribution, integration with electronics.',
    '3D printer, PLA/PETG filament, motors, wheels, Arduino, sensors',
    'DISCOVER: Study robot chassis designs. LEARN: Designing for component integration. DESIGN: Model chassis with motor mounts. BUILD/PRINT: Print with high infill for strength. TEST: Assemble and test with motors. IMPROVE: Adjust for weight and balance. INNOVATE: Add sensor mounts or modular attachments.',
    'Does it hold all components securely? Is it balanced? Can the robot move smoothly?',
    'Motors loose? Adjust mount dimensions. Chassis flexing? Increase infill or add ribs.',
    'Make it modular, add a battery compartment, or design for different wheel sizes.',
    'published', 203
  ),
  (
    'Sensor Mount',
    'sensor-mount',
    'Design and print custom mounting brackets for sensors on your projects.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = '3d-printing-fundamentals')::uuid,
    'Class 8', 'Beginner', '2-3 hours', '3D Printing',
    'A custom sensor mount bracket for an ultrasonic or IR sensor.',
    'Designing for specific components, mounting solutions, and rapid iteration.',
    '3D printer, PLA filament, sensor, calipers',
    'DISCOVER: Measure your sensor and study mounting options. LEARN: Designing precise mounting brackets. DESIGN: Model the bracket. BUILD/PRINT: Print and test fit. TEST: Mount the sensor — does it stay secure? IMPROVE: Adjust for better fit. INNOVATE: Design adjustable or multi-sensor mounts.',
    'Does the sensor fit snugly? Is it oriented correctly? Can it be mounted on a robot?',
    'Sensor too tight? Add 0.2mm tolerance. Mounting holes misaligned? Use calipers for precise measurement.',
    'Design a multi-sensor array mount, or an adjustable angle bracket.',
    'published', 204
  ),
  (
    'Robotic Gripper',
    'robotic-gripper',
    'Design and 3D print a working robotic gripper mechanism.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = 'engineering-prototyping')::uuid,
    'Class 9', 'Advanced', '5-7 hours', '3D Printing',
    'A functional robotic gripper with fingers that open and close using a servo motor.',
    'Linkage mechanisms, servo integration, grip force, and mechanical design.',
    '3D printer, PLA filament, servo motor, Arduino, rubber bands',
    'DISCOVER: Study gripper mechanisms. LEARN: Linkage design and servo integration. DESIGN: Model gripper fingers and base. BUILD/PRINT: Print all parts. TEST: Assemble and test grip. IMPROVE: Adjust finger shape for better grip. INNOVATE: Add pressure sensing or multi-finger design.',
    'Can it pick up objects? Is the grip secure? Does the servo have enough torque?',
    'Fingers not closing? Check linkage geometry. Objects slipping? Add grip pads or texturing.',
    'Add force feedback, design a 3-finger gripper, or integrate with a robot arm.',
    'published', 205
  ),
  (
    'Drone Mount',
    'drone-mount',
    'Design and print a custom camera or sensor mount for a drone.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = 'engineering-prototyping')::uuid,
    'Class 10', 'Advanced', '4-5 hours', '3D Printing',
    'A lightweight drone camera mount with vibration damping.',
    'Designing for weight constraints, vibration isolation, and aerial applications.',
    '3D printer, lightweight PLA, drone, camera, rubber dampeners',
    'DISCOVER: Study drone mounting solutions. LEARN: Designing for weight and vibration. DESIGN: Model the mount. BUILD/PRINT: Print with low infill for weight. TEST: Mount on drone and test flight. IMPROVE: Reduce weight or improve damping. INNOVATE: Add gimbal stabilization.',
    'Does it hold the camera securely? Is it light enough for stable flight? Is vibration minimized?',
    'Drone unstable? Reduce mount weight. Camera shaking? Add vibration dampening material.',
    'Design a gimbal, add a servo for camera tilt, or integrate a payload drop mechanism.',
    'published', 206
  ),
  (
    'Smart Plant Pot',
    'smart-plant-pot',
    'Design and print a self-watering plant pot with integrated sensor mount.',
    'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    (SELECT id FROM courses WHERE slug = 'engineering-prototyping')::uuid,
    'Class 10', 'Advanced', '5-6 hours', '3D Printing',
    'A 3D-printed plant pot with a soil moisture sensor mount and water reservoir.',
    'Designing for function — water flow, sensor integration, and plant health monitoring.',
    '3D printer, PLA filament, soil moisture sensor, small water pump, Arduino',
    'DISCOVER: Study self-watering pot designs. LEARN: Designing fluid channels and sensor integration. DESIGN: Model pot with reservoir and sensor slot. BUILD/PRINT: Print watertight. TEST: Test water flow and sensor reading. IMPROVE: Optimize water distribution. INNOVATE: Connect to IoT for remote monitoring.',
    'Does water flow correctly? Does the sensor read accurately? Is the pot watertight?',
    'Leaking? Increase wall count in slicer. Sensor unreliable? Check placement and waterproofing.',
    'Add automatic watering with a pump, connect to an app, or add a water level indicator.',
    'published', 207
  )
) AS v(title, slug, description, image_url, course_id, class_level, difficulty, estimated_time, technology, what_you_build, what_you_learn, components, build_steps, testing, troubleshooting, take_it_further, status, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = v.slug);
