import Reveal from '@/components/ui/Reveal';

const stages = [
  { name: 'Discover', desc: 'Understand the problem and the technology behind it.' },
  { name: 'Learn', desc: 'Build the knowledge needed to solve it.' },
  { name: 'Build', desc: 'Follow structured hands-on project instructions.' },
  { name: 'Test', desc: 'Run the project and identify what works and what doesn\'t.' },
  { name: 'Fail', desc: 'Embrace failure as a natural part of engineering and innovation.' },
  { name: 'Improve', desc: 'Debug, modify and make the solution better.' },
  { name: 'Innovate', desc: 'Take the project further and create something unique.' },
  { name: 'Impact', desc: 'Use what you\'ve built to solve real-world problems.' },
];

export default function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              The Alyntis Philosophy
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              THE MAKER JOURNEY
            </h2>
            <p className="mt-5 text-lg text-gray-300">
              Every great innovation follows a path. At Alyntis, we guide students through each
              stage — because failure is not the opposite of success, it's part of engineering.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, i) => (
            <Reveal key={stage.name} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-white/10">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-teal-500/20">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {i < stages.length - 1 && (
                    <span className="h-px flex-1 bg-gradient-to-r from-teal-500/40 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{stage.desc}</p>
                {stage.name === 'Fail' && (
                  <p className="mt-3 text-xs font-semibold text-teal-400">
                    Failure is part of engineering.
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
