import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, FileText, Video, ExternalLink, CheckCircle2, HelpCircle, Clock, BarChart3, Cpu, GraduationCap, Loader2, XCircle } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { createNotification } from '@/lib/notifications';
import type { Project, ProjectResource, Quiz, QuizAttempt } from '@/types';

const BUCKET = 'alyntis-resources';
const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Courses', to: '/dashboard/courses' },
  { label: 'Projects', to: '/dashboard/projects' },
];

type StudentQuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  sort_order: number;
  created_at: string;
};

type QuizReviewItem = StudentQuizQuestion & {
  selected_answer: string | null;
  correct_answer: string;
  is_correct: boolean;
};

type QuizResult = {
  attemptId: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
};

export default function StudentProjectDetail() {
  const { slug } = useParams();
  const { profile } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [resourceUrls, setResourceUrls] = useState<Record<string, string>>({});
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<StudentQuizQuestion[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [review, setReview] = useState<QuizReviewItem[]>([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);

  useEffect(() => {
    if (!slug || !profile?.id) return;

    (async () => {
      const { data: p, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error || !p) {
        setLoading(false);
        return;
      }

      setProject(p as Project);

      const [r, q, c, a] = await Promise.all([
        supabase.from('project_resources').select('*').eq('project_id', p.id).order('sort_order'),
        supabase.from('quizzes').select('*').eq('project_id', p.id).maybeSingle(),
        supabase.from('project_completions').select('id').eq('project_id', p.id).eq('student_id', profile.id).maybeSingle(),
        supabase.from('quiz_attempts').select('*').eq('student_id', profile.id).order('created_at', { ascending: false }),
      ]);

      const rs = (r.data as ProjectResource[]) || [];
      setResources(rs);

      const urls: Record<string, string> = {};
      await Promise.all(
        rs.map(async (x) => {
          if (x.file_path) {
            const { data } = await supabase.storage.from(BUCKET).createSignedUrl(x.file_path, 3600);
            if (data?.signedUrl) urls[x.id] = data.signedUrl;
          } else if (x.url) {
            urls[x.id] = x.url;
          }
        })
      );
      setResourceUrls(urls);

      if (q.data) {
        setQuiz(q.data as Quiz);
        // IMPORTANT: never select '*' from quiz_questions for students.
        // This RPC intentionally returns only question text/options and excludes correct_answer.
        const { data: qs, error: questionError } = await supabase.rpc('get_quiz_questions_for_student', {
          p_quiz_id: q.data.id,
        });
        if (!questionError) setQuestions((qs as StudentQuizQuestion[]) || []);
      }

      setCompleted(!!c.data);
      const studentAttempts = (a.data as QuizAttempt[]) || [];
      setAttempts(studentAttempts);

      if (q.data) {
        const latest = studentAttempts.find((attempt) => attempt.quiz_id === q.data.id);
        if (latest) {
          setResult({
            attemptId: latest.id,
            score: latest.score,
            total: latest.total_questions,
            percentage: latest.total_questions ? Math.round((latest.score / latest.total_questions) * 10000) / 100 : 0,
            passed: latest.passed,
          });
        }
      }

      setLoading(false);
    })();
  }, [slug, profile?.id]);

  if (loading) {
    return (
      <>
        <PlatformNav links={links} />
        <div className="min-h-screen bg-navy-950 pt-20"><LoadingState /></div>
      </>
    );
  }

  if (!project) return <Navigate to="/dashboard/projects" replace />;

  const complete = async () => {
    if (completed || !profile) return;
    const { error } = await supabase.from('project_completions').insert({ project_id: project.id, student_id: profile.id });
    if (!error) {
      setCompleted(true);
      await createNotification({
        type: 'project_completion',
        student_id: profile.id,
        student_name: profile.full_name || profile.email,
        project_id: project.id,
        project_title: project.title,
      });
    }
  };

  const loadReview = async (attemptId: string) => {
    if (!attemptId) return;
    setLoadingReview(true);
    const { data, error } = await supabase.rpc('get_quiz_attempt_review', { p_attempt_id: attemptId });
    if (!error) {
      setReview((data as QuizReviewItem[]) || []);
      setReviewVisible(true);
    }
    setLoadingReview(false);
  };

  const submitQuiz = async () => {
    if (!quiz || !profile || !questions.length || submitting) return;

    setSubmitting(true);
    const { data, error } = await supabase.rpc('submit_quiz_attempt', {
      p_quiz_id: quiz.id,
      p_answers: answers,
    });

    if (error || !data?.[0]) {
      setSubmitting(false);
      return;
    }

    const submitted = data[0] as {
      attempt_id: string;
      score: number;
      total_questions: number;
      percentage: number;
      passed: boolean;
    };

    const nextResult: QuizResult = {
      attemptId: submitted.attempt_id,
      score: submitted.score,
      total: submitted.total_questions,
      percentage: Number(submitted.percentage),
      passed: submitted.passed,
    };

    setResult(nextResult);
    setAttempts((current) => [
      {
        id: submitted.attempt_id,
        quiz_id: quiz.id,
        student_id: profile.id,
        answers,
        score: submitted.score,
        total_questions: submitted.total_questions,
        passed: submitted.passed,
        created_at: new Date().toISOString(),
      } as QuizAttempt,
      ...current,
    ]);

    // Correct answers are retrieved only after the attempt has been securely saved.
    await loadReview(submitted.attempt_id);

    await createNotification({
      type: submitted.passed ? 'quiz_completion' : 'quiz_attempt',
      student_id: profile.id,
      student_name: profile.full_name || profile.email,
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      project_id: project.id,
      project_title: project.title,
      score: submitted.score,
      passed: submitted.passed,
      total_questions: submitted.total_questions,
    } as never);

    setSubmitting(false);
  };

  return (
    <>
      <SEO title={`${project.title} — Alyntis`} description={project.description || ''} />
      <PlatformNav links={links} />
      <main className="min-h-screen bg-navy-950 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link to="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400">
            <ArrowLeft className="h-4 w-4" />Back to Projects
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex flex-wrap gap-2">
                {project.class_level && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300"><GraduationCap className="mr-1 inline h-3 w-3" />{project.class_level}</span>}
                {project.difficulty && <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300"><BarChart3 className="mr-1 inline h-3 w-3" />{project.difficulty}</span>}
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">{project.title}</h1>
              <p className="mt-3 text-gray-300">{project.description}</p>
              {project.estimated_time && <p className="mt-4 text-sm text-gray-400"><Clock className="mr-1 inline h-4 w-4" />{project.estimated_time}</p>}
              {project.technology && <p className="mt-2 text-sm text-gray-400"><Cpu className="mr-1 inline h-4 w-4" />{project.technology}</p>}
            </div>
            {project.image_url && <img src={project.image_url} alt={project.title} className="w-full rounded-2xl border border-white/10 object-cover" />}
          </div>

          {resources.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-white">Resources</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {resources.map((r) => (
                  <a key={r.id} href={resourceUrls[r.id]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-teal-500/30">
                    {r.resource_type === 'pdf' ? <FileText className="h-5 w-5 text-red-400" /> : <Video className="h-5 w-5 text-teal-400" />}
                    <span className="flex-1 text-sm font-semibold text-white">{r.title}</span>
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {(['what_you_build', 'what_you_learn', 'components', 'build_steps', 'testing', 'troubleshooting', 'take_it_further'] as const).map((k) => project[k] && (
            <section key={k} className="mt-8">
              <h2 className="text-xl font-bold text-white">{k.replaceAll('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase())}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{project[k]}</p>
            </section>
          ))}

          {quiz && questions.length > 0 && (
            <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-white"><HelpCircle className="mr-2 inline h-5 w-5 text-teal-400" />{quiz.title}</h2>
                {result && <span className="text-xs text-gray-400">Completed</span>}
              </div>

              {result && (
                <div className={`mt-4 rounded-xl p-5 ${result.passed ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><p className="text-xs text-gray-400">Score</p><p className="mt-1 text-2xl font-bold text-white">{result.score}/{result.total}</p></div>
                    <div><p className="text-xs text-gray-400">Percentage</p><p className="mt-1 text-2xl font-bold text-white">{result.percentage}%</p></div>
                    <div><p className="text-xs text-gray-400">Result</p><p className={`mt-1 text-lg font-bold ${result.passed ? 'text-teal-300' : 'text-red-300'}`}>{result.passed ? 'Passed' : 'Not Passed'}</p></div>
                  </div>
                  <button onClick={() => reviewVisible ? setReviewVisible(false) : loadReview(result.attemptId)} disabled={loadingReview} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
                    {loadingReview && <Loader2 className="h-4 w-4 animate-spin" />}
                    {reviewVisible ? 'Hide Answer Review' : 'Review Answers'}
                  </button>
                </div>
              )}

              {!result && (
                <p className="mt-3 text-sm text-gray-400">Answer all questions and submit the quiz. Correct answers are hidden until the quiz is submitted.</p>
              )}

              <div className="mt-5 space-y-5">
                {questions.map((q, i) => (
                  <div key={q.id}>
                    <p className="text-sm font-semibold text-white">{i + 1}. {q.question}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {(['a', 'b', 'c', 'd'] as const).map((k) => (
                        <label key={k} className="cursor-pointer rounded-lg border border-white/10 p-3 text-sm text-gray-300 hover:bg-white/5">
                          <input type="radio" name={q.id} checked={answers[q.id] === k} onChange={() => !result && setAnswers({ ...answers, [q.id]: k })} disabled={!!result} className="mr-2" />
                          {q[`option_${k}`]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!result && (
                <button disabled={submitting} onClick={submitQuiz} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit Quiz
                </button>
              )}

              {reviewVisible && review.length > 0 && (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <h3 className="text-lg font-bold text-white">Answer Review</h3>
                  <div className="mt-4 space-y-4">
                    {review.map((item, i) => (
                      <div key={item.question_id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                        <p className="font-semibold text-white">{i + 1}. {item.question}</p>
                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                          <p className="text-gray-300">Your answer: <span className="font-semibold text-white">{item.selected_answer ? item[`option_${item.selected_answer as 'a' | 'b' | 'c' | 'd'}`] : 'Not answered'}</span></p>
                          <p className="text-gray-300">Correct answer: <span className="font-semibold text-teal-300">{item[`option_${item.correct_answer as 'a' | 'b' | 'c' | 'd'}`]}</span></p>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                          {item.is_correct ? <><CheckCircle2 className="h-4 w-4 text-teal-400" /><span className="text-teal-300">Correct</span></> : <><XCircle className="h-4 w-4 text-red-400" /><span className="text-red-300">Incorrect</span></>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          <div className="mt-10 flex justify-end">
            {completed ? <span className="inline-flex items-center gap-2 rounded-xl bg-teal-500/20 px-5 py-3 text-sm font-semibold text-teal-300"><CheckCircle2 className="h-4 w-4" />Project Completed</span> : <button onClick={complete} className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white">Mark Project Complete</button>}
          </div>
        </div>
      </main>
    </>
  );
}
