import { ArrowRight, BookOpen, FolderOpen, MessageSquare, Upload, Users, Wrench } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const flow = ['School', 'Class', 'Course', 'Learn', 'Build', 'Resources', 'Feedback', 'Improve', 'Portfolio'];

export default function Platform() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="The Alyntis Platform"
            title={
              <>
                ONE PLATFORM.
                <br />
                <span className="text-gradient">A COMPLETE MAKER JOURNEY.</span>
              </>
            }
            subtitle="Alyntis connects curriculum, technology learning, resources, build activities, feedback and student portfolios in one structured experience for schools."
          />
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 lg:gap-3">
            {flow.map((step, i) => (
              <div key={step} className="flex items-center gap-2 lg:gap-3">
                <span className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 sm:px-4 sm:py-2.5 sm:text-sm">
                  {step}
                </span>
                {i < flow.length - 1 && <ArrowRight className="h-4 w-4 text-teal-400" />}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-16 overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-2xl shadow-navy-900/10">
            <div className="bg-navy-950 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  <span className="ml-2 text-xs text-gray-400">Alyntis Learning Platform</span>
                </div>
                <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-[10px] font-semibold text-teal-300">
                  MAKER MODE
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[220px_1fr]">
              <div className="hidden border-r border-gray-200 bg-white p-4 lg:block">
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Workspace</p>
                <div className="space-y-1">
                  {['Dashboard', 'Learning Paths', 'Resources', 'Submissions', 'Portfolio'].map((item, idx) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
                        idx === 0 ? 'bg-teal-50 font-semibold text-teal-700' : 'text-gray-600'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Student workspace</p>
                    <h3 className="mt-1 text-xl font-bold text-navy-900">Your Maker Dashboard</h3>
                  </div>
                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                    Class 8 · Technology
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: BookOpen, label: 'Learning', value: 'Active', sub: 'Current pathway' },
                    { icon: Wrench, label: 'Builds', value: 'In progress', sub: 'Hands-on learning' },
                    { icon: FolderOpen, label: 'Portfolio', value: 'Growing', sub: 'Evidence of learning' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                      <card.icon className="h-5 w-5 text-teal-600" />
                      <p className="mt-4 text-lg font-bold text-navy-900">{card.value}</p>
                      <p className="text-xs font-medium text-gray-600">{card.label}</p>
                      <p className="mt-1 text-xs text-teal-600">{card.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                        <Users className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">Guided learning</p>
                        <p className="text-xs text-gray-500">Structured by class and capability</p>
                      </div>
                    </div>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Progress through the current learning pathway</p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                        <Upload className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-900">Submit & improve</p>
                        <p className="text-xs text-gray-500">Document work and receive feedback</p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                      <MessageSquare className="h-4 w-4 text-teal-600" />
                      Feedback becomes part of the learning journey.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div className="mt-12 text-center">
            <Button to="/programs" size="lg">
              Explore the Alyntis Platform
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
