import { useEffect, useState, useRef } from 'react';
import { Plus, Edit3, Trash2, Quote, X, Save, Loader2, Star, Upload, Eye, EyeOff } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

interface FormState {
  name: string;
  role: string;
  quote: string;
  rating: number;
  is_published: boolean;
}

const emptyForm: FormState = {
  name: '',
  role: '',
  quote: '',
  rating: 5,
  is_published: true,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });
    setTestimonials((data as Testimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadTestimonials(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const fileName = `testimonial-${Date.now()}.${ext}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('testimonials').getPublicUrl(filePath);
    setPhotoUrl(urlData.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (editing) {
      const { error: updateError } = await supabase
        .from('testimonials')
        .update({
          name: form.name,
          role: form.role || null,
          quote: form.quote,
          photo_url: photoUrl,
          rating: form.rating,
          is_published: form.is_published,
        })
        .eq('id', editing.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: form.name,
          role: form.role || null,
          quote: form.quote,
          photo_url: photoUrl,
          rating: form.rating,
          is_published: form.is_published,
          sort_order: testimonials.length,
        });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setPhotoUrl(null);
    loadTestimonials();
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      role: t.role || '',
      quote: t.quote,
      rating: t.rating,
      is_published: t.is_published,
    });
    setPhotoUrl(t.photo_url);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    loadTestimonials();
  };

  const togglePublish = async (t: Testimonial) => {
    await supabase
      .from('testimonials')
      .update({ is_published: !t.is_published })
      .eq('id', t.id);
    loadTestimonials();
  };

  const openAddForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setPhotoUrl(null);
    setError('');
    setShowForm(true);
  };

  return (
    <>
      <SEO title="Manage Testimonials — Alyntis Admin" description="Manage testimonials" />
      <PlatformNav links={adminLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
              <p className="mt-1 text-sm text-gray-400">
                Add and manage testimonials shown on your homepage.
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Add Testimonial
            </button>
          </div>

          {loading ? (
            <LoadingState />
          ) : testimonials.length === 0 && !showForm ? (
            <div className="mt-8">
              <EmptyState
                icon={<Quote className="h-12 w-12" />}
                title="No testimonials yet"
                message="Add testimonials from students, parents, or school partners to showcase on your homepage."
                action={
                  <button
                    onClick={openAddForm}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Testimonial
                  </button>
                }
              />
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-start"
                >
                  {t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      className="h-16 w-16 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-lg font-bold text-white">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{t.name}</h3>
                          {!t.is_published && (
                            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-3.5 w-3.5 ${
                              idx < t.rating ? 'fill-teal-400 text-teal-400' : 'fill-gray-700 text-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-300">
                      "{t.quote}"
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => togglePublish(t)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                      >
                        {t.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {t.is_published ? 'Hide' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
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

          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    {editing ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {/* Photo upload */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Photo</label>
                    <div className="flex items-center gap-4">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Preview"
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-teal-500/20"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                          <Upload className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                        >
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          {uploading ? 'Uploading...' : 'Upload Photo'}
                        </button>
                        {photoUrl && (
                          <button
                            type="button"
                            onClick={() => setPhotoUrl(null)}
                            className="ml-2 text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="e.g. Sarah Mitchell"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Role / Title</label>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Parent of 8th grader, Principal at XYZ School"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-gray-300">Testimonial *</label>
                    <textarea
                      value={form.quote}
                      onChange={(e) => setForm({ ...form, quote: e.target.value })}
                      required
                      rows={4}
                      placeholder="The testimonial quote..."
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-300">Rating</label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setForm({ ...form, rating: idx + 1 })}
                          >
                            <Star
                              className={`h-6 w-6 transition-colors ${
                                idx < form.rating
                                  ? 'fill-teal-400 text-teal-400'
                                  : 'fill-gray-700 text-gray-700 hover:fill-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-300">Visibility</label>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, is_published: !form.is_published })}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                          form.is_published
                            ? 'border-teal-500/30 bg-teal-500/10 text-teal-400'
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        {form.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        {form.is_published ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                      {error}
                    </p>
                  )}

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
                      {editing ? 'Save Changes' : 'Create Testimonial'}
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
