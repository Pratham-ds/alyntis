import Reveal from '@/components/ui/Reveal';

const traditional = [
  'Consume information',
  'Memorize',
  'Follow instructions',
  'Focus primarily on answers',
];

const alyntis = [
  'Understand',
  'Build',
  'Experiment',
  'Solve',
  'Improve',
  'Innovate',
];

export default function WhyAlyntis() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-600">
              Why Alyntis
            </p>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl lg:text-5xl">
              MORE THAN LEARNING.
              <br />
              <span className="text-gradient">BUILDING CAPABILITY.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <p className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-500">
                Traditional Learning
              </p>
              <div className="space-y-3">
                {traditional.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                    </span>
                    <span className="text-base text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />
              <p className="mb-6 text-sm font-bold uppercase tracking-widest text-teal-600">
                The Alyntis Way
              </p>
              <div className="space-y-3">
                {alyntis.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-md shadow-teal-500/30">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-base font-semibold text-navy-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <p className="mt-8 text-center text-sm text-gray-500">
            We respect traditional education. Alyntis is not a replacement — it's a complement that
            builds what the future demands.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
