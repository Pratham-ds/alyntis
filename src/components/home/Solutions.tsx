import { ArrowRight, Bot, BrainCircuit, GraduationCap, Plane, Wifi, Boxes, Rocket } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const solutions = [
  { icon: Bot, title: 'STEM & Robotics', desc: 'Build with motors, sensors, electronics and code. Students learn engineering by making things work.' },
  { icon: BrainCircuit, title: 'AI & Machine Learning', desc: 'Introduce intelligent systems through age-appropriate experiments, data and practical projects.' },
  { icon: Wifi, title: 'IoT & Smart Systems', desc: 'Connect sensors and devices, collect useful data and turn it into a working smart system.' },
  { icon: Plane, title: 'Drone Technology', desc: 'Explore flight, sensing and autonomous systems through responsible, project-based activities.' },
  { icon: Rocket, title: 'Space Technology', desc: 'Bring rockets, satellites, telemetry and space robotics into hands-on STEM learning.' },
  { icon: GraduationCap, title: 'Teacher Enablement', desc: 'Give educators the structure, resources and confidence to run technology projects in school.' },
  { icon: Boxes, title: 'Innovation Programs', desc: 'Help students move from an idea to a prototype through guided challenges and open-ended making.' },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-8 border-b border-gray-200 pb-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-teal-600">What Alyntis brings to a school</p>
              <h2 className="max-w-xl text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">Technology that students can actually <span className="text-teal-600">work with.</span></h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              We combine curriculum, projects and teacher support so emerging technology becomes part of the school experience — not just another topic on a screen.
            </p>
          </div>
        </Reveal>

        <div className="mt-4 divide-y divide-gray-200 border-b border-gray-200">
          {solutions.map((solution, index) => (
            <Reveal key={solution.title} delay={index * 35}>
              <div className="group grid gap-4 py-6 transition-colors hover:bg-gray-50 sm:grid-cols-[56px_220px_1fr] sm:items-center sm:px-4">
                <div className="flex h-11 w-11 items-center justify-center border border-gray-200 bg-white text-teal-600 group-hover:border-teal-300 group-hover:bg-teal-50">
                  <solution.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-gray-400">0{index + 1}</span>
                  <h3 className="text-lg font-bold text-navy-900">{solution.title}</h3>
                </div>
                <p className="text-sm leading-6 text-gray-600 sm:max-w-2xl">{solution.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={250}>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="hidden text-sm text-gray-500 sm:block">Built for schools, teachers and students.</p>
            <Button to="/schools" variant="outline" size="md">Explore school solutions <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
