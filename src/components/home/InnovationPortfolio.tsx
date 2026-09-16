import Reveal from '@/components/ui/Reveal';

const portfolioItems = [
  { label: 'Projects Built', value: '12', color: 'from-teal-500 to-cyan-500' },
  { label: 'Skills Developed', value: '8', color: 'from-navy-700 to-navy-900' },
  { label: 'Challenges Completed', value: '3', color: 'from-teal-500 to-cyan-500' },
  { label: 'Certificates Earned', value: '5', color: 'from-navy-700 to-navy-900' },
];

export default function InnovationPortfolio() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
                Innovation Portfolio
              </p>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                DON'T JUST SHOW YOUR MARKS.
                <br />
                <span className="text-gradient">SHOW WHAT YOU CAN BUILD.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                The Alyntis Innovation Portfolio lets students showcase what they've actually built —
                projects, problems solved, technologies used, skills developed, improvements made,
                challenges completed, achievements and certificates.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                Future opportunities will increasingly value what people can create and solve — not
                just what they can remember.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Innovation Portfolio</p>
                  <p className="text-lg font-bold text-white">Student Maker Profile</p>
                </div>
                <span className="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-400">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {portfolioItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-400">
                  Recent Projects
                </p>
                <div className="space-y-2">
                  {['Line Follower Robot', 'Smart Dustbin', 'IoT Weather Station'].map((proj) => (
                    <div key={proj} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{proj}</span>
                      <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-xs text-teal-400">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
