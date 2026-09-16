import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, BarChart3, GraduationCap, Cpu, Check, FileText, Video,
  HelpCircle, CheckCircle2, Loader2, AlertCircle, ExternalLink, Lightbulb, Wrench, Upload, AlertTriangle, ListChecks,
} from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { createNotification } from '@/lib/notifications';
import type { Project, ProjectResource, Quiz, QuizQuestion, QuizAttempt } from '@/types';

const studentLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/dashboard/courses' },
  { label: 'Projects', to: '/dashboard/projects' },
];

const difficultyColors: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-500/20 border-green-500/30',
  Intermediate: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  Advanced: 'text-red-400 bg-red-500/20 border-red-500/30',
};

export default function StudentProjectDetail() {
  const { slug } = useParams();
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Quiz state
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: projData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error || !projData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const proj = projData as Project;
      setProject(proj);

      const [res, quizData, compData, attData] = await Promise.all([
        supabase.from('project_resources').select('*').eq('project_id', proj.id).order('sort_order'),
        supabase.from('quizzes').select('*').eq('project_id', proj.id).maybeSingle(),
        supabase.from('project_completions').select('id').eq('project_id', proj.id).eq('student_id', profile?.id).maybeSingle(),
        supabase.from('quiz_attempts').select('*').eq('student_id', profile?.id).order('created_at', { ascending: false }),
      ]);

      setResources((res.data as ProjectResource[]) || []);
      if (quizData.data) {
        setQuiz(quizData.data as Quiz);
        const { data: qs } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.data.id).order('sort_order');
        setQuestions((qs as QuizQuestion[]) || []);
      }
      setCompleted(!!compData.data);
      setAttempts((attData.data as QuizAttempt[]) || []);
      setLoading(false);
    }
    if (slug && profile?.id) loadData();
  }, [slug, profile?.id]);

  if (notFound) return <Navigate to="/dashboard/projects" replace />;
  if (loading) {
    return (
      <>
        <PlatformNav links={studentLinks} />
        <div className="min-h-screen bg-navy-950 pt-20">
          <LoadingState />
        </div>
      </>
    );
  }

  if (!project) return null;

  const handleComplete = async () => {
    setCompleting(true);
    const { error } = await supabase.from('project_completions').insert({
      project_id: project.id,
      student_id: profile?.id,
    });
    if (!error) {
      setCompleted(true);
      await createNotification({
        type: 'project_completion',
        student_id: profile?.id,
        student_name: profile?.full_name || profile?.email,
        project_id: project.id,
        project_title: project.title,
      });
    }
    setCompleting(false);
  };

  const handleQuizSubmit = async () => {
    if (!quiz || !profile) return;
    setSubmitting(true);

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correct++;
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = percentage >= quiz.pass_score;

    const { data: attemptData } = await supabase.from('quiz_attempts').insert({
      quiz_id: quiz.id,
      student_id: profile.id,
      answers: answers,
      score: correct,
      total_questions: total,
      passed,
    }).select().single();

    setQuizResult({ score: correct, total, passed });
    setSubmitting(false);
    setTakingQuiz(false);

    if (attemptData) {
      setAttempts([attemptData as QuizAttempt, ...attempts]);
    }

    // Create notification
    await createNotification({
      type: passed ? 'quiz_completion' : 'quiz_attempt',
      student_id: profile.id,
      student_name: profile.full_name || profile.email,
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      project_id: project.id,
      project_title: project.title,
      score: correct,
      passed,
      total_questions: total,
    } as never);
  };

  const bestAttempt = attempts.length > 0
    ? attempts.reduce((best, a) => a.score > best.score ? a : best)
    : null;

  const metaItems = [
    { icon: GraduationCap, label: 'Class', value: project.class_level },
    { icon: BarChart3, label: 'Difficulty', value: project.difficulty },
    { icon: Clock, label: 'Time', value: project.estimated_time },
    { icon: Cpu, label: 'Tech', value: project.technology },
  ].filter(m => m.value);

  return (
    <>
      <SEO title={`${project.title} — Alyntis`} description={project.description || ''} />
      <PlatformNav links={studentLinks} />

      <div className="min-h-screen bg-navy-950 pt-20">
        {/* Back link */}
        <div className="mx-auto max-w-4xl px-4 pt-4 sm:px-6 lg:px-8">
          <Link to="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        {/* Hero */}
        <section className="pb-8 pt-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.difficulty && (
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyColors[project.difficulty]}`}>
                      {project.difficulty}
                    </span>
                  )}
                  {completed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{project.title}</h1>
                <p className="mt-3 text-base text-gray-300">{project.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {metaItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <item.icon className="h-4 w-4 text-teal-400" />
                      <p className="mt-1.5 text-xs text-gray-500">{item.label}</p>
                      <p className="text-xs font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {project.image_url && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
                  <img src={project.image_url} alt={project.title} className="rounded-xl" loading="lazy" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Resources */}
        {resources.length > 0 && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-white">Resources</h2>
              <p className="mt-1 text-sm text-gray-400">PDF documents and videos for this project.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {resources.map((res) => (
                  <a
                    key={res.id}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-teal-500/30 hover:bg-white/10"
                  >
                    {res.resource_type === 'pdf' ? (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                        <FileText className="h-5 w-5 text-red-400" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
                        <Video className="h-5 w-5 text-teal-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{res.title}</p>
                      {res.description && <p className="text-xs text-gray-400">{res.description}</p>}
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 transition-colors group-hover:text-teal-400" />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* What you're building */}
        {project.what_you_build && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-white">What are you building?</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.what_you_build}</p>
            </div>
          </section>
        )}

        {/* What you'll learn */}
        {project.what_you_learn && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-white">What will you learn?</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.what_you_learn}</p>
            </div>
          </section>
        )}

        {/* Components */}
        {project.components && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-white">Components Required</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.components}</p>
            </div>
          </section>
        )}

        {/* Build steps */}
        {project.build_steps && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">Step-by-Step Build</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.build_steps}</p>
            </div>
          </section>
        )}

        {/* Testing */}
        {project.testing && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">Testing</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.testing}</p>
            </div>
          </section>
        )}

        {/* Troubleshooting */}
        {project.troubleshooting && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Troubleshooting</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.troubleshooting}</p>
            </div>
          </section>
        )}

        {/* Take it further */}
        {project.take_it_further && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-teal-400" />
                <h2 className="text-xl font-bold text-white">Take It Further</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{project.take_it_further}</p>
            </div>
          </section>
        )}

        {/* Quiz section */}
        {quiz && questions.length > 0 && (
          <section className="py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
                    <HelpCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{quiz.title}</h2>
                    <p className="text-xs text-gray-400">
                      {questions.length} questions · Pass score: {quiz.pass_score}%
                      {bestAttempt && (
                        <span className="ml-2 text-teal-400">· Best: {bestAttempt.score}/{bestAttempt.total_questions}</span>
                      )}
                    </p>
                  </div>
                </div>

                {quiz.description && <p className="mt-3 text-sm text-gray-400">{quiz.description}</p>}

                {quizResult && (
                  <div className={`mt-4 rounded-xl border p-4 ${
                    quizResult.passed ? 'border-green-500/30 bg-green-500/10' : 'border-amber-500/30 bg-amber-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {quizResult.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-400" />
                      )}
                      <p className="text-sm font-bold text-white">
                        You scored {quizResult.score}/{quizResult.total} ({Math.round((quizResult.score / quizResult.total) * 100)}%)
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {quizResult.passed ? 'You passed!' : `You need ${quiz.pass_score}% to pass. Try again!`}
                    </p>
                  </div>
                )}

                {!takingQuiz ? (
                  <button
                    onClick={() => { setTakingQuiz(true); setQuizResult(null); setAnswers({}); }}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {attempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                  </button>
                ) : (
                  <div className="mt-4 space-y-4">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="rounded-xl border border-white/10 bg-navy-950/50 p-4">
                        <p className="text-sm font-semibold text-white">{idx + 1}. {q.question}</p>
                        <div className="mt-3 space-y-2">
                          {([
                            { key: 'a', text: q.option_a },
                            { key: 'b', text: q.option_b },
                            { key: 'c', text: q.option_c },
                            { key: 'd', text: q.option_d },
                          ]).map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => setAnswers({ ...answers, [q.id]: opt.key })}
                              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                                answers[q.id] === opt.key
                                  ? 'border-teal-500 bg-teal-500/10 text-white'
                                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'
                              }`}
                            >
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                answers[q.id] === opt.key ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-400'
                              }`}>
                                {opt.key.toUpperCase()}
                              </span>
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTakingQuiz(false)}
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleQuizSubmit}
                        disabled={submitting || Object.keys(answers).length < questions.length}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Complete project */}
        <section className="py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 p-6 text-center">
              {completed ? (
                <>
                  <CheckCircle2 className="mx-auto h-12 w-12 text-teal-400" />
                  <h2 className="mt-3 text-lg font-bold text-white">Project Completed!</h2>
                  <p className="mt-1 text-sm text-gray-400">You've marked this project as complete. Keep building!</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-10 w-10 text-teal-400" />
                  <h2 className="mt-3 text-lg font-bold text-white">Mark Project as Complete</h2>
                  <p className="mt-1 text-sm text-gray-400">Finished building? Mark this project complete to track your progress.</p>
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 disabled:opacity-50"
                  >
                    {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Mark as Complete
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
