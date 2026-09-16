export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  school: string | null;
  class_level: string | null;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  class_level: string | null;
  status: 'available' | 'coming_soon';
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  course_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  class_level: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  estimated_time: string | null;
  technology: string | null;
  what_you_build: string | null;
  what_you_learn: string | null;
  components: string | null;
  build_steps: string | null;
  testing: string | null;
  troubleshooting: string | null;
  take_it_further: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  created_at: string;
}

export type ResourceCategory = 'Manual' | 'Reference' | 'Datasheet' | 'Circuit Diagram' | 'Worksheet' | 'Safety Guide' | 'Tutorial' | 'Other';

export interface ProjectResource {
  id: string;
  project_id: string;
  title: string;
  resource_type: 'pdf' | 'video' | 'link';
  url: string | null;
  description: string | null;
  sort_order: number;
  category: ResourceCategory | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_by: string | null;
  updated_at: string | null;
  created_at: string;
}

export interface CourseResource {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  category: ResourceCategory | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  url: string | null;
  resource_type: 'pdf' | 'link';
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Quiz { id: string; project_id: string; title: string; description: string | null; pass_score: number; }
export interface QuizQuestion { id: string; quiz_id: string; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: 'a' | 'b' | 'c' | 'd'; sort_order: number; }
export interface QuizAttempt { id: string; quiz_id: string; student_id: string; answers: Record<string, string> | null; score: number; total_questions: number; passed: boolean; created_at: string; }
export interface ProjectCompletion { id: string; project_id: string; student_id: string; notes: string | null; created_at: string; }
export interface Testimonial { id: string; name: string; role: string | null; quote: string; photo_url: string | null; rating: number; is_published: boolean; sort_order: number; created_at: string; }
export interface Notification { id: string; type: 'project_completion' | 'quiz_completion' | 'quiz_attempt'; student_id: string | null; student_name: string | null; project_id: string | null; project_title: string | null; quiz_id: string | null; quiz_title: string | null; score: number | null; total_questions: number | null; passed: boolean | null; read: boolean; created_at: string; }
