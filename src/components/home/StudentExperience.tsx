import { Wrench, TrendingUp, Upload, MessageSquare, Lightbulb, FolderOpen, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const features = [
  { icon: Wrench, title: 'Build Projects', desc: 'Follow detailed step-by-step instructions with clear guidance at every stage.' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Know exactly what has been completed and what comes next in the journey.' },
  { icon: Upload, title: 'Submit Work', desc: 'Upload project photos, videos and explanations to document what you built.' },
  { icon: MessageSquare, title: 'Receive Feedback', desc: 'Teachers can review work and provide feedback to help you improve.' },
  { icon: Lightbulb, title: 'Take It Further', desc: 'Modify projects, experiment with new ideas and create something unique.' },
  { icon: FolderOpen, title: 'Build Your Portfolio', desc: 'Document everything you create into a portfolio that shows real capability.' },
];

export default function StudentExperience() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Student Experience"
            title={
              <>
                WHAT A STUDENT
                <br />
                <span className="text-gradient">CAN DO.</span>
              </>
            }
            subtitle="Every student gets a complete maker experience — from building their first project to building a portfolio that shows what they can create."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20 transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Button to="/projects" variant="secondary" size="lg">
              Start Building
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
