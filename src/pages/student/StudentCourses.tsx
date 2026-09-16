import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Course, Project } from '@/types';

const studentLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/dashboard/courses' },
  { label: 'Projects', to: '/dashboard/projects' },
];

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [projectCounts, setProjectCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [{ data: courseData }, { data: projData }] = await Promise.all([
        supabase.from('courses').select('*').eq('status', 'available').order('sort_order'),
        supabase.from('projects').select('id, course_id').eq('status', 'published'),
      ]);

      const counts: Record<string, number> = {};
      (projData || []).forEach((p: { course_id: string | null }) => {
        if (p.course_id) counts[p.course_id] = (counts[p.course_id] || 0) + 1;
      });

      setCourses((courseData as Course[]) || []);
      setProjectCounts(counts);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <SEO title="Courses — Alyntis" description="Browse available courses" />
      <PlatformNav links={studentLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Courses</h1>
            <p className="mt-1 text-sm text-gray-400">Browse technology courses and start building.</p>
          </div>

          {loading ? (
            <LoadingState />
          ) : courses.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No courses available yet"
              message="Check back soon — new courses are being added."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to="/dashboard/projects"
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-teal-500/30 hover:bg-white/10"
                >
                  {course.image_url && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={course.image_url} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">{course.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {projectCounts[course.id] || 0} {(projectCounts[course.id] || 0) === 1 ? 'project' : 'projects'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-400">
                        Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
