import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const shifts = [
  { from: 'Consume', to: 'Create' },
  { from: 'Use', to: 'Build' },
  { from: 'Follow', to: 'Question' },
  { from: 'Memorize', to: 'Understand' },
  { from: 'Copy', to: 'Innovate' },
];

export default function Mission() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">
              The Alyntis Mission
            </p>
            <h2 className="text-3xl font-bold leading-tight text-navy-900 sm:text-4xl lg:text-5xl">
              THIS IS NOT JUST EDUCATION.
              <br />
              <span className="text-gradient">THIS IS A MISSION.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="space-y-5 text-gray-600">
              <p className="text-lg leading-relaxed">
                Technology is transforming the world faster than ever.
              </p>
              <p className="text-lg leading-relaxed">
                Alyntis exists to prepare young minds for that future — not simply by teaching them
                how to use technology, but by helping them understand how technology works, build
                with it, experiment with it and create solutions with it.
              </p>
              <div className="rounded-2xl border-l-4 border-teal-500 bg-teal-50/50 py-4 pl-6 pr-4">
                <p className="text-2xl font-bold text-navy-900">
                  FROM CONSUMERS TO MAKERS.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-3">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-navy-700">
                The Shift Alyntis Drives
              </p>
              {shifts.map((shift) => (
                <div
                  key={shift.from}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
                >
                  <span className="text-lg font-medium text-gray-400 line-through decoration-gray-300">
                    {shift.from}
                  </span>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-teal-500 transition-transform group-hover:translate-x-1" />
                  <span className="text-lg font-bold text-navy-900">{shift.to}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-12 text-center">
            <Button to="/mission" variant="outline" size="md">
              Read Our Full Mission
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
