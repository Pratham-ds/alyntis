import { BookOpen, Lightbulb, PencilRuler, Wrench } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const steps = [
  { num: '01', title: 'Choose a Level', desc: 'Students follow a learning path matched to their class and technology level.', icon: BookOpen },
  { num: '02', title: 'Learn the Concepts', desc: 'Understand the science, technology and problem-solving concepts behind each build.', icon: PencilRuler },
  { num: '03', title: 'Build & Test', desc: 'Apply learning through structured, hands-on projects and practical experiments.', icon: Wrench },
  { num: '04', title: 'Improve & Innovate', desc: 'Reflect, debug, modify and take projects further with original ideas.', icon: Lightbulb },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-600">How Alyntis Works</p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">From learning to <span className="text-gradient">real innovation.</span></h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.num} delay={index * 60}>
              <div className="h-full rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-teal-500/40">{step.num}</span>
                  <step.icon className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
