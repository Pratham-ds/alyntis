import Reveal from '@/components/ui/Reveal';

const steps = [
  { num: '01', title: 'Discover', desc: 'Understand the problem and the technology behind it.' },
  { num: '02', title: 'Learn', desc: 'Build the concepts and skills needed to explore a solution.' },
  { num: '03', title: 'Build', desc: 'Turn ideas into working, hands-on solutions.' },
  { num: '04', title: 'Test', desc: 'Experiment, measure results and identify opportunities to improve.' },
  { num: '05', title: 'Improve', desc: 'Debug, iterate and make the solution more effective.' },
  { num: '06', title: 'Innovate', desc: 'Combine ideas and technologies to create something new.' },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">How Alyntis Works</p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
              A STRUCTURED PATH FROM
              <br />
              <span className="text-gradient">PROBLEM TO INNOVATION.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Students learn by doing, then use testing and iteration to turn knowledge into capability.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 80}>
              <div className="group relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg">
                <span className="text-5xl font-bold text-transparent" style={{ WebkitTextStroke: '1.5px #14b8a6' }}>
                  {step.num}
                </span>
                <h3 className="mt-3 text-xl font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 to-navy-800 p-10 text-center lg:p-16">
            <div className="absolute inset-0 bg-grid-dark opacity-30" />
            <div className="relative">
              <p className="text-xl font-bold text-white sm:text-2xl">The goal isn't to repeat instructions.</p>
              <p className="mt-2 text-xl font-bold text-gradient sm:text-2xl">
                The goal is to develop the ability to build something better.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
