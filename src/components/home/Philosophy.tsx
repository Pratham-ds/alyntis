import Reveal from '@/components/ui/Reveal';

const stages = [
  { name: 'Discover', desc: 'Understand the problem and the technology behind it.' },
  { name: 'Learn', desc: 'Build the knowledge needed to explore a solution.' },
  { name: 'Build', desc: 'Turn concepts into working, hands-on solutions.' },
  { name: 'Test', desc: 'Experiment, measure results and identify what can improve.' },
  { name: 'Fail', desc: 'Treat setbacks as useful feedback in the engineering process.' },
  { name: 'Improve', desc: 'Debug, iterate and make the solution more effective.' },
  { name: 'Innovate', desc: 'Combine ideas and technologies to create something new.' },
  { name: 'Impact', desc: 'Apply what you have learned to meaningful real-world problems.' },
];

export default function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">The Alyntis Philosophy</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">THE MAKER JOURNEY</h2>
            <p className="mt-5 text-lg text-gray-300">
              Alyntis takes students beyond passive learning through a repeatable cycle of discovery,
              experimentation, building and improvement.
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
                  {i < stages.length - 1 && <span className="h-px flex-1 bg-gradient-to-r from-teal-500/40 to-transparent" />}
                </div>
                <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{stage.desc}</p>
                {stage.name === 'Fail' && (
                  <p className="mt-3 text-xs font-semibold text-teal-400">Failure becomes feedback.</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
