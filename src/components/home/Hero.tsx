import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const technologies = ['Robotics', 'AI', 'IoT', 'Embedded Systems', 'Electronics', 'Automation', 'Drones', '3D Printing'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-20 pb-20 lg:pt-32 lg:pb-32">
      <div className="absolute inset-0 bg-grid-dark animate-network" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-in-up">
            <Badge variant="light" className="mb-6">
              <Sparkles className="h-3 w-3" />
              Technology Learning for the Maker Generation
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              PREPARE STUDENTS
              <br />
              <span className="text-gradient">TO BUILD THE FUTURE.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Alyntis brings structured, hands-on technology learning into schools — helping students
              move from using technology to understanding, designing and building with it.
            </p>

            <div className="mt-6 flex max-w-2xl flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-300">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/mission" size="lg">
                Explore Alyntis
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button to="/schools" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">
                Partner With Us
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-2 backdrop-blur-sm">
              <img
                src="https://images.pexels.com/photos/7869048/pexels-photo-7869048.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Young builder assembling a robotics project with electronic components"
                className="rounded-xl"
                loading="eager"
              />
            </div>

            <div className="absolute -left-4 top-1/4 hidden animate-float rounded-xl border border-white/10 bg-navy-900/90 p-3 shadow-xl backdrop-blur-md sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
                  <span className="text-sm font-bold text-teal-400">AI</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Artificial Intelligence</p>
                  <p className="text-[10px] text-gray-400">Intelligent Systems</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 hidden animate-float rounded-xl border border-white/10 bg-navy-900/90 p-3 shadow-xl backdrop-blur-md sm:block" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                  <span className="text-sm font-bold text-cyan-400">3D</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">3D Printing</p>
                  <p className="text-[10px] text-gray-400">Digital to Physical</p>
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
