import { Check, Eye, TrendingUp } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const parentFeatures = [
  { icon: Eye, title: 'Projects Completed', desc: 'See exactly what your child has built.' },
  { icon: TrendingUp, title: 'Skills Developed', desc: 'Track the real skills your child is gaining.' },
  { icon: Check, title: 'Progress & Achievements', desc: 'Follow growth over time, not just marks.' },
  { icon: Eye, title: 'Innovation Portfolio', desc: 'View a portfolio of everything created.' },
];

export default function ForParents() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">
              For Parents
            </p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
              SEE WHAT YOUR CHILD
              <br />
              <span className="text-gradient">CAN BUILD.</span>
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Alyntis focuses on capability and growth — not just marks. Parents can eventually see
              projects completed, skills developed, progress, achievements, innovation portfolio and
              certificates.
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

        <Reveal delay={200}>
          <p className="mt-8 text-center text-sm text-gray-500">
            Parent access is currently in development.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
