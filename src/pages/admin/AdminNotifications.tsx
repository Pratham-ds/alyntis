import { useEffect, useState } from 'react';
import { Bell, Check, FolderGit2, HelpCircle, CheckCheck, Trash2 } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    setNotifications((data as Notification[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadNotifications(); }, []);

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    loadNotifications();
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    loadNotifications();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    loadNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <SEO title="Notifications — Alyntis Admin" description="Admin notifications" />
      <PlatformNav links={adminLinks} notifications={{ count: unreadCount }} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="mt-1 text-sm text-gray-400">
                Student activity notifications. {unreadCount} unread.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                {filter === 'all' ? 'Show Unread Only' : 'Show All'}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/20 px-4 py-2 text-xs font-semibold text-teal-400 hover:bg-teal-500/30"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={<Bell className="h-12 w-12" />}
                title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                message={filter === 'unread' ? 'All caught up!' : 'You\'ll see notifications here when students complete projects or quizzes.'}
              />
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filtered.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                    notif.read
                      ? 'border-white/5 bg-white/5'
                      : 'border-teal-500/30 bg-teal-500/5'
                  }`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                    notif.type === 'project_completion' ? 'bg-teal-500/20' : 'bg-cyan-500/20'
                  }`}>
                    {notif.type === 'project_completion' ? (
                      <FolderGit2 className="h-5 w-5 text-teal-400" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {notif.student_name || 'A student'}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {notif.type === 'project_completion' && `completed the project "${notif.project_title}"`}
                      {notif.type === 'quiz_completion' && `passed the quiz "${notif.quiz_title}"`}
                      {notif.type === 'quiz_attempt' && `attempted the quiz "${notif.quiz_title}"`}
                    </p>
                    {notif.score !== null && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          notif.passed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          Score: {notif.score}/{notif.total_questions ?? 0}
                        </span>
                        {notif.passed ? (
                          <span className="text-xs text-green-400">Passed</span>
                        ) : (
                          <span className="text-xs text-amber-400">Did not pass</span>
                        )}
                      </div>
                    )}
                    <p className="mt-1.5 text-xs text-gray-500">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="rounded-lg p-1.5 text-teal-400 hover:bg-white/10"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
