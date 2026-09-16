import { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { session, profile, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session && profile && !loading) {
      navigate(profile.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [session, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError(
        error.includes('Invalid login credentials')
          ? "Invalid email or password. If you don't have an account, please contact your administrator."
          : error
      );
      setStatus('idle');
    }
    // On success: the useEffect redirect fires when session + profile load.
    // onAuthStateChange triggers loadProfile, which sets profile and loading=false.
  };

  return (
    <>
      <SEO
        title="Login — Alyntis"
        description="Sign in to your Alyntis account to access projects, resources, quizzes and your innovation portfolio."
      />

      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-navy-950 py-16">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-md px-4 sm:px-6">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="mb-8 flex justify-center">
                <Logo variant="light" />
              </div>

              <h1 className="text-center text-2xl font-bold text-white">Welcome Back</h1>
              <p className="mt-2 text-center text-sm text-gray-400">
                Sign in to access your maker journey
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-navy-950/50 py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm text-gray-400 transition-colors hover:text-teal-400">
                  ← Back to home
                </Link>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs leading-relaxed text-gray-400">
                  Don't have an account? Contact your administrator to get one created for you.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
