import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, BookOpen, X, Save, Loader2 } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Course } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

const defaultImages = [
  'https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/459411/pexels-photo-459411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5555813/pexels-photo-5555813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminCourses() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: defaultImages[0],
    status: 'available' as 'available' | 'coming_soon',
  });
  const [saving, setSaving] = useState(false);

  const loadCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('sort_order', { ascending: true });
    setCourses((data as Course[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadCourses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = slugify(form.title);

    if (editing) {
      await supabase.from('courses').update({
        title: form.title,
        slug,
        description: form.description || null,
        image_url: form.image_url || null,
        status: form.status,
        updated_at: new Date().toISOString(),
      }).eq('id', editing.id);
    } else {
      await supabase.from('courses').insert({
        title: form.title,
        slug,
        description: form.description || null,
        image_url: form.image_url || null,
        status: form.status,
        created_by: profile?.id,
      });
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', image_url: defaultImages[0], status: 'available' });
    loadCourses();
  };

  const handleEdit = (course: Course) => {
    setEditing(course);
    setForm({
      title: course.title,
      description: course.description || '',
      image_url: course.image_url || defaultImages[0],
      status: course.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? Projects in this course will remain but lose their course association.')) return;
    await supabase.from('courses').delete().eq('id', id);
    loadCourses();
  };

  return (
    <>
      <SEO title="Manage Courses — Alyntis Admin" description="Manage Alyntis courses" />
      <PlatformNav links={adminLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Courses</h1>
              <p className="mt-1 text-sm text-gray-400">Create and organize technology courses.</p>
            </div>
            <button
              onClick={() => { setEditing(null); setForm({ title: '', description: '', image_url: defaultImages[0], status: 'available' }); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : courses.length === 0 && !showForm ? (
            <div className="mt-8">
              <EmptyState
                icon={<BookOpen className="h-12 w-12" />}
                title="No courses yet"
                message="Create your first course to start organizing projects for students."
                action={
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Course
                  </button>
                }
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  {course.image_url && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={course.image_url} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent" />
                      <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        course.status === 'available' ? 'bg-teal-500 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {course.status === 'available' ? 'Available' : 'Coming Soon'}
                      </span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-400">{course.description}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{editing ? 'Edit Course' : 'New Course'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="e.g. Robotics Fundamentals"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      placeholder="Brief description of the course..."
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Cover Image</label>
                    <div className="flex flex-wrap gap-2">
                      {defaultImages.map((img) => (
                        <button
                          key={img}
                          type="button"
                          onClick={() => setForm({ ...form, image_url: img })}
                          className={`h-16 w-24 overflow-hidden rounded-lg border-2 transition-colors ${
                            form.image_url === img ? 'border-teal-500' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Cover option" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'coming_soon' })}
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                    >
                      <option value="available">Available</option>
                      <option value="coming_soon">Coming Soon</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editing ? 'Save Changes' : 'Create Course'}
                    </button>
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
