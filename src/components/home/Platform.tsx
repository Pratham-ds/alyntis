import { ArrowRight, School, Users, BookOpen, Wrench, Upload, MessageSquare, FolderOpen } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

const flow = ['School', 'Class', 'Course', 'Project', 'Build', 'Submit', 'Feedback', 'Improve', 'Portfolio'];

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
            subtitle="Alyntis provides a digital platform where students discover projects, follow step-by-step building instructions, access resources, submit their work, receive feedback and build an innovation portfolio."
          />
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 lg:gap-3">
            {flow.map((step, i) => (
              <div key={step} className="flex items-center gap-2 lg:gap-3">
                <span className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 sm:px-4 sm:py-2.5 sm:text-sm">
                  {step}
                </span>
                {i < flow.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-teal-400" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-16 overflow-hidden rounded-2xl border border-gray-200 shadow-2xl shadow-navy-900/10">
            {/* Dashboard mockup */}
            <div className="bg-navy-950 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-gray-400">alyntis.com / dashboard</span>
              </div>
            </div>
            <div className="grid gap-0 bg-gray-50 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="hidden border-r border-gray-200 bg-white p-4 lg:block">
                <div className="space-y-1">
                  {['Dashboard', 'Projects', 'Courses', 'Submissions', 'Portfolio', 'Challenges'].map((item, idx) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                        idx === 0 ? 'bg-teal-50 font-semibold text-teal-700' : 'text-gray-600'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current opacity-50" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Main content */}
              <div className="col-span-3 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Welcome back,</p>
                    <h3 className="text-lg font-bold text-navy-900">Your Maker Dashboard</h3>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    Class 8 · Robotics
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: BookOpen, label: 'Projects', value: '6', sub: 'Completed' },
                    { icon: Wrench, label: 'In Progress', value: '2', sub: 'Active builds' },
                    { icon: FolderOpen, label: 'Portfolio', value: '8', sub: 'Items' },
                  ].map((card) => (
                    <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4">
                      <card.icon className="h-5 w-5 text-teal-600" />
                      <p className="mt-3 text-2xl font-bold text-navy-900">{card.value}</p>
                      <p className="text-xs text-gray-500">{card.label}</p>
                      <p className="text-xs text-teal-600">{card.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900">Current Project</p>
                    <span className="text-xs text-gray-500">Step 3 of 7</span>
                  </div>
                  <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-3/7 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: '43%' }} />
                  </div>
                  <p className="text-sm text-gray-600">Line Follower Robot — Assembling the sensor array</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
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
