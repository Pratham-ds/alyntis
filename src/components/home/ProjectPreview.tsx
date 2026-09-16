import { ArrowRight, Lock } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const previewProjects = [
  'Line Follower Robot',
  'Obstacle Avoiding Robot',
  'Smart Dustbin',
  'Smart Irrigation System',
  'IoT Weather Station',
  'Mini Robotic Arm',
  'Smart Parking System',
  'Environmental Monitoring',
];

export default function ProjectPreview() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Project-Based Learning"
            title={
              <>
                DON'T JUST LEARN IT.
                <br />
                <span className="text-gradient">BUILD IT.</span>
              </>
            }
            subtitle="Alyntis is built around practical, class-wise engineering projects. Students access step-by-step build instructions, PDF resources, video guides and quizzes — all through the Alyntis platform."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewProjects.map((name, i) => (
            <Reveal key={name} delay={i * 50}>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50">
                  <Lock className="h-4 w-4 text-teal-600" />
                </span>
                <span className="text-sm font-semibold text-navy-900">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 rounded-2xl border border-teal-100 bg-teal-50/50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
              <Lock className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">
              The full project library is available on the Alyntis platform.
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
              Students get access to class-wise projects with complete build instructions, PDF
              documents, video resources and quizzes. Schools can request a demo to explore the
              full platform.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/login" size="md">
                Sign In to Access Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/request-demo" variant="outline" size="md">
                Request a School Demo
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
