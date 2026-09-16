import { Check, Eye, TrendingUp } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const parentFeatures = [
  { icon: Eye, title: 'Learning Evidence', desc: 'See the work students create and the thinking behind it.' },
  { icon: TrendingUp, title: 'Skills Developed', desc: 'Follow growth in practical technology and problem-solving skills.' },
  { icon: Check, title: 'Progress & Achievements', desc: 'Understand development over time beyond academic marks.' },
  { icon: Eye, title: 'Innovation Portfolio', desc: 'Keep meaningful evidence of learning, making and iteration.' },
];

export default function ForParents() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">For Families</p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
              MAKE LEARNING
              <br />
              <span className="text-gradient">VISIBLE.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Alyntis is built around visible evidence of learning — helping families understand
              the skills, work and progress developed through hands-on technology education.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {parentFeatures.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
