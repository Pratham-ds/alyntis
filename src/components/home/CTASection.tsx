import { ArrowRight, Mail } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-cyan-600 py-16 lg:py-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-white/80">Start a Conversation</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Bring future-ready learning to your school.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Talk to Alyntis about school programs, technology learning, teacher enablement and project-based innovation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/request-demo" variant="light" size="lg">Partner With Alyntis <ArrowRight className="h-5 w-5" /></Button>
            <Button to="/programs" size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-teal-600">Explore Programs</Button>
          </div>
          <a href="mailto:info@alyntis.in" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
            <Mail className="h-4 w-4" /> info@alyntis.in
          </a>
        </Reveal>
      </div>
    </section>
  );
}
