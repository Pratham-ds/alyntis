import { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import { supabase } from '@/lib/supabase';

type Quiz = { id: string; title: string; description: string | null; pass_score: number; project_id: string; project_title?: string; class_level?: string };
type Question = { id: string; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string };

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Notifications', to: '/admin/notifications' },
];

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [openQuiz, setOpenQuiz] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id,title,description,pass_score,project_id,projects(title,class_level)')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setQuizzes(data.map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          pass_score: q.pass_score,
          project_id: q.project_id,
          project_title: q.projects?.title,
          class_level: q.projects?.class_level,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function toggleQuiz(quizId: string) {
    if (openQuiz === quizId) { setOpenQuiz(null); return; }
    setOpenQuiz(quizId);
    if (questions[quizId]) return;
    const { data } = await supabase
      .from('quiz_questions')
      .select('id,question,option_a,option_b,option_c,option_d,correct_answer')
      .eq('quiz_id', quizId)
      .order('sort_order');
    setQuestions(prev => ({ ...prev, [quizId]: (data as Question[]) || [] }));
  }

  return <>
    <SEO title="Manage Quizzes — Alyntis Admin" description="View and manage Alyntis quizzes" />
    <PlatformNav links={adminLinks} />
    <main className="min-h-screen bg-navy-950 pt-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white">Manage Quizzes</h1>
          <p className="mt-1 text-sm text-gray-400">View quizzes by project and review their questions and answer keys.</p>
        </header>
        {loading ? <LoadingState /> : quizzes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">No quizzes found.</div>
        ) : (
          <div className="space-y-3">
            {quizzes.map(quiz => {
              const expanded = openQuiz === quiz.id;
              return <section key={quiz.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <button onClick={() => toggleQuiz(quiz.id)} className="flex w-full items-center gap-4 p-5 text-left hover:bg-white/5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-500/15"><HelpCircle className="h-5 w-5 text-teal-400" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-white">{quiz.title}</h2>{quiz.class_level && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">{quiz.class_level}</span>}</div>
                    <p className="mt-1 text-xs text-gray-400">Project: {quiz.project_title || 'Unassigned'} · Pass score: {quiz.pass_score}%</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
                {expanded && <div className="border-t border-white/10 p-5">
                  {quiz.description && <p className="mb-4 text-sm text-gray-400">{quiz.description}</p>}
                  {!questions[quiz.id] ? <LoadingState /> : questions[quiz.id].length === 0 ? <p className="text-sm text-gray-500">No questions found.</p> : <div className="space-y-4">{questions[quiz.id].map((q, i) => <div key={q.id} className="rounded-xl border border-white/10 bg-navy-950/60 p-4"><p className="font-semibold text-white">{i + 1}. {q.question}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{[['a',q.option_a],['b',q.option_b],['c',q.option_c],['d',q.option_d]].map(([key,value]) => <div key={key} className={`rounded-lg border p-3 text-sm ${q.correct_answer?.toLowerCase() === key ? 'border-green-500/40 bg-green-500/10 text-green-300' : 'border-white/10 text-gray-300'}`}><span className="font-semibold uppercase">{key}.</span> {value} {q.correct_answer?.toLowerCase() === key && <CheckCircle2 className="ml-1 inline h-4 w-4" />}</div>)}</div></div>)}</div>}
                </div>}
              </section>;
            })}
          </div>
        )}
      </div>
    </main>
  </>;
}
