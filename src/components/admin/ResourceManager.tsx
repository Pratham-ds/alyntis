import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText, Upload, Trash2, Edit3, X, Save, Loader2, Plus,
  AlertCircle, CheckCircle2, ExternalLink, FileUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ResourceCategory } from '@/types';

const CATEGORIES: ResourceCategory[] = [
  'Manual', 'Reference', 'Datasheet', 'Circuit Diagram',
  'Worksheet', 'Safety Guide', 'Tutorial', 'Other',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024;

interface ResourceItem {
  id: string;
  title: string;
  description: string | null;
  category: ResourceCategory | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  url: string | null;
  resource_type: string;
  sort_order: number;
}

interface ResourceManagerProps {
  table: 'project_resources' | 'course_resources';
  ownerId: string;
  ownerType: 'project' | 'course';
  storagePrefix: string;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function categoryColor(cat: ResourceCategory | null): string {
  const map: Record<string, string> = {
    Manual: 'bg-teal-500/20 text-teal-400',
    Reference: 'bg-cyan-500/20 text-cyan-400',
    Datasheet: 'bg-amber-500/20 text-amber-400',
    'Circuit Diagram': 'bg-purple-500/20 text-purple-400',
    Worksheet: 'bg-blue-500/20 text-blue-400',
    'Safety Guide': 'bg-red-500/20 text-red-400',
    Tutorial: 'bg-green-500/20 text-green-400',
    Other: 'bg-gray-500/20 text-gray-400',
  };
  return map[cat || 'Other'] || map.Other;
}

export default function ResourceManager({
  table, ownerId, ownerType, storagePrefix,
}: ResourceManagerProps) {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ResourceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Manual' as ResourceCategory,
    url: '',
  });

  const loadResources = useCallback(async () => {
    const col = ownerType === 'project' ? 'project_id' : 'course_id';
    const { data } = await supabase
      .from(table)
      .select('*')
      .eq(col, ownerId)
      .order('sort_order', { ascending: true });
    setResources((data as ResourceItem[]) || []);
    setLoading(false);
  }, [table, ownerType, ownerId]);

  useEffect(() => { loadResources(); }, [loadResources]);

  const resetFileState = () => {
    setFilePath(null);
    setFileName(null);
    setFileSize(null);
    setUploadProgress(0);
  };

  const openAddForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'Manual', url: '' });
    resetFileState();
    setError('');
    setShowForm(true);
  };

  const openEditForm = (item: ResourceItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || '',
      category: item.category || 'Manual',
      url: item.url || '',
    });
    setFilePath(item.file_path);
    setFileName(item.file_name);
    setFileSize(item.file_size);
    setError('');
    setShowForm(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File must be under 25 MB.');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    const uuid = crypto.randomUUID();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${storagePrefix}/${ownerId}/${uuid}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('alyntis-resources')
      .upload(path, file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    setFilePath(path);
    setFileName(file.name);
    setFileSize(file.size);
    setUploadProgress(100);
    setUploading(false);

    if (!form.title) {
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      setForm((prev) => ({ ...prev, title: nameWithoutExt }));
    }
  };

  const removeFile = async () => {
    if (filePath && filePath !== editing?.file_path) {
      await supabase.storage.from('alyntis-resources').remove([filePath]);
    }
    resetFileState();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const col = ownerType === 'project' ? 'project_id' : 'course_id';
    const hasFile = !!filePath;
    const hasUrl = !!form.url.trim();

    if (!hasFile && !hasUrl && !editing?.url) {
      setError('Please upload a PDF or provide a URL.');
      setSaving(false);
      return;
    }

    const payload = {
      [col]: ownerId,
      title: form.title,
      description: form.description || null,
      category: form.category,
      file_path: filePath,
      file_name: fileName,
      file_size: fileSize,
      mime_type: hasFile ? 'application/pdf' : null,
      resource_type: hasFile ? 'pdf' : 'link',
      url: hasUrl ? form.url.trim() : null,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      // If replacing file, delete old one
      if (editing.file_path && filePath && filePath !== editing.file_path) {
        await supabase.storage.from('alyntis-resources').remove([editing.file_path]);
      }
      const { error: updateError } = await supabase
        .from(table)
        .update(payload)
        .eq('id', editing.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
      setSuccess('Resource updated successfully.');
    } else {
      const { error: insertError } = await supabase
        .from(table)
        .insert({ ...payload, sort_order: resources.length });
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
      setSuccess('Resource added successfully.');
    }

    setSaving(false);
    setShowForm(false);
    setEditing(null);
    resetFileState();
    setForm({ title: '', description: '', category: 'Manual', url: '' });
    loadResources();
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleDelete = async (item: ResourceItem) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    if (item.file_path) {
      await supabase.storage.from('alyntis-resources').remove([item.file_path]);
    }
    await supabase.from(table).delete().eq('id', item.id);
    loadResources();
    setSuccess('Resource deleted.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const openPdf = async (item: ResourceItem) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (item.file_path) {
      const { data } = await supabase.storage
        .from('alyntis-resources')
        .createSignedUrl(item.file_path, 300);
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Resources</h3>
          {resources.length > 0 && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
              {resources.length}
            </span>
          )}
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-2.5 py-1.5 text-xs font-semibold text-teal-400 transition-colors hover:bg-teal-500/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Resource
        </button>
      </div>

      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-2.5 text-xs text-green-300">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          {success}
        </div>
      )}

      {loading ? (
        <div className="mt-4 flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      ) : resources.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-white/10 p-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-2 text-xs text-gray-500">
            No resources yet. Add PDFs like manuals, datasheets, or worksheets.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                <FileText className="h-4 w-4 text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-white">{res.title}</p>
                  {res.category && (
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColor(res.category)}`}>
                      {res.category}
                    </span>
                  )}
                </div>
                {res.description && (
                  <p className="truncate text-xs text-gray-400">{res.description}</p>
                )}
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                  {res.file_name && <span>{res.file_name}</span>}
                  {res.file_size && <span>· {formatFileSize(res.file_size)}</span>}
                  {res.url && !res.file_path && <span>External link</span>}
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  onClick={() => openPdf(res)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Open"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => openEditForm(res)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  title="Edit"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(res)}
                  className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editing ? 'Edit Resource' : 'Add Resource'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* PDF Upload */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">PDF File</label>
                {filePath ? (
                  <div className="flex items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-500/10 p-3">
                    <FileText className="h-5 w-5 flex-shrink-0 text-teal-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{fileName}</p>
                      {fileSize && (
                        <p className="text-xs text-gray-400">{formatFileSize(fileSize)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : uploading ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                      <span className="text-sm text-gray-300">Uploading...</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-teal-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-6 text-sm text-gray-400 transition-colors hover:border-teal-500/40 hover:text-teal-400"
                    >
                      <FileUp className="h-5 w-5" />
                      Click to upload PDF (max 25 MB)
                    </button>
                  </div>
                )}
              </div>

              {/* Or URL */}
              {!filePath && !uploading && (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-300">
                    Or provide a URL
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://example.com/document.pdf"
                    className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Project Manual"
                  className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as ResourceCategory })}
                  className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-300">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description of this resource..."
                  className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-teal-500"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
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
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {editing ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
