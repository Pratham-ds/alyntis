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

export interface ProjectResource {
  id: string;
  project_id: string;
  title: string;
  resource_type: 'pdf' | 'video';
  url: string;
  description: string | null;
  sort_order: number;
}

export interface Quiz {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  pass_score: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  sort_order: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  student_id: string;
  answers: Record<string, string> | null;
  score: number;
  total_questions: number;
  passed: boolean;
  created_at: string;
}

export interface ProjectCompletion {
  id: string;
  project_id: string;
  student_id: string;
  notes: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  photo_url: string | null;
  rating: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'project_completion' | 'quiz_completion' | 'quiz_attempt';
  student_id: string | null;
  student_name: string | null;
  project_id: string | null;
  project_title: string | null;
  quiz_id: string | null;
  quiz_title: string | null;
  score: number | null;
  total_questions: number | null;
  passed: boolean | null;
  read: boolean;
  created_at: string;
}
