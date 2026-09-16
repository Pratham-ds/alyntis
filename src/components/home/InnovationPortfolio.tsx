import { Compass, FlaskConical, Hammer, Repeat2 } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const capabilities = [
  { icon: Compass, title: 'Discover', desc: 'Frame real problems, ask better questions and research possible approaches.' },
  { icon: FlaskConical, title: 'Design', desc: 'Explore ideas through experiments, digital design and rapid prototyping.' },
  { icon: Hammer, title: 'Build', desc: 'Turn concepts into working systems using modern hardware and software.' },
  { icon: Repeat2, title: 'Iterate', desc: 'Test, learn from results and improve solutions through engineering thinking.' },
];

export default function InnovationPortfolio() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">The Maker Journey</p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                FROM AN IDEA
                <br />
                <span className="text-gradient">TO A WORKING SOLUTION.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Alyntis is designed around the engineering process — not a collection of one-off activities.
                Students learn to investigate, design, build, test and improve while documenting the thinking behind their work.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
