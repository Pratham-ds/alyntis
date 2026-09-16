import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';
import type { Testimonial } from '@/types';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setTestimonials((data as Testimonial[]) || []);
        setLoading(false);
      });
  }, []);

  if (!loading && testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              Voices of Alyntis
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              STORIES FROM OUR
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                COMMUNITY
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-400">
              Students, parents, and educators share their experiences building, learning, and
              growing with Alyntis.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:border-teal-500/30 hover:bg-white/[0.07]">
                  <Quote className="absolute top-6 right-6 h-10 w-10 text-teal-500/20" />

                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < t.rating
                            ? 'fill-teal-400 text-teal-400'
                            : 'fill-gray-700 text-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    "{t.quote}"
                  </p>

                  <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
                    {t.photo_url ? (
                      <img
                        src={t.photo_url}
                        alt={t.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-500/20"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
