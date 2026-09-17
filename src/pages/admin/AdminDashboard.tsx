import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FolderGit2, FileText, HelpCircle, Bell, Users, TrendingUp, Plus } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import { useAuth } from '@/context/AuthContext';
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

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ courses: 0, projects: 0, resources: 0, quizzes: 0, students: 0, completions: 0 });
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [courses, projects, resources, quizzes, students, completions, notifs] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('project_resources').select('id', { count: 'exact', head: true }),
        supabase.from('quizzes').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('project_completions').select('id', { count: 'exact', head: true }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({ courses: courses.count || 0, projects: projects.count || 0, resources: resources.count || 0, quizzes: quizzes.count || 0, students: students.count || 0, completions: completions.count || 0 });
      setRecentNotifications((notifs.data as Notification[]) || []);
      setLoading(false);
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Courses', value: stats.courses, icon: BookOpen, to: '/admin/courses', color: 'from-teal-500 to-cyan-500' },
    { label: 'Projects', value: stats.projects, icon: FolderGit2, to: '/admin/projects', color: 'from-navy-700 to-navy-900' },
    { label: 'Resources', value: stats.resources, icon: FileText, to: '/admin/projects', color: 'from-teal-500 to-cyan-500' },
    { label: 'Quizzes', value: stats.quizzes, icon: HelpCircle, to: '/admin/quizzes', color: 'from-navy-700 to-navy-900' },
    { label: 'Students', value: stats.students, icon: Users, to: '/admin/users', color: 'from-teal-500 to-cyan-500' },
    { label: 'Completions', value: stats.completions, icon: TrendingUp, to: '/admin', color: 'from-navy-700 to-navy-900' },
  ];

  return (
    <>
      <SEO title="Admin Dashboard — Alyntis" description="Alyntis admin dashboard" />
      <PlatformNav links={adminLinks} />
      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8"><h1 className="text-2xl font-bold text-white">Admin Dashboard</h1><p className="mt-1 text-sm text-gray-400">Welcome back, {profile?.full_name || profile?.email}. Manage your platform here.</p></div>
          {loading ? <LoadingState /> : <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map((stat) => <Link key={stat.label} to={stat.to} className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-teal-500/30 hover:bg-white/10"><div className="flex items-center justify-between"><div><p className="text-3xl font-bold text-white">{stat.value}</p><p className="mt-1 text-sm text-gray-400">{stat.label}</p></div><div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}><stat.icon className="h-6 w-6 text-white" /></div></div></Link>)}
            </div>
            <div className="mt-8"><h2 className="text-lg font-bold text-white">Quick Actions</h2><div className="mt-4 flex flex-wrap gap-3"><Link to="/admin/courses" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25"><Plus className="h-4 w-4" />Add Course</Link><Link to="/admin/projects" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add Project</Link><Link to="/admin/testimonials" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add Testimonial</Link><Link to="/admin/users" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create User</Link></div></div>
            <div className="mt-8"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white">Recent Activity</h2><Link to="/admin/notifications" className="text-sm font-semibold text-teal-400">View all →</Link></div><div className="mt-4 space-y-3">{recentNotifications.length === 0 ? <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"><Bell className="mx-auto h-8 w-8 text-gray-600" /><p className="mt-3 text-sm text-gray-400">No recent activity yet.</p></div> : recentNotifications.map((notif) => <div key={notif.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500/20"><HelpCircle className="h-5 w-5 text-teal-400" /></div><div className="flex-1"><p className="text-sm font-semibold text-white">{notif.student_name || 'A student'} <span className="font-normal text-gray-400">{notif.type === 'project_completion' && `completed ${notif.project_title}`}{notif.type === 'quiz_completion' && `passed ${notif.quiz_title}`}{notif.type === 'quiz_attempt' && `attempted ${notif.quiz_title}`}</span></p><p className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString()}</p></div>{notif.score !== null && <span className={`rounded-full px-3 py-1 text-xs font-bold ${notif.passed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{notif.score}/{notif.total_questions ?? 0}</span>}</div>)}</div></div>
          </>}
        </div>
      </div>
    </>
  );
}
