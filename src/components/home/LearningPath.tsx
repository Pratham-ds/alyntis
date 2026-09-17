import { ArrowRight, Bot, BrainCircuit, Code2, Plane, Radio } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const levels = [
  { level: 'Foundation', title: 'Explore & Discover', icon: Code2, desc: 'Coding, computational thinking, creativity and basic electronics.' },
  { level: 'Build', title: 'Robotics & Electronics', icon: Bot, desc: 'Microcontrollers, sensors, circuits, mechanisms and robot builds.' },
  { level: 'Connect', title: 'IoT & Embedded', icon: Radio, desc: 'Connected devices, automation, sensors and embedded systems.' },
  { level: 'Create', title: 'AI & Machine Learning', icon: BrainCircuit, desc: 'AI concepts, data, computer vision and practical ML projects.' },
  { level: 'Innovate', title: 'Drones & Advanced Tech', icon: Plane, desc: 'Flight systems, autonomy and interdisciplinary innovation projects.' },
];

export default function LearningPath() {
  return (
    <section id="programs" className="relative overflow-hidden bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-600">Structured Learning</p>
              <h2 className="text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">A clear technology journey, <span className="text-gradient">class by class.</span></h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">Learning progresses from foundational concepts to advanced technology, with projects and quizzes reinforcing every stage.</p>
            </div>
            <Button to="/programs" variant="outline" size="md">View Programs <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {levels.map((item, index) => (
            <Reveal key={item.level} delay={index * 60}>
              <div className="relative h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-teal-600">{item.level}</span><item.icon className="h-5 w-5 text-navy-700" /></div>
                <h3 className="mt-5 text-base font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
