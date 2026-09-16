import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { classLevels } from '@/data/classLevels';

export default function ClassWiseLearning() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Class-Wise Learning"
            title={
              <>
                LEARNING THAT GROWS
                <br />
                <span className="text-gradient">WITH THE STUDENT.</span>
              </>
            }
            subtitle="Alyntis organizes projects and learning experiences according to student level — so complexity increases as understanding deepens."
          />
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classLevels.map((cls, i) => (
            <Reveal key={cls.level} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
                <div
                  className="absolute right-0 top-0 h-24 w-24 rounded-bl-full opacity-5 transition-opacity group-hover:opacity-10"
                  style={{
                    background: `linear-gradient(135deg, #14b8a6, #06b6d4)`,
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-teal-600">
                    {cls.level}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full ${
                          idx < cls.complexity ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-navy-900">{cls.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{cls.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Button to="/login" variant="outline" size="lg">
              Access the Project Library
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
