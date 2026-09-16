import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { challenges } from '@/data/challenges';

export default function Challenges() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Real-World Challenges"
            title={
              <>
                SOLVE PROBLEMS
                <br />
                <span className="text-gradient">THAT MATTER.</span>
              </>
            }
            subtitle="Alyntis Challenges give students real-world problems to solve — following a structured path from problem to solution."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {challenges.map((challenge, i) => (
            <Reveal key={challenge.slug} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 transition-colors group-hover:bg-teal-500">
                  <challenge.icon className="h-6 w-6 text-teal-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{challenge.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{challenge.description}</p>
                <span className="mt-4 inline-block rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
                  {challenge.category}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 rounded-2xl border border-teal-100 bg-teal-50/50 p-6 text-center">
            <p className="text-sm font-semibold text-navy-700">
              Every challenge follows: Problem → Research → Design → Build → Test → Submit → Improve
            </p>
            <div className="mt-4">
              <Button to="/programs" variant="outline" size="md">
                Explore Challenges
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
