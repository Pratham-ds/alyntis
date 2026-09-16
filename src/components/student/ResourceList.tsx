import { useEffect, useState } from 'react';
import { FileText, ExternalLink, Loader2, FileUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ResourceCategory } from '@/types';

interface ResourceItem {
  id: string;
  title: string;
  description: string | null;
  category: ResourceCategory | null;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  url: string | null;
  resource_type: string;
}

interface ResourceListProps {
  table: 'project_resources' | 'course_resources';
  foreignKey: string;
  ownerId: string;
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

export default function ResourceList({ table, foreignKey, ownerId }: ResourceListProps) {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from(table)
      .select('id, title, description, category, file_path, file_name, file_size, url, resource_type')
      .eq(foreignKey, ownerId)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setResources((data as ResourceItem[]) || []);
        setLoading(false);
      });
  }, [table, foreignKey, ownerId]);

  const openPdf = async (item: ResourceItem) => {
    setOpening(item.id);
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      setOpening(null);
      return;
    }
    if (item.file_path) {
      const { data } = await supabase.storage
        .from('alyntis-resources')
        .createSignedUrl(item.file_path, 300);
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
      }
      setOpening(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  if (resources.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {resources.map((res) => (
        <div
          key={res.id}
          className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-teal-500/30 hover:bg-white/10"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-500/20">
            <FileText className="h-5 w-5 text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-white">{res.title}</p>
              {res.category && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColor(res.category)}`}>
                  {res.category}
                </span>
              )}
            </div>
            {res.description && (
              <p className="mt-0.5 text-xs text-gray-400">{res.description}</p>
            )}
            <div className="mt-1.5 flex items-center gap-3">
              <button
                onClick={() => openPdf(res)}
                disabled={opening === res.id}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 transition-colors hover:text-teal-300 disabled:opacity-50"
              >
                {opening === res.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" />
                )}
                Open PDF
              </button>
              {res.file_size && (
                <span className="text-[10px] text-gray-500">{formatFileSize(res.file_size)}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
