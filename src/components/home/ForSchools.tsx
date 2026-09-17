import { ArrowRight, Check, School } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const benefits = [
  'Class-wise, structured learning paths',
  'Hands-on robotics, AI, IoT and electronics',
  'Project-based learning with practical resources',
  'Teacher enablement and implementation support',
  'Student progress and assessment workflows',
  'A digital platform for courses, projects and quizzes',
];

export default function ForSchools() {
  return (
    <section id="schools" className="relative overflow-hidden bg-navy-950 py-16 lg:py-20">
      <div className="absolute inset-0 bg-grid-dark opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-400">For Schools</p>
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">Bring future-ready technology learning to <span className="text-gradient">your school.</span></h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Partner with Alyntis to create structured learning experiences where students learn technology by building, testing and improving real projects.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20"><Check className="h-3 w-3 text-teal-400" /></span>
                  {benefit}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/request-demo" size="lg">Partner With Alyntis <ArrowRight className="h-5 w-5" /></Button>
              <Button to="/schools" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">School Solutions</Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15"><School className="h-7 w-7 text-teal-400" /></div>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-teal-400">A practical school model</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Curriculum + Projects + Platform</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-300">Give students a clear progression from foundational concepts to advanced technologies, supported by projects, resources and assessments.</p>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-gray-300">
                <div className="rounded-xl bg-white/5 p-3">Learn</div><div className="rounded-xl bg-white/5 p-3">Build</div><div className="rounded-xl bg-white/5 p-3">Innovate</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
