import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import ProgramCard from '@/components/ui/ProgramCard';
import Challenges from '@/components/home/Challenges';
import CTASection from '@/components/home/CTASection';
import { programs } from '@/data/programs';

export default function ProgramsPage() {
  return (
    <>
      <SEO
        title="Programs — Alyntis | Robotics, Electronics, IoT, AI, Drones"
        description="Explore Alyntis programs: Robotics, Electronics, IoT & Smart Systems, AI Foundations and Drone Technology. Hands-on, project-based learning for the technologies of tomorrow."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              Alyntis Programs
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              BUILD WITH THE TECHNOLOGIES
              <br />
              <span className="text-gradient">OF TOMORROW.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Each Alyntis program is designed around hands-on projects. Students don't just learn
              concepts — they build working systems and understand how technology really works.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Programs grid */}
      <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What We Teach"
              title={<>OUR PROGRAMS.</>}
              subtitle="From foundational electronics to advanced AI and drone technology — each program grows with the student."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <Reveal key={program.slug} delay={i * 60}>
                <ProgramCard program={program} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center">
              <p className="text-sm text-amber-800">
                Some programs are currently in development and will be available soon. Programs
                marked as "Available" are part of the current Alyntis demonstration curriculum.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Challenges />
      <CTASection />
    </>
  );
}
