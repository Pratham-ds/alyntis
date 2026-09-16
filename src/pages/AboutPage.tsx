import { Target, Eye, Heart, Zap, Users, Globe } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import Philosophy from '@/components/home/Philosophy';
import FutureVision from '@/components/home/FutureVision';
import CTASection from '@/components/home/CTASection';

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'Everything we do serves one mission: preparing the next generation of builders.' },
  { icon: Zap, title: 'Future-Focused', desc: 'We teach the technologies that will shape tomorrow, not the tools of yesterday.' },
  { icon: Eye, title: 'Engineering-Oriented', desc: 'We think like engineers — every problem is an opportunity to build a solution.' },
  { icon: Heart, title: 'Human', desc: 'Behind every project is a student discovering what they are capable of.' },
  { icon: Users, title: 'Accessible', desc: 'We believe every student deserves the chance to become a maker, not just a consumer.' },
  { icon: Globe, title: 'Impact-Minded', desc: 'We want students to build things that solve real problems in the real world.' },
];

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About — Alyntis | Preparing Minds to Build the Future"
        description="Alyntis is a mission-driven technology and learning platform focused on preparing the next generation to become creators, builders, innovators and problem-solvers."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              About Alyntis
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              WE'RE NOT BUILDING A COMPANY.
              <br />
              <span className="text-gradient">WE'RE BUILDING A GENERATION.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Alyntis is a mission-driven technology and learning platform focused on preparing the
              next generation to become creators, builders, innovators and problem-solvers rather
              than passive consumers of technology.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Who We Are"
              title={<>MORE THAN AN EDUCATION COMPANY.</>}
              align="left"
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-600">
              <p>
                Alyntis works around practical and emerging technologies — robotics, artificial
                intelligence, IoT, embedded systems, electronics, automation, drone technology,
                coding and computational thinking.
              </p>
              <p>
                But Alyntis is much more than an education website or a robotics training company.
                It is a mission to create a fundamental shift in how young people relate to
                technology — from passive consumption to active creation.
              </p>
              <p>
                We want to contribute to a future where young people don't just use technology —
                they understand it, build it and use it to solve real-world problems.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What We Value"
              title={<>WHAT DRIVES US.</>}
              subtitle="These are the principles behind every decision we make and every project we build."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                    <value.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{value.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What we're building */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What We're Building"
              title={<>THE ALYNTIS PLATFORM.</>}
              align="left"
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-600">
              <p>
                Alyntis is building a complete platform — a digital maker journey where students
                discover projects, follow step-by-step instructions, build working systems, submit
                their work, receive feedback and build an innovation portfolio.
              </p>
              <p>
                Schools can integrate Alyntis into their curriculum with structured, class-wise
                projects. Teachers get support and training. Students get a real, hands-on
                engineering experience.
              </p>
              <p>
                We are currently in development. Some features and programs are available now as
                demonstration content. The full platform is coming soon.
              </p>
            </div>
            <div className="mt-8">
              <Button to="/request-demo" size="lg">
                Request a Demo
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Philosophy />
      <FutureVision />
      <CTASection />
    </>
  );
}
