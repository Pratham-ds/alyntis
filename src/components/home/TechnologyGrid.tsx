import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { technologies } from '@/data/technologies';

export default function TechnologyGrid() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Technology Ecosystem"
            title={
              <>
                LEARN WITH THE TOOLS
                <br />
                <span className="text-gradient">SHAPING TOMORROW.</span>
              </>
            }
            subtitle="Alyntis brings together the technologies behind modern making — from robotics and AI to connected devices, autonomous systems and 3D printing."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech, i) => (
            <Reveal key={tech.slug} delay={i * 50}>
              <Link
                to="/programs"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-xl hover:shadow-navy-900/10"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm">
                    <tech.icon className="h-5 w-5 text-navy-900" />
                  </div>
                  {tech.slug === '3d-printing' && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-navy-950/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-300 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3" />
                      New
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-navy-900">{tech.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{tech.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Explore technology
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
