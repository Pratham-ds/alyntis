import { ArrowRight, Lock, FolderGit2, FileText, Video, HelpCircle } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import CTASection from '@/components/home/CTASection';

const features = [
  { icon: FolderGit2, title: 'Class-Wise Projects', desc: 'Projects organized by class level with increasing complexity.' },
  { icon: FileText, title: 'PDF Resources', desc: 'Downloadable documents with circuit diagrams, code and reference material.' },
  { icon: Video, title: 'Video Guides', desc: 'Step-by-step video instructions for every build stage.' },
  { icon: HelpCircle, title: 'Quizzes', desc: 'Test your understanding with quizzes after each project.' },
];

export default function ProjectsPage() {
  return (
    <>
      <SEO
        title="Projects — Alyntis | Build Real Engineering Projects"
        description="The Alyntis project library contains class-wise engineering projects with build instructions, PDFs, videos and quizzes. Sign in or request a school demo to access."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              Project Library
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              DON'T JUST LEARN IT.
              <br />
              <span className="text-gradient">BUILD IT.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              The full Alyntis project library — with class-wise projects, step-by-step build
              instructions, PDF resources, video guides and quizzes — is available on the platform.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Features teaser */}
      <section className="relative overflow-hidden bg-gray-50 py-16 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
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
                Access the full project library
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
                Sign in to the Alyntis platform to browse class-wise projects, download resources,
                watch video guides and take quizzes.
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

      <CTASection />
    </>
  );
}
