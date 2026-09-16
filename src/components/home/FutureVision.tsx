import Reveal from '@/components/ui/Reveal';

export default function FutureVision() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-500/15 blur-[120px] animate-pulse-glow" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
            Future Vision
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
            A WORLD BUILT BY MAKERS.
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 space-y-4 text-lg leading-relaxed text-gray-300">
            <p>
              Imagine a generation that doesn't wait for technology to shape its future.
            </p>
            <p>
              A generation that <span className="text-white font-semibold">understands problems</span>.
              <br />
              <span className="text-white font-semibold">Questions assumptions</span>.
              <br />
              <span className="text-white font-semibold">Builds solutions</span>.
              <br />
              <span className="text-white font-semibold">Experiments</span>.
              <br />
              <span className="text-white font-semibold">Fails</span>.
              <br />
              <span className="text-white font-semibold">Learns</span>.
              <br />
              <span className="text-white font-semibold">Improves</span>.
              <br />
              And <span className="text-white font-semibold">creates what comes next</span>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-12 rounded-2xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-8 backdrop-blur-sm">
            <p className="text-2xl font-bold text-gradient sm:text-3xl">
              That is the future Alyntis is building.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
