-- Give courses an explicit class level so curriculum can be managed and filtered by class.
ALTER TABLE courses ADD COLUMN IF NOT EXISTS class_level text;

UPDATE courses
SET class_level = split_part(title, '—', 1)
WHERE class_level IS NULL
  AND title LIKE 'Class %';

CREATE INDEX IF NOT EXISTS idx_courses_class_level ON courses(class_level);
