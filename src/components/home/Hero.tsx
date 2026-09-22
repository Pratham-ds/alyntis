import { ArrowRight, Bot, BrainCircuit, Cpu, Plane, Rocket } from 'lucide-react';
import Button from '@/components/ui/Button';

const technologies = [
  { label: 'Robotics', icon: Bot },
  { label: 'AI & ML', icon: BrainCircuit },
  { label: 'IoT', icon: Cpu },
  { label: 'Drones', icon: Plane },
  { label: 'Space Tech', icon: Rocket },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-navy-800 bg-navy-950 py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute -right-32 top-16 h-72 w-72 rounded-full border border-teal-400/10" />
      <div className="absolute -right-20 top-28 h-48 w-48 rounded-full border border-cyan-400/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-400">
              <span className="h-px w-8 bg-teal-400" />
              Technology education, built around doing
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Give students a reason to <span className="text-teal-300">build.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Alyntis works with schools to turn technology lessons into working projects — from a first sensor circuit to robotics, AI, IoT, drones and space technology.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/request-demo" size="lg">
                Talk to Alyntis <ArrowRight className="h-5 w-5" />
              </Button>
              <Button to="/programs" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">
                See the programs
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-5">
              {technologies.map(({ label, icon: Icon }, index) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className="h-4 w-4 text-teal-400" />
                  <span>{label}</span>
                  {index < technologies.length - 1 && <span className="ml-2 hidden text-slate-600 sm:inline">/</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="relative overflow-hidden border border-white/10 bg-slate-900 p-2 shadow-2xl">
              <img
                src="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Student working with electronics and a robotics project"
                className="aspect-[4/3] w-full object-cover opacity-90"
                loading="eager"
              />
              <div className="absolute inset-2 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-300">Alyntis approach</p>
                  <p className="mt-1 text-lg font-semibold text-white">Learn it. Build it. Test it.</p>
                </div>
                <span className="border border-white/20 bg-navy-950/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-300">01 / 04</span>
              </div>
            </div>
            <div className="mt-3 flex justify-between border-l-2 border-teal-400 pl-4 text-xs text-slate-400">
              <span>School-ready programs</span>
              <span>Hands-on projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
