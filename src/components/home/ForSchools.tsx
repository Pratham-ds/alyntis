import { ArrowRight, Check, HardHat } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const benefits = [
  'Structured project-based learning',
  'Class-wise learning pathways',
  'Robotics and electronics',
  'IoT and smart systems',
  'AI foundations',
  'Embedded systems',
  'Drone technology',
  '3D design and printing',
  'Teacher support and training',
  'Student progress tracking',
  'Project submissions',
  'Real-world challenges',
];

export default function ForSchools() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">For Schools</p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                BUILD A STRONGER
                <br />
                <span className="text-gradient">MAKER CULTURE.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Alyntis works with schools to create structured, technology-driven learning
                experiences where students learn by designing, building, testing and improving.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20">
                      <Check className="h-3 w-3 text-teal-400" />
                    </span>
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button to="/request-demo" size="lg">
                  Request a School Demo
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button to="/schools" variant="outline" size="lg" className="border-white/20 text-white hover:border-teal-400 hover:text-teal-400">
                  Partner With Alyntis
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={200}>
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                <img
                  src="https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Students engaged in technology learning in a modern classroom"
                  className="rounded-xl"
                  loading="lazy"
                />
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                    <HardHat className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Hands-On Support for Schools</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-300">
                      Alyntis can support schools with implementation, teacher enablement and direct
                      student guidance — helping technology learning become a sustained part of the
                      school experience.
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
