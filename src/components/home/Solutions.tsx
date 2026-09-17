import { ArrowRight, Bot, BrainCircuit, GraduationCap, Plane, Wifi, Boxes } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const solutions = [
  { icon: Bot, title: 'STEM & Robotics', desc: 'Hands-on robotics, electronics, coding and engineering programs designed for school students.' },
  { icon: BrainCircuit, title: 'AI & Machine Learning', desc: 'Age-appropriate AI and ML learning through practical experiments, projects and real-world applications.' },
  { icon: Wifi, title: 'IoT & Smart Systems', desc: 'Sensors, connected devices, automation and embedded projects that turn ideas into working systems.' },
  { icon: Plane, title: 'Drone Technology', desc: 'Introduce students to drones, flight systems, autonomous technology and responsible applications.' },
  { icon: GraduationCap, title: 'Teacher Enablement', desc: 'Structured support and training that helps educators confidently deliver technology-rich learning.' },
  { icon: Boxes, title: 'Innovation Programs', desc: 'Project-based maker experiences that encourage creativity, problem solving and prototyping.' },
];

export default function Solutions() {
  return (
    <section id="solutions" className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-600">Solutions for Schools</p>
            <h2 className="text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">Everything a school needs to build a <span className="text-gradient">maker culture.</span></h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">Alyntis combines structured programs, emerging technologies and practical projects to make technology education easier to deliver and easier to understand.</p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <Reveal key={solution.title} delay={index * 50}>
              <div className="group h-full rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:bg-white hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white"><solution.icon className="h-5 w-5" /></div>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{solution.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{solution.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={250}>
          <div className="mt-8 flex justify-center"><Button to="/schools" variant="outline" size="md">Explore School Solutions <ArrowRight className="h-4 w-4" /></Button></div>
        </Reveal>
      </div>
    </section>
  );
}
