import { ArrowRight, Check, School as SchoolIcon, Users, BookOpen, Award, TrendingUp, HardHat, Wrench, GraduationCap } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import CTASection from '@/components/home/CTASection';

const benefits = [
  { icon: BookOpen, title: 'Structured Project-Based Learning', desc: 'A complete curriculum built around hands-on projects, not just theory.' },
  { icon: SchoolIcon, title: 'Class-Wise Project Library', desc: 'Projects organized by class level — complexity grows as students advance.' },
  { icon: Users, title: 'Teacher Support & Training', desc: 'Teachers get the support and training they need to guide students confidently.' },
  { icon: TrendingUp, title: 'Student Progress Tracking', desc: 'Track what each student has completed, built and learned over time.' },
  { icon: Award, title: 'Innovation Portfolios', desc: 'Every student builds a portfolio that shows what they can create.' },
  { icon: Check, title: 'Real-World Challenges', desc: 'Students apply what they learn to solve real problems that matter.' },
];

const techDomains = ['Robotics', 'Electronics', 'IoT & Smart Systems', 'AI Foundations', 'Embedded Systems', 'Drone Technology'];

export default function SchoolsPage() {
  return (
    <>
      <SEO
        title="For Schools — Alyntis | Bring the Maker Mindset to Your School"
        description="Alyntis helps schools create structured, technology-driven learning experiences. Project-based learning, robotics, IoT, AI and more — with teacher support and progress tracking."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
                  For Schools
                </p>
                <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                  BRING THE MAKER MINDSET
                  <br />
                  <span className="text-gradient">TO YOUR SCHOOL.</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-300">
                  Alyntis helps schools create structured, technology-driven learning experiences
                  where students learn through building, experimentation and innovation.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button to="/request-demo" size="lg">
                    Request a School Demo
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Button to="/contact" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">
                    Partner With Alyntis
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                <img
                  src="https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Students learning with technology in a modern school environment"
                  className="rounded-xl"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="What Schools Get"
              title={<>EVERYTHING A SCHOOL NEEDS TO BUILD MAKERS.</>}
              subtitle="From curriculum to teacher training to progress tracking — Alyntis provides a complete system."
            />
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{benefit.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technology domains */}
      <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader
              eyebrow="Technology Domains"
              title={<>TECHNOLOGIES YOUR STUDENTS WILL BUILD WITH.</>}
            />
          </Reveal>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {techDomains.map((domain, i) => (
              <Reveal key={domain} delay={i * 50}>
                <span className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-700">
                  {domain}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Engineer on-site */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div>
                <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">
                  Expert Engineers On-Site
                </p>
                <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
                  TOP-CLASS ENGINEERS,
                  <br />
                  <span className="text-gradient">APPOINTED TO YOUR SCHOOL.</span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Alyntis doesn't just send a curriculum. Based on the needs of your school,
                  we appoint qualified, top-class engineers to conduct hands-on teacher training
                  and guide students directly during build sessions.
                </p>
                <p className="mt-4 text-base leading-relaxed text-gray-600">
                  Our engineers bring real industry experience in robotics, electronics, IoT,
                  embedded systems and AI — so your students learn from people who actually
                  build technology, not just teach it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-4">
                {[
                  { icon: GraduationCap, title: 'Teacher Training', desc: 'Our engineers train your teachers to confidently guide students through every project, technology and build session.' },
                  { icon: Wrench, title: 'Student Build Sessions', desc: 'Engineers are present on-site during hands-on build sessions to mentor students, troubleshoot problems and inspire innovation.' },
                  { icon: HardHat, title: 'Tailored to Your School', desc: 'The number, specialization and schedule of engineers is determined based on your school\'s specific needs, class levels and programs.' },
                ].map((item, i) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy-900">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works for schools */}
      <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
                Implementation
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                HOW SCHOOLS WORK WITH ALYNTIS.
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-4">
            {[
              { step: '01', title: 'Demo & Discussion', desc: 'We meet with school leadership to understand needs and demonstrate the Alyntis platform.' },
              { step: '02', title: 'Curriculum Planning', desc: 'We help map Alyntis projects to your school\'s classes, schedule and learning goals.' },
              { step: '03', title: 'Teacher Onboarding', desc: 'Teachers receive training and support to guide students through projects confidently.' },
              { step: '04', title: 'Students Build', desc: 'Students start building real projects, tracking progress and building innovation portfolios.' },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-white/10">
                  <span className="text-4xl font-bold text-transparent" style={{ WebkitTextStroke: '1.5px #2dd4bf' }}>
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
