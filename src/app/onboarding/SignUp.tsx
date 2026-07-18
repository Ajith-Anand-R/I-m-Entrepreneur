import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  CheckCircle2, RefreshCw, Sparkles, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

/* ── Types ── */
interface SignUpProps { isLogin?: boolean; }
type Screen = 'form' | 'forgot-email' | 'forgot-sent';

/* ── Helpers ── */
const SG = "'Space Grotesk',sans-serif";
const EASE = [0.16, 1, 0.3, 1] as const;

const getFriendlyError = (code: string): string => {
  const map: Record<string, string> = {
    'auth/user-not-found':          'No account found with that email.',
    'auth/wrong-password':           'Incorrect password.',
    'auth/invalid-credential':       'Invalid email or password.',
    'auth/invalid-email':            'Please enter a valid email address.',
    'auth/email-already-in-use':     'An account already exists with this email.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/popup-closed-by-user':     'Sign-in window was closed. Please try again.',
    'auth/popup-blocked':            'Pop-up blocked. Allow pop-ups for this site and retry.',
    'auth/too-many-requests':        'Too many attempts. Wait a moment then try again.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/user-disabled':            'This account has been disabled. Contact support.',
    'auth/operation-not-allowed':    'This sign-in method is not enabled.',
    'auth/account-exists-with-different-credential':
      'An account already exists with a different sign-in method.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
};

const getPasswordStrength = (pw: string): { score: 0|1|2|3; label: string; color: string } => {
  if (pw.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Weak', color: '#F43F5E' },
    { score: 2, label: 'Medium', color: '#F59E0B' },
    { score: 3, label: 'Strong', color: '#34D399' },
  ] as const;
  return map[score as 0|1|2|3];
};

/* ── Floating feature cards for left panel ── */
const FeatureCard: React.FC<{ icon: React.ElementType; title: string; desc: string; delay: number; color: string }> = 
  ({ icon: Icon, title, desc, delay, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: EASE }}
    className="flex items-start gap-3 p-3 rounded-2xl glass-frost"
  >
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}12` }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <div>
      <p className="text-[12px] font-bold text-ink-900">{title}</p>
      <p className="text-[11px] text-ink-300 mt-0.5">{desc}</p>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════════════════ */
export const SignUp: React.FC<SignUpProps> = ({ isLogin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, googleSignIn, resetPassword, loginAsDemo } = useAuth();

  const [screen, setScreen] = useState<Screen>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => { emailRef.current?.focus(); }, []);

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
  const afterAuthPath = isLogin ? from : '/onboarding';
  const strength = getPasswordStrength(password);
  const passwordsMatch = !isLogin && confirmPassword.length > 0 && password === confirmPassword;
  const clearError = () => setError(null);

  /* ── Handlers ── */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return; }
    if (!isLogin && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!isLogin && password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setIsLoading(true);
    try {
      if (isLogin) await login(email.trim(), password);
      else await register(email.trim(), password);
      navigate(afterAuthPath, { replace: true });
    } catch (err: unknown) {
      setError(getFriendlyError((err as { code?: string }).code ?? ''));
    } finally { setIsLoading(false); }
  };

  const handleGoogleAuth = async () => {
    clearError(); setIsLoading(true);
    try { await googleSignIn(); navigate(afterAuthPath, { replace: true }); }
    catch (err: unknown) { setError(getFriendlyError((err as { code?: string }).code ?? '')); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearError();
    if (!resetEmail.trim()) { setError('Enter your email address.'); return; }
    setIsLoading(true);
    try { await resetPassword(resetEmail.trim()); setScreen('forgot-sent'); }
    catch (err: unknown) { setError(getFriendlyError((err as { code?: string }).code ?? '')); }
    finally { setIsLoading(false); }
  };

  const handleDemoLogin = () => { loginAsDemo(); navigate('/dashboard', { replace: true }); };

  /* ── Input styling ── */
  const inputCls = (field: string) =>
    `w-full text-[13px] bg-white border rounded-2xl pl-10 pr-4 py-3.5 outline-none transition-all duration-250 text-ink-900 placeholder-ink-300 ${
      focusedField === field
        ? 'border-accent shadow-[0_0_0_3px_rgba(108,71,255,0.08)] bg-white'
        : 'border-[rgba(108,71,255,0.1)] hover:border-[rgba(108,71,255,0.2)]'
    }`;

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex gradient-mesh-hero">

      {/* ── Left panel — Brand showcase (desktop) ── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-center px-12 xl:px-16">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-purple absolute w-[400px] h-[400px] -top-20 -left-16" />
          <div className="orb orb-sky absolute w-[300px] h-[300px] bottom-20 right-10" />
          <div className="orb orb-mint absolute w-[200px] h-[200px] top-1/3 right-0" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-accent/10 bg-black flex items-center justify-center shrink-0">
              <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
            </div>
            <span className="font-bold text-lg text-ink-900" style={{ fontFamily: SG }}>I'm Entrepreneur</span>
          </div>

          {/* Tagline */}
          <div>
            <h2 className="text-3xl xl:text-4xl font-black text-ink-900 leading-tight" style={{ fontFamily: SG }}>
              Build your startup
              <br />
              with <span className="text-brand">confidence</span>
            </h2>
            <p className="text-sm text-ink-500 mt-3 max-w-sm leading-relaxed">
              AI-powered mentoring, structured journey maps, and smart document generation — all in one workspace.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 max-w-sm">
            <FeatureCard icon={Sparkles} title="AI Mentor Panel" desc="Get guidance from domain-expert AI mentors" delay={0.3} color="#6C47FF" />
            <FeatureCard icon={Zap} title="15-Stage Journey" desc="Step-by-step startup validation roadmap" delay={0.45} color="#F59E0B" />
            <FeatureCard icon={ArrowRight} title="Smart Generators" desc="Auto-draft pitch decks, SWOT, and NDAs" delay={0.6} color="#38BDF8" />
          </div>
        </motion.div>
      </div>

      {/* ── Right panel — Auth form ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="card-pro p-8 md:p-10 space-y-6 overflow-hidden relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'linear-gradient(90deg, #6C47FF, #8B7AFF, #38BDF8)' }} />

            <div className="lg:hidden text-center mb-2">
              <div className="w-12 h-12 rounded-2xl mx-auto overflow-hidden border border-accent/10 bg-black flex items-center justify-center shrink-0">
                <img src="/beyond_guidance_logo.jpg" alt="Beyond Guidance" className="w-full h-full object-contain scale-[1.3] -translate-y-[2px]" />
              </div>
            </div>

            {/* ── Header ── */}
            <AnimatePresence mode="wait">
              {screen === 'form' && (
                <motion.div key="form-h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <h1 className="text-xl font-bold text-ink-900" style={{ fontFamily: SG }}>
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h1>
                  <p className="text-xs text-ink-300 mt-1.5">
                    {isLogin ? 'Sign in to your founder workspace' : 'Build your startup OS in minutes'}
                  </p>
                </motion.div>
              )}
              {screen === 'forgot-email' && (
                <motion.div key="forgot-h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <h1 className="text-xl font-bold text-ink-900" style={{ fontFamily: SG }}>Reset your password</h1>
                  <p className="text-xs text-ink-300 mt-1.5">We'll send a reset link to your email</p>
                </motion.div>
              )}
              {screen === 'forgot-sent' && (
                <motion.div key="sent-h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <h1 className="text-xl font-bold text-ink-900" style={{ fontFamily: SG }}>Check your inbox</h1>
                  <p className="text-xs text-ink-300 mt-1.5">Reset link sent to <span className="font-semibold text-ink-500">{resetEmail}</span></p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Error ── */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 bg-rose/5 border border-rose/20 text-rose p-3.5 rounded-2xl text-xs overflow-hidden">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                FORM SCREEN
            ══════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              {screen === 'form' && (
                <motion.div key="form" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3, ease: EASE }} className="space-y-5">

                  {/* Google */}
                  <motion.button type="button" onClick={handleGoogleAuth} disabled={isLoading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-[rgba(108,71,255,0.1)] hover:border-accent/20 text-ink-900 rounded-2xl text-[13px] font-bold transition-all duration-200 shadow-xs disabled:opacity-50">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.706 15.42.5 12.24.5 5.866.5.688 5.648.688 12s5.178 11.5 11.552 11.5c6.657 0 11.08-4.685 11.08-11.277 0-.76-.08-1.339-.177-1.938H12.24z" />
                    </svg>
                    {isLogin ? 'Continue with Google' : 'Sign up with Google'}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-grow border-t border-accent/[0.06]" />
                    <span className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">or email</span>
                    <div className="flex-grow border-t border-accent/[0.06]" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-300">Email</label>
                      <div className="relative">
                        <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField==='email' ? 'text-accent' : 'text-ink-300'}`} />
                        <input ref={emailRef} id="auth-email" type="email" autoComplete="email" placeholder="name@startup.com"
                          value={email} onChange={e => { setEmail(e.target.value); clearError(); }}
                          onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                          className={inputCls('email')} required disabled={isLoading} />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-300">Password</label>
                      <div className="relative">
                        <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField==='password' ? 'text-accent' : 'text-ink-300'}`} />
                        <input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'}
                          placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); clearError(); }}
                          onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                          className={`${inputCls('password')} pr-11`} required disabled={isLoading} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3.5 text-ink-300 hover:text-ink-500 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}>
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Strength */}
                      {!isLogin && password.length > 0 && (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex gap-1">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-[3px] flex-1 rounded-full transition-all duration-300"
                                style={{ background: strength.score >= i ? strength.color : 'rgba(108,71,255,0.08)' }} />
                            ))}
                          </div>
                          <p className="text-[10px] font-medium" style={{ color: strength.color }}>{strength.label}</p>
                        </div>
                      )}
                    </div>

                    {/* Confirm */}
                    {!isLogin && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-300">Confirm password</label>
                        <div className="relative">
                          <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField==='confirm' ? 'text-accent' : 'text-ink-300'}`} />
                          <input id="auth-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="••••••••"
                            value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); clearError(); }}
                            onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                            className={`${inputCls('confirm')} pr-11 ${confirmPassword.length > 0 ? (passwordsMatch ? 'border-mint' : 'border-rose/40') : ''}`}
                            required disabled={isLoading} />
                          {confirmPassword.length > 0 && (
                            <div className="absolute right-3.5 top-3.5">
                              {passwordsMatch ? <CheckCircle2 className="w-4 h-4 text-mint" /> : <AlertCircle className="w-4 h-4 text-rose/60" />}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Forgot */}
                    {isLogin && (
                      <div className="flex justify-end -mt-1">
                        <button type="button" onClick={() => { setScreen('forgot-email'); setResetEmail(email); clearError(); }}
                          className="text-[10px] text-accent hover:text-accent-deep font-semibold transition-colors">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {/* Submit */}
                    <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full py-3.5 rounded-2xl text-[13px] flex items-center justify-center gap-2.5 disabled:opacity-60">
                      {isLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /><span>Authenticating…</span></>
                      ) : (
                        <><span>{isLogin ? 'Sign In' : 'Create Account'}</span><ArrowRight className="w-4 h-4" /></>
                      )}
                    </motion.button>

                    {/* Switch mode */}
                    <div className="text-center pt-1">
                      <Link to={isLogin ? '/signup' : '/login'}
                        className="text-xs text-ink-300 hover:text-ink-500 transition-colors font-medium">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <span className="text-accent font-semibold">{isLogin ? 'Sign up free' : 'Sign in'}</span>
                      </Link>
                    </div>

                    {/* Demo */}
                    <div className="text-center border-t border-accent/[0.06] pt-4">
                      <button type="button" onClick={handleDemoLogin}
                        className="text-[10px] text-ink-300 hover:text-accent transition-colors font-semibold">
                        Continue in Demo Mode (no account needed)
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Forgot email ── */}
              {screen === 'forgot-email' && (
                <motion.div key="forgot" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3, ease: EASE }} className="space-y-5">
                  <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-ink-300">Email address</label>
                      <div className="relative">
                        <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField==='reset-email' ? 'text-accent' : 'text-ink-300'}`} />
                        <input id="reset-email" type="email" autoComplete="email" placeholder="name@startup.com"
                          value={resetEmail} onChange={e => { setResetEmail(e.target.value); clearError(); }}
                          onFocus={() => setFocusedField('reset-email')} onBlur={() => setFocusedField(null)}
                          className={inputCls('reset-email')} required disabled={isLoading} autoFocus />
                      </div>
                    </div>
                    <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full py-3.5 rounded-2xl text-[13px] flex items-center justify-center gap-2.5 disabled:opacity-60">
                      {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>{isLoading ? 'Sending…' : 'Send Reset Link'}</span>
                    </motion.button>
                    <div className="text-center">
                      <button type="button" onClick={() => { setScreen('form'); clearError(); }}
                        className="text-[11px] text-ink-300 hover:text-accent transition-colors font-semibold">
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ── Forgot sent ── */}
              {screen === 'forgot-sent' && (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }} className="space-y-5 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                      <CheckCircle2 className="w-7 h-7 text-mint" />
                    </div>
                  </div>
                  <p className="text-xs text-ink-300 leading-relaxed">
                    If an account exists for <span className="text-ink-500 font-semibold">{resetEmail}</span>, you will receive a reset link within a few minutes.
                  </p>
                  <button onClick={() => { setScreen('form'); setResetEmail(''); clearError(); }}
                    className="btn-secondary w-full py-3.5 rounded-2xl text-[13px]">
                    Back to Sign In
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
