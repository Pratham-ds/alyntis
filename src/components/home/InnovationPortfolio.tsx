import { ArrowUpRight, Brain, Cpu, Plane, Printer } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const capabilities = [
  { icon: Brain, label: 'AI & Intelligent Systems' },
  { icon: Cpu, label: 'Embedded & Connected Devices' },
  { icon: Plane, label: 'Drone & Autonomous Technology' },
  { icon: Printer, label: '3D Design & Prototyping' },
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
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
                Innovation Portfolio
              </p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                TURN LEARNING INTO
                <br />
                <span className="text-gradient">EVIDENCE OF CAPABILITY.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Students document what they learn, build and improve so their progress becomes a
                meaningful record of skills, experimentation and problem-solving.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                The portfolio is designed to show the thinking behind the work — not just the final
                outcome.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {capabilities.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                      <item.icon className="h-4 w-4 text-teal-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs text-gray-400">Student Maker Profile</p>
                  <p className="mt-1 text-lg font-bold text-white">Innovation Portfolio</p>
                </div>
                <span className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-400">
                  Growing
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ['Skills', 'Technology · Problem Solving · Design'],
                  ['Build Evidence', 'Images · Resources · Submissions'],
                  ['Iteration', 'Feedback · Testing · Improvements'],
                  ['Achievements', 'Challenges · Certificates · Milestones'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <ArrowUpRight className="h-4 w-4 text-teal-400" />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">The goal</p>
                <p className="mt-1 text-sm font-medium text-gray-200">Make learning visible.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
