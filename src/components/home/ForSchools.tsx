import { ArrowRight, Check, GraduationCap } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const benefits = [
  'Structured, class-wise technology learning',
  'Robotics, AI, IoT and embedded systems',
  'Drone technology and automation',
  '3D design, printing and rapid prototyping',
  'Teacher training and implementation support',
  'Digital resources and guided learning paths',
  'Student submissions and progress tracking',
  'Innovation portfolios and challenges',
];

export default function ForSchools() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">For Schools</p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                BUILD A SCHOOL
                <br />
                <span className="text-gradient">OF MAKERS.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Alyntis helps schools introduce a structured technology ecosystem where students
                learn concepts, work with real tools and develop the confidence to create and solve.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                      <Check className="h-3 w-3 text-teal-400" />
                    </span>
                    <span className="text-sm leading-relaxed text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button to="/request-demo" size="lg">
                  Request a School Demo
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  to="/schools"
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400"
                >
                  Explore School Programs
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={200}>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                <img
                  src="https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Students engaged in technology learning in a modern classroom"
                  className="aspect-[4/3] rounded-2xl object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-500/20">
                    <GraduationCap className="h-5 w-5 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">From curriculum to capability</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-300">
                      Give teachers a structured framework and give students a clear path from
                      foundational concepts to advanced making and innovation.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
