import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

export async function createNotification(data: Partial<Notification> & { type: Notification['type'] }) {
  try {
    await supabase.from('notifications').insert({
      type: data.type,
      student_id: data.student_id || null,
      student_name: data.student_name || null,
      project_id: data.project_id || null,
      project_title: data.project_title || null,
      quiz_id: data.quiz_id || null,
      quiz_title: data.quiz_title || null,
      score: data.score ?? null,
      passed: data.passed ?? null,
      read: false,
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}
