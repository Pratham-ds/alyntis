import { supabase } from '@/lib/supabase';
import type { BadgeDefinition, InnovationReason } from '@/types';

export const POINT_VALUES: Record<InnovationReason, number> = {
  lesson_completed: 5,
  project_completed: 50,
  project_evidence_submitted: 20,
  teacher_approved_project: 25,
  improvement_after_feedback: 30,
  innovation_challenge_completed: 75,
  independent_project: 100,
  '3d_printing_project_completed': 50,
};

export const POINT_LABELS: Record<InnovationReason, string> = {
  lesson_completed: 'Lesson Completed',
  project_completed: 'Project Completed',
  project_evidence_submitted: 'Project Evidence Submitted',
  teacher_approved_project: 'Teacher-Approved Project',
  improvement_after_feedback: 'Improvement After Feedback',
  innovation_challenge_completed: 'Innovation Challenge Completed',
  independent_project: 'Independent Project',
  '3d_printing_project_completed': '3D Printing Project Completed',
};

export const BADGES: BadgeDefinition[] = [
  { key: 'robotics_explorer', name: 'Robotics Explorer', description: 'Completed 3 robotics projects', icon: 'Bot', color: 'from-teal-500 to-cyan-500' },
  { key: 'electronics_builder', name: 'Electronics Builder', description: 'Completed 3 electronics projects', icon: 'CircuitBoard', color: 'from-amber-500 to-orange-500' },
  { key: 'iot_innovator', name: 'IoT Innovator', description: 'Completed 3 IoT projects', icon: 'Wifi', color: 'from-blue-500 to-indigo-500' },
  { key: 'ai_explorer', name: 'AI Explorer', description: 'Completed 3 AI projects', icon: 'Brain', color: 'from-purple-500 to-pink-500' },
  { key: 'drone_pioneer', name: 'Drone Pioneer', description: 'Completed 3 drone projects', icon: 'Plane', color: 'from-sky-500 to-blue-500' },
  { key: '3d_design_creator', name: '3D Design Creator', description: 'Completed 3 3D printing projects', icon: 'Box', color: 'from-green-500 to-emerald-500' },
  { key: 'problem_solver', name: 'Problem Solver', description: 'Earned 500 innovation points', icon: 'Lightbulb', color: 'from-yellow-500 to-amber-500' },
  { key: 'innovation_champion', name: 'Innovation Champion', description: 'Earned 1000 innovation points', icon: 'Trophy', color: 'from-orange-500 to-red-500' },
];

export async function awardPoints(
  studentId: string,
  reason: InnovationReason,
  referenceId?: string,
  referenceType?: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('award_innovation_points', {
    p_student_id: studentId,
    p_points: POINT_VALUES[reason],
    p_reason: reason,
    p_reference_id: referenceId || null,
    p_reference_type: referenceType || null,
    p_metadata: null,
  });

  if (error) {
    console.error('Failed to award points:', error);
    return false;
  }

  return data as boolean;
}

export async function awardBadge(studentId: string, badgeKey: string): Promise<void> {
  await supabase.rpc('award_achievement_badge', {
    p_student_id: studentId,
    p_badge_key: badgeKey,
  });
}

export async function checkAndAwardBadges(
  studentId: string,
  totalPoints: number,
  completedByTechnology: Record<string, number>,
): Promise<void> {
  const badgesToAward: string[] = [];

  if ((completedByTechnology['Robotics'] || 0) >= 3) badgesToAward.push('robotics_explorer');
  if ((completedByTechnology['Electronics'] || 0) >= 3) badgesToAward.push('electronics_builder');
  if ((completedByTechnology['IoT'] || 0) >= 3) badgesToAward.push('iot_innovator');
  if ((completedByTechnology['AI'] || 0) >= 3) badgesToAward.push('ai_explorer');
  if ((completedByTechnology['Drones'] || 0) >= 3) badgesToAward.push('drone_pioneer');
  if ((completedByTechnology['3D Printing'] || 0) >= 3) badgesToAward.push('3d_design_creator');
  if (totalPoints >= 500) badgesToAward.push('problem_solver');
  if (totalPoints >= 1000) badgesToAward.push('innovation_champion');

  for (const key of badgesToAward) {
    await awardBadge(studentId, key);
  }
}
