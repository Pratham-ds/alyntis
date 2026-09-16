import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, FolderGit2, FileText, HelpCircle, Video, X, Save, Loader2, ChevronRight, ExternalLink } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Course, Project, ProjectResource, Quiz, QuizQuestion } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

const defaultImages = [
  'https://images.pexels.com/photos/7868836/pexels-photo-7868836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/15470542/pexels-photo-15470542.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/34182297/pexels-photo-34182297.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37549154/pexels-photo-37549154.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5555813/pexels-photo-5555813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18734704/pexels-photo-18734704.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminProjects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', image_url: defaultImages[0], course_id: '',
    class_level: 'Class 8', difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    estimated_time: '4-6 hours', technology: 'Robotics',
    what_you_build: '', what_you_learn: '', components: '',
    build_steps: '', testing: '', troubleshooting: '', take_it_further: '',
    status: 'published' as 'draft' | 'published',
  });

  // Detail panel state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Resource form
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resourceForm, setResourceForm] = useState({ title: '', resource_type: 'pdf' as 'pdf' | 'video', url: '', description: '' });

  // Quiz form
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState({ title: '', description: '', pass_score: 70 });
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Question form
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a' as 'a' | 'b' | 'c' | 'd',
  });

  const loadProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  const loadCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('title');
    setCourses((data as Course[]) || []);
  };

  useEffect(() => { loadProjects(); loadCourses(); }, []);

  const loadProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setDetailLoading(true);
    const [res, quiz] = await Promise.all([
      supabase.from('project_resources').select('*').eq('project_id', project.id).order('sort_order'),
      supabase.from('quizzes').select('*').eq('project_id', project.id),
    ]);
    setResources((res.data as ProjectResource[]) || []);
    setQuizzes((quiz.data as Quiz[]) || []);

    if (quiz.data && quiz.data.length > 0) {
      const { data: qs } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.data[0].id).order('sort_order');
      setQuestions((qs as QuizQuestion[]) || []);
      setActiveQuizId(quiz.data[0].id);
    } else {
      setQuestions([]);
      setActiveQuizId(null);
    }
    setDetailLoading(false);
  };

  // Project CRUD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = slugify(form.title);
    const payload = {
      title: form.title, slug, description: form.description || null,
      image_url: form.image_url || null,
      course_id: form.course_id || null,
      class_level: form.class_level || null,
      difficulty: form.difficulty, estimated_time: form.estimated_time || null,
      technology: form.technology || null,
      what_you_build: form.what_you_build || null,
      what_you_learn: form.what_you_learn || null,
      components: form.components || null,
      build_steps: form.build_steps || null,
      testing: form.testing || null,
      troubleshooting: form.troubleshooting || null,
      take_it_further: form.take_it_further || null,
      status: form.status,
    };

    if (editing) {
      await supabase.from('projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
    } else {
      await supabase.from('projects').insert({ ...payload, created_by: profile?.id });
    }
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    resetForm();
    loadProjects();
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', image_url: defaultImages[0], course_id: '',
      class_level: 'Class 8', difficulty: 'Intermediate', estimated_time: '4-6 hours', technology: 'Robotics',
      what_you_build: '', what_you_learn: '', components: '', build_steps: '',
      testing: '', troubleshooting: '', take_it_further: '', status: 'published',
    });
  };

  const handleEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title, description: project.description || '', image_url: project.image_url || defaultImages[0],
      course_id: project.course_id || '', class_level: project.class_level || 'Class 8',
      difficulty: project.difficulty || 'Intermediate', estimated_time: project.estimated_time || '',
      technology: project.technology || '', what_you_build: project.what_you_build || '',
      what_you_learn: project.what_you_learn || '', components: project.components || '',
      build_steps: project.build_steps || '', testing: project.testing || '',
      troubleshooting: project.troubleshooting || '', take_it_further: project.take_it_further || '',
      status: project.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? All associated resources and quizzes will also be deleted.')) return;
    await supabase.from('projects').delete().eq('id', id);
    if (selectedProject?.id === id) setSelectedProject(null);
    loadProjects();
  };

  // Resource CRUD
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    await supabase.from('project_resources').insert({
      project_id: selectedProject.id,
      title: resourceForm.title,
      resource_type: resourceForm.resource_type,
      url: resourceForm.url,
      description: resourceForm.description || null,
    });
    setShowResourceForm(false);
    setResourceForm({ title: '', resource_type: 'pdf', url: '', description: '' });
    loadProjectDetails(selectedProject);
  };

  const handleResourceDelete = async (id: string) => {
    if (!selectedProject) return;
    await supabase.from('project_resources').delete().eq('id', id);
    loadProjectDetails(selectedProject);
  };

  // Quiz CRUD
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    if (editingQuiz) {
      await supabase.from('quizzes').update({
        title: quizForm.title,
        description: quizForm.description || null,
        pass_score: quizForm.pass_score,
      }).eq('id', editingQuiz.id);
    } else {
      await supabase.from('quizzes').insert({
        project_id: selectedProject.id,
        title: quizForm.title,
        description: quizForm.description || null,
        pass_score: quizForm.pass_score,
      });
    }
    setShowQuizForm(false);
    setEditingQuiz(null);
    setQuizForm({ title: '', description: '', pass_score: 70 });
    loadProjectDetails(selectedProject);
  };

  const handleQuizDelete = async (id: string) => {
    if (!selectedProject) return;
    if (!confirm('Delete this quiz and all its questions?')) return;
    await supabase.from('quizzes').delete().eq('id', id);
    loadProjectDetails(selectedProject);
  };

  // Question CRUD
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizId) return;
    await supabase.from('quiz_questions').insert({
      quiz_id: activeQuizId,
      question: questionForm.question,
      option_a: questionForm.option_a,
      option_b: questionForm.option_b,
      option_c: questionForm.option_c,
      option_d: questionForm.option_d,
      correct_answer: questionForm.correct_answer,
    });
    setShowQuestionForm(false);
    setQuestionForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a' });
    if (selectedProject) loadProjectDetails(selectedProject);
  };

  const handleQuestionDelete = async (id: string) => {
    if (!selectedProject) return;
    await supabase.from('quiz_questions').delete().eq('id', id);
    loadProjectDetails(selectedProject);
  };

  return (
    <>
      <SEO title="Manage Projects — Alyntis Admin" description="Manage projects, resources and quizzes" />
      <PlatformNav links={adminLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Projects</h1>
              <p className="mt-1 text-sm text-gray-400">Create projects, add PDFs, videos and quizzes.</p>
            </div>
            <button
              onClick={() => { setEditing(null); resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : projects.length === 0 && !showForm ? (
            <div className="mt-8">
              <EmptyState
                icon={<FolderGit2 className="h-12 w-12" />}
                title="No projects yet"
                message="Create your first project with build instructions, resources and quizzes."
                action={
                  <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Add Your First Project
                  </button>
                }
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Project list */}
              <div className="lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`group overflow-hidden rounded-2xl border cursor-pointer transition-all ${
                        selectedProject?.id === project.id
                          ? 'border-teal-500/50 bg-white/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      onClick={() => loadProjectDetails(project)}
                    >
                      {project.image_url && (
                        <div className="relative h-32 overflow-hidden">
                          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                          <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            project.status === 'published' ? 'bg-teal-500 text-white' : 'bg-gray-600 text-white'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white">{project.title}</h3>
                        <p className="mt-1 line-clamp-1 text-xs text-gray-400">{project.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.technology && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{project.technology}</span>}
                          {project.class_level && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{project.class_level}</span>}
                          {project.difficulty && <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400">{project.difficulty}</span>}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/10"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => loadProjectDetails(project)}
                            className="ml-auto inline-flex items-center gap-0.5 text-xs font-semibold text-teal-400"
                          >
                            Manage <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-5">
                  {!selectedProject ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FolderGit2 className="h-10 w-10 text-gray-600" />
                      <p className="mt-3 text-sm text-gray-400">Select a project to manage its resources and quizzes.</p>
                    </div>
                  ) : detailLoading ? (
                    <LoadingState />
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-white">{selectedProject.title}</h2>
                      <p className="mt-1 text-xs text-gray-400">Manage resources and quizzes</p>

                      {/* Resources section */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Resources</h3>
                          <button
                            onClick={() => setShowResourceForm(true)}
                            className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-2 py-1 text-xs font-semibold text-teal-400 hover:bg-teal-500/30"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {resources.length === 0 ? (
                            <p className="text-xs text-gray-500">No resources yet.</p>
                          ) : (
                            resources.map((res) => (
                              <div key={res.id} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2.5">
                                {res.resource_type === 'pdf' ? (
                                  <FileText className="h-4 w-4 flex-shrink-0 text-red-400" />
                                ) : (
                                  <Video className="h-4 w-4 flex-shrink-0 text-teal-400" />
                                )}
                                <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-xs font-medium text-white hover:text-teal-400">
                                  {res.title}
                                </a>
                                <button onClick={() => handleResourceDelete(res.id)} className="text-red-400 hover:text-red-300">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Quizzes section */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white">Quizzes</h3>
                          <button
                            onClick={() => { setEditingQuiz(null); setQuizForm({ title: '', description: '', pass_score: 70 }); setShowQuizForm(true); }}
                            className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-2 py-1 text-xs font-semibold text-teal-400 hover:bg-teal-500/30"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {quizzes.length === 0 ? (
                            <p className="text-xs text-gray-500">No quizzes yet.</p>
                          ) : (
                            quizzes.map((quiz) => (
                              <div key={quiz.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4 text-teal-400" />
                                    <span className="text-xs font-semibold text-white">{quiz.title}</span>
                                  </div>
                                  <button onClick={() => handleQuizDelete(quiz.id)} className="text-red-400 hover:text-red-300">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Questions */}
                                <div className="mt-3 space-y-1.5">
                                  {questions.filter(q => q.quiz_id === quiz.id).map((q, idx) => (
                                    <div key={q.id} className="flex items-start gap-2 rounded bg-navy-950/50 p-2">
                                      <span className="text-xs font-bold text-teal-400">{idx + 1}.</span>
                                      <span className="flex-1 text-xs text-gray-300">{q.question}</span>
                                      <button onClick={() => handleQuestionDelete(q.id)} className="text-red-400">
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => { setActiveQuizId(quiz.id); setQuestionForm({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'a' }); setShowQuestionForm(true); }}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
                                  >
                                    <Plus className="h-3 w-3" />
                                    Add Question
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project form modal */}
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Title *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-300">Course</label>
                      <select
                        value={form.course_id}
                        onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                      >
                        <option value="">No course</option>
                        {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      placeholder="Brief project description..."
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-300">Class Level</label>
                      <select value={form.class_level} onChange={(e) => setForm({ ...form, class_level: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500">
                        {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Senior'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-300">Difficulty</label>
                      <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                        className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500">
                        {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <FormField label="Est. Time" value={form.estimated_time} onChange={(v) => setForm({ ...form, estimated_time: v })} />
                    <FormField label="Technology" value={form.technology} onChange={(v) => setForm({ ...form, technology: v })} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Cover Image</label>
                    <div className="flex flex-wrap gap-2">
                      {defaultImages.map((img) => (
                        <button key={img} type="button" onClick={() => setForm({ ...form, image_url: img })}
                          className={`h-14 w-20 overflow-hidden rounded-lg border-2 ${form.image_url === img ? 'border-teal-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="mb-3 text-sm font-bold text-white">Project Content</p>
                    <div className="space-y-3">
                      <TextAreaField label="What are you building?" value={form.what_you_build} onChange={(v) => setForm({ ...form, what_you_build: v })} />
                      <TextAreaField label="What will you learn?" value={form.what_you_learn} onChange={(v) => setForm({ ...form, what_you_learn: v })} />
                      <TextAreaField label="Components Required" value={form.components} onChange={(v) => setForm({ ...form, components: v })} />
                      <TextAreaField label="Step-by-Step Build" value={form.build_steps} onChange={(v) => setForm({ ...form, build_steps: v })} />
                      <TextAreaField label="Testing" value={form.testing} onChange={(v) => setForm({ ...form, testing: v })} />
                      <TextAreaField label="Troubleshooting" value={form.troubleshooting} onChange={(v) => setForm({ ...form, troubleshooting: v })} />
                      <TextAreaField label="Take It Further" value={form.take_it_further} onChange={(v) => setForm({ ...form, take_it_further: v })} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/5">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editing ? 'Save Changes' : 'Create Project'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Resource form modal */}
          {showResourceForm && selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Add Resource</h2>
                  <button onClick={() => setShowResourceForm(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleResourceSubmit} className="mt-5 space-y-4">
                  <FormField label="Title *" value={resourceForm.title} onChange={(v) => setResourceForm({ ...resourceForm, title: v })} required />
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Type</label>
                    <select value={resourceForm.resource_type} onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value as 'pdf' | 'video' })}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500">
                      <option value="pdf">PDF Document</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <FormField label="URL *" value={resourceForm.url} onChange={(v) => setResourceForm({ ...resourceForm, url: v })} required placeholder={resourceForm.resource_type === 'pdf' ? 'https://...' : 'https://youtube.com/...'} />
                  <TextAreaField label="Description" value={resourceForm.description} onChange={(v) => setResourceForm({ ...resourceForm, description: v })} />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowResourceForm(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300">Cancel</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"><Save className="h-4 w-4" /> Add</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Quiz form modal */}
          {showQuizForm && selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">{editingQuiz ? 'Edit Quiz' : 'Add Quiz'}</h2>
                  <button onClick={() => setShowQuizForm(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleQuizSubmit} className="mt-5 space-y-4">
                  <FormField label="Title *" value={quizForm.title} onChange={(v) => setQuizForm({ ...quizForm, title: v })} required />
                  <TextAreaField label="Description" value={quizForm.description} onChange={(v) => setQuizForm({ ...quizForm, description: v })} />
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Pass Score (%)</label>
                    <input type="number" min={0} max={100} value={quizForm.pass_score}
                      onChange={(e) => setQuizForm({ ...quizForm, pass_score: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowQuizForm(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300">Cancel</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"><Save className="h-4 w-4" /> {editingQuiz ? 'Save' : 'Add Quiz'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Question form modal */}
          {showQuestionForm && activeQuizId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Add Question</h2>
                  <button onClick={() => setShowQuestionForm(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={handleQuestionSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Question *</label>
                    <textarea value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} required rows={2}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Option A *" value={questionForm.option_a} onChange={(v) => setQuestionForm({ ...questionForm, option_a: v })} required />
                    <FormField label="Option B *" value={questionForm.option_b} onChange={(v) => setQuestionForm({ ...questionForm, option_b: v })} required />
                    <FormField label="Option C *" value={questionForm.option_c} onChange={(v) => setQuestionForm({ ...questionForm, option_c: v })} required />
                    <FormField label="Option D *" value={questionForm.option_d} onChange={(v) => setQuestionForm({ ...questionForm, option_d: v })} required />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Correct Answer</label>
                    <select value={questionForm.correct_answer} onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value as 'a' | 'b' | 'c' | 'd' })}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500">
                      <option value="a">Option A</option>
                      <option value="b">Option B</option>
                      <option value="c">Option C</option>
                      <option value="d">Option D</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowQuestionForm(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300">Cancel</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white"><Save className="h-4 w-4" /> Add Question</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FormField({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-300">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500" />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-300">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500" />
    </div>
  );
}
