import { Send, Sparkles, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

const examplePrompts = [
  'How does an ultrasonic sensor work?',
  'My robot is not detecting obstacles. What should I check?',
  'How can I improve my smart irrigation project?',
  'Give me ideas to make my robot more useful.',
];

export default function AskAlyntis() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 py-20 lg:py-32">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[120px] animate-pulse-glow" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                WHEN YOU'RE STUCK,
                <br />
                <span className="text-gradient">THINK WITH ALYNTIS.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
                Ask Alyntis is an AI mentor that helps students understand concepts, troubleshoot
                projects, generate ideas and think through problems — not just give answers.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                It's designed to guide thinking, not replace it. A mentor that asks the right
                questions and helps students arrive at the answer themselves.
              </p>

              <div className="mt-8">
                <Button to="/programs" size="lg">
                  Explore Ask Alyntis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Ask Alyntis</p>
                  <p className="text-xs text-gray-400">AI Mentor — Currently in Development</p>
                </div>
              </div>

              <div className="space-y-3">
                {examplePrompts.map((prompt, i) => (
                  <div
                    key={prompt}
                    className={`flex items-start gap-3 rounded-xl p-3 ${
                      i % 2 === 0
                        ? 'border border-white/10 bg-white/5'
                        : 'border border-teal-500/20 bg-teal-500/5'
                    }`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg ${
                      i % 2 === 0 ? 'bg-white/10' : 'bg-teal-500/20'
                    }`}>
                      <span className={`text-xs ${i % 2 === 0 ? 'text-gray-400' : 'text-teal-400'}`}>Q</span>
                    </div>
                    <p className="text-sm text-gray-300">{prompt}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-navy-950/50 p-3">
                <input
                  type="text"
                  disabled
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
                />
                <button disabled className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
