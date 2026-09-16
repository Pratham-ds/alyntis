import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const technologies = [
  'Robotics',
  'Artificial Intelligence',
  'IoT',
  'Embedded Systems',
  'Electronics',
  'Automation',
  'Drone Technology',
  '3D Printing',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-20 pb-20 lg:pt-28 lg:pb-28">
      <div className="absolute inset-0 bg-grid-dark animate-network" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/30 via-navy-950/80 to-navy-950" />
      <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-[130px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[110px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-in-up">
            <Badge variant="light" className="mb-6">
              <Sparkles className="h-3 w-3" />
              From Consumers to Makers
            </Badge>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              BUILD THE SKILLS.
              <br />
              <span className="text-gradient">BUILD THE FUTURE.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Alyntis is a technology learning platform that helps students move from consuming
              technology to understanding it, building with it and solving real-world problems.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/programs" size="lg">
                Explore Learning
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                to="/request-demo"
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400"
              >
                For Schools
              </Button>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 border-t border-white/10 pt-6">
              <div>
                <p className="text-sm font-semibold text-white">Hands-on</p>
                <p className="mt-1 text-xs text-gray-400">Build-led learning</p>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-6">
                <p className="text-sm font-semibold text-white">Class-wise</p>
                <p className="mt-1 text-xs text-gray-400">Structured progression</p>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-6">
                <p className="text-sm font-semibold text-white">Future-ready</p>
                <p className="mt-1 text-xs text-gray-400">Modern technologies</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-2 shadow-2xl shadow-black/20 backdrop-blur-sm">
              <img
                src="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Young maker assembling a robotics project with electronic components"
                className="aspect-[4/3] rounded-2xl object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-navy-950/85 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">Maker Ecosystem</p>
                    <p className="mt-1 text-sm font-semibold text-white">Learn → Build → Improve → Innovate</p>
                  </div>
                  <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 sm:flex">
                    <span className="text-sm font-bold text-teal-300">01</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-1/4 hidden animate-float rounded-xl border border-white/10 bg-navy-900/90 p-3 shadow-xl backdrop-blur-md sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
                  <span className="text-teal-400 text-sm font-bold">AI</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Intelligent Systems</p>
                  <p className="text-[10px] text-gray-400">AI & machine learning</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-5 bottom-1/4 hidden animate-float rounded-xl border border-white/10 bg-navy-900/90 p-3 shadow-xl backdrop-blur-md sm:block" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                  <span className="text-cyan-400 text-sm font-bold">3D</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">3D Printing</p>
                  <p className="text-[10px] text-gray-400">Digital ideas to objects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
