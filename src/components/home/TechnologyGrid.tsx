import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { technologies } from '@/data/technologies';

export default function TechnologyGrid() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="The technology students can explore"
            title={
              <>
                FROM FIRST CIRCUIT TO
                <br />
                <span className="text-teal-600">SPACE TECHNOLOGY.</span>
              </>
            }
            subtitle="Alyntis brings together the physical and digital sides of technology education — students can code, wire, prototype, fly, analyse and build."
          />
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-5">
          {technologies.map((tech, i) => (
            <Reveal key={tech.slug} delay={i * 40}>
              <Link
                to="/programs"
                className="group flex h-full min-h-[310px] flex-col bg-white transition-colors hover:bg-navy-950"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="h-full w-full object-cover grayscale-[15%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center bg-white text-navy-900">
                    <tech.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400 group-hover:text-teal-300">0{i + 1}</p>
                  <h3 className="mt-2 text-lg font-bold text-navy-900 group-hover:text-white">{tech.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 group-hover:text-gray-300">{tech.description}</p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-600 group-hover:text-teal-300">
                    Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
