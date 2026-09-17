import { ArrowRight, Bot, BrainCircuit, Cpu, Plane } from 'lucide-react';
import Button from '@/components/ui/Button';

const technologies = [
  { label: 'Robotics', icon: Bot },
  { label: 'AI & ML', icon: BrainCircuit },
  { label: 'IoT', icon: Cpu },
  { label: 'Drones', icon: Plane },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-dark opacity-60" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[110px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div className="animate-fade-in-up">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-teal-400">Education × Technology × Innovation</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              From Consumers to <span className="text-gradient">Makers.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Alyntis helps schools prepare students for the future through structured, hands-on learning in Robotics, Artificial Intelligence, IoT, Embedded Systems, Drone Technology and more.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/request-demo" size="lg">
                Partner With Alyntis <ArrowRight className="h-5 w-5" />
              </Button>
              <Button to="/programs" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">
                Explore Programs
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.map(({ label, icon: Icon }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-200">
                  <Icon className="h-3.5 w-3.5 text-teal-400" /> {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">
              <img
                src="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Student building a robotics project with electronic components"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-teal-400/20 bg-navy-900/95 p-4 shadow-xl backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">Learning model</p>
              <p className="mt-1 text-sm font-bold text-white">Learn → Build → Test → Innovate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
