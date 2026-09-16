import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FolderGit2, CheckCircle2, HelpCircle, TrendingUp, ArrowRight, Award, Zap, Trophy } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Course, Project, ProjectCompletion, QuizAttempt } from '@/types';
import Leaderboard from '@/components/student/Leaderboard';
import AchievementBadges from '@/components/student/AchievementBadges';

const studentLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/dashboard/courses' },
  { label: 'Projects', to: '/dashboard/projects' },
];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ courses: 0, projects: 0, completed: 0, quizzes: 0, passed: 0 });
  const [recentCompletions, setRecentCompletions] = useState<ProjectCompletion[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttempt[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [courses, projects, completions, attempts] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('project_completions').select('*, projects(title, slug)').eq('student_id', profile?.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('quiz_attempts').select('*').eq('student_id', profile?.id).order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        courses: courses.count || 0,
        projects: projects.count || 0,
        completed: completions.data?.length || 0,
        quizzes: attempts.data?.length || 0,
        passed: attempts.data?.filter((a: QuizAttempt) => a.passed).length || 0,
      });
      setRecentCompletions((completions.data as ProjectCompletion[]) || []);
      setRecentAttempts((attempts.data as QuizAttempt[]) || []);

      // Suggested projects (not yet completed)
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('sort_order')
        .limit(4);
      setAvailableProjects((projData as Project[]) || []);
      setLoading(false);
    }
    if (profile?.id) loadData();
  }, [profile?.id]);

  const statCards = [
    { label: 'Available Courses', value: stats.courses, icon: BookOpen, color: 'from-teal-500 to-cyan-500' },
    { label: 'Projects to Build', value: stats.projects, icon: FolderGit2, color: 'from-navy-700 to-navy-900' },
    { label: 'Projects Completed', value: stats.completed, icon: CheckCircle2, color: 'from-teal-500 to-cyan-500' },
    { label: 'Quizzes Passed', value: stats.passed, icon: Award, color: 'from-navy-700 to-navy-900' },
  ];

  return (
    <>
      <SEO title="My Dashboard — Alyntis" description="Student dashboard" />
      <PlatformNav links={studentLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Welcome, {profile?.full_name || 'Student'}
            </h1>
            <p className="mt-1 text-sm text-gray-400">Your maker journey at a glance.</p>
          </div>

          {loading ? (
            <LoadingState />
          ) : (
            <>
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Innovation points summary */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{innovationPoints}</p>
                      <p className="mt-1 text-sm text-gray-400">Innovation Points</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">#{myRank || '—'}</p>
                      <p className="mt-1 text-sm text-gray-400">School Rank</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{earnedBadges}</p>
                      <p className="mt-1 text-sm text-gray-400">Badges Earned</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard + Badges */}
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <Leaderboard />
                <AchievementBadges />
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Suggested projects */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Projects to Build</h2>
                    <Link to="/dashboard/projects" className="text-sm font-semibold text-teal-400 hover:text-teal-300">
                      View all →
                    </Link>
                  </div>
                  <div className="mt-4 space-y-3">
                    {availableProjects.length === 0 ? (
                      <EmptyState icon={<FolderGit2 className="h-8 w-8" />} title="No projects available" message="Check back soon for new projects." />
                    ) : (
                      availableProjects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/dashboard/projects/${project.slug}`}
                          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-teal-500/30 hover:bg-white/10"
                        >
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20">
                              <FolderGit2 className="h-5 w-5 text-teal-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{project.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{project.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-teal-400 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent activity */}
                <div>
                  <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                  <div className="mt-4 space-y-3">
                    {recentCompletions.length === 0 && recentAttempts.length === 0 ? (
                      <EmptyState
                        icon={<TrendingUp className="h-8 w-8" />}
                        title="No activity yet"
                        message="Start building projects to see your progress here."
                        action={
                          <Link to="/dashboard/projects" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
                            Browse Projects <ArrowRight className="h-4 w-4" />
                          </Link>
                        }
                      />
                    ) : (
                      <>
                        {recentCompletions.map((comp) => {
                          const p = (comp as unknown as { projects: { title: string; slug: string } | null }).projects;
                          return (
                            <div key={comp.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-400" />
                              <div>
                                <p className="text-sm font-semibold text-white">Completed: {p?.title || 'Project'}</p>
                                <p className="text-xs text-gray-500">{new Date(comp.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          );
                        })}
                        {recentAttempts.map((attempt) => (
                          <div key={attempt.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                            <HelpCircle className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-white">Quiz attempt</p>
                              <p className="text-xs text-gray-500">{new Date(attempt.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              attempt.passed ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {attempt.score}/{attempt.total_questions}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
