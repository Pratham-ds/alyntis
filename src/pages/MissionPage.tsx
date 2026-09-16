import { ArrowRight } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import Philosophy from '@/components/home/Philosophy';
import WhyAlyntis from '@/components/home/WhyAlyntis';
import FutureVision from '@/components/home/FutureVision';
import CTASection from '@/components/home/CTASection';

const shifts = [
  { from: 'Consume', to: 'Create', desc: 'Stop scrolling. Start building.' },
  { from: 'Use', to: 'Build', desc: 'Don\'t just use apps. Build the systems behind them.' },
  { from: 'Follow', to: 'Question', desc: 'Don\'t follow instructions blindly. Ask why they work.' },
  { from: 'Memorize', to: 'Understand', desc: 'Don\'t memorize facts. Understand principles.' },
  { from: 'Copy', to: 'Innovate', desc: 'Don\'t copy solutions. Create better ones.' },
];

export default function MissionPage() {
  return (
    <>
      <SEO
        title="Our Mission — Alyntis | From Consumers to Makers"
        description="Alyntis exists to prepare young minds for the future — not by teaching them how to use technology, but by helping them understand, build and innovate with it."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              The Alyntis Mission
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              THIS IS NOT JUST EDUCATION.
              <br />
              <span className="text-gradient">THIS IS A MISSION.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Technology is transforming the world faster than ever. Alyntis exists to prepare young
              minds for that future — not simply by teaching them how to use technology, but by
              helping them understand how technology works, build with it, experiment with it and
              create solutions with it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The Shift */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="The Core Philosophy"
              title={
                <>
                  <span className="text-gradient">FROM CONSUMERS TO MAKERS.</span>
                </>
              }
              subtitle="Alyntis wants students to move from passive consumption to active creation. This is the shift at the heart of everything we do."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 lg:grid-cols-5">
            {shifts.map((shift, i) => (
              <Reveal key={shift.from} delay={i * 80}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="block text-lg font-medium text-gray-400 line-through decoration-gray-300">
                    {shift.from}
                  </span>
                  <ArrowRight className="mx-auto my-3 h-5 w-5 text-teal-500" />
                  <span className="block text-xl font-bold text-navy-900">{shift.to}</span>
                  <p className="mt-3 text-xs leading-relaxed text-gray-500">{shift.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Philosophy />
      <WhyAlyntis />
      <FutureVision />
      <CTASection />
    </>
  );
}
