import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-500 to-cyan-500 py-20 lg:py-28">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-navy-950/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            READY TO BUILD
            <br />
            THE FUTURE?
          </h2>
          <p className="mt-6 text-lg text-white/90 sm:text-xl">
            Whether you're a student, parent, teacher, school or technology partner, there's a place
            for you in the Alyntis mission.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button to="/mission" variant="light" size="lg">
              Explore Alyntis
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              to="/schools"
              size="lg"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-teal-600"
            >
              Partner With Us
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
