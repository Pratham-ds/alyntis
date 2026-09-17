import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FolderGit2, CheckCircle2, Search, SlidersHorizontal } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectCompletion } from '@/types';

const studentLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/dashboard/courses' },
  { label: 'Projects', to: '/dashboard/projects' },
];

const classFilters = ['All', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];
const techFilters = ['All', 'Robotics', 'Electronics', 'IoT', 'AI', 'Embedded Systems', 'Automation', 'Drones', 'Coding'];

function normalizeClass(value?: string | number | null) {
  if (value === null || value === undefined) return '';
  const match = String(value).match(/\d+/);
  return match ? match[0] : String(value).trim().toLowerCase();
}

export default function StudentProjects() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedClass = searchParams.get('class') || 'All';
  const [projects, setProjects] = useState<Project[]>([]);
  const [completions, setCompletions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(requestedClass);
  const [selectedTech, setSelectedTech] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedClass(requestedClass || 'All');
  }, [requestedClass]);

  useEffect(() => {
    async function loadData() {
      const [{ data: projData }, { data: compData }] = await Promise.all([
        supabase.from('projects').select('*').eq('status', 'published').order('sort_order'),
        supabase.from('project_completions').select('project_id').eq('student_id', profile?.id),
      ]);
      setProjects((projData as Project[]) || []);
      setCompletions(new Set((compData as ProjectCompletion[] || []).map(c => c.project_id)));
      setLoading(false);
    }
    if (profile?.id) loadData();
  }, [profile?.id]);

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    const next = new URLSearchParams(searchParams);
    if (cls === 'All') next.delete('class');
    else next.set('class', normalizeClass(cls));
    setSearchParams(next);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedClass !== 'All' && normalizeClass(project.class_level) !== normalizeClass(selectedClass)) return false;
      if (selectedTech !== 'All' && project.technology !== selectedTech) return false;
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [projects, selectedClass, selectedTech, searchQuery]);

  return (
    <>
      <SEO title="Projects — Alyntis" description="Browse and build projects" />
      <PlatformNav links={studentLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">
              {selectedClass === 'All' ? 'Project Library' : `${selectedClass} Projects`}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {selectedClass === 'All' ? 'Browse projects, access resources and take quizzes.' : `Projects designed specifically for ${selectedClass}.`}
            </p>
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Search className="h-5 w-5 text-gray-500" />
            <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none" />
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-400"><SlidersHorizontal className="h-3.5 w-3.5" /> Class:</span>
              {classFilters.map((cls) => (
                <button key={cls} onClick={() => handleClassChange(cls)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${selectedClass === cls ? 'bg-teal-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {cls}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-400"><SlidersHorizontal className="h-3.5 w-3.5" /> Tech:</span>
              {techFilters.map((tech) => (
                <button key={tech} onClick={() => setSelectedTech(tech)} className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${selectedTech === tech ? 'bg-navy-700 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {loading ? <LoadingState /> : filteredProjects.length === 0 ? (
            <EmptyState icon={<FolderGit2 className="h-12 w-12" />} title="No projects found" message="Try adjusting your filters or search query." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const isCompleted = completions.has(project.id);
                return (
                  <Link key={project.id} to={`/dashboard/projects/${project.slug}`} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-teal-500/30 hover:bg-white/10">
                    {project.image_url && (
                      <div className="relative h-36 overflow-hidden">
                        <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                        {isCompleted && <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-teal-500 px-2 py-1 text-xs font-bold text-white"><CheckCircle2 className="h-3 w-3" /> Done</div>}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white">{project.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-400">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.technology && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{project.technology}</span>}
                        {project.class_level && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">Class {normalizeClass(project.class_level)}</span>}
                        {project.difficulty && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{project.difficulty}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
