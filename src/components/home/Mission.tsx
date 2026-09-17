import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const shifts = [
  ['Consume', 'Create'],
  ['Use', 'Build'],
  ['Memorize', 'Understand'],
  ['Copy', 'Innovate'],
];

export default function Mission() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-600">What is Alyntis?</p>
            <h2 className="text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">Preparing students to <span className="text-gradient">build the future.</span></h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Alyntis is an education and technology platform focused on practical STEM learning. We help schools introduce emerging technologies through structured programs, hands-on projects and technology-driven learning experiences.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Robotics', 'Artificial Intelligence', 'Machine Learning', 'IoT', 'Embedded Systems', 'Electronics', 'Drone Technology', 'Automation'].map((item) => (
                <span key={item} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-navy-700">{item}</span>
              ))}
            </div>
            <div className="mt-7">
              <Button to="/about" variant="outline" size="md">About Alyntis <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-3xl bg-gray-50 p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-navy-700">The learning shift</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {shifts.map(([from, to]) => (
                  <div key={from} className="flex items-center gap-3 rounded-xl border border-white bg-white p-4 shadow-sm">
                    <span className="text-sm text-gray-400 line-through">{from}</span>
                    <ArrowRight className="h-4 w-4 text-teal-500" />
                    <span className="text-sm font-bold text-navy-900">{to}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
