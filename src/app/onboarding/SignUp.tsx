import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  CheckCircle2, RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────
interface SignUpProps {
  isLogin?: boolean;
}

type Screen = 'form' | 'forgot-email' | 'forgot-sent';

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────
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

const getPasswordStrength = (pw: string): { score: 0 | 1 | 2 | 3; label: string; color: string } => {
  if (pw.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)                          score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw))   score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { score: 0, label: '',        color: '' },
    { score: 1, label: 'Weak',    color: '#F40076' },
    { score: 2, label: 'Medium',  color: '#FFAA00' },
    { score: 3, label: 'Strong',  color: '#00D4AA' },
  ] as const;
  return map[score as 0 | 1 | 2 | 3];
};

// ──────────────────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────────────────
export const SignUp: React.FC<SignUpProps> = ({ isLogin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, googleSignIn, resetPassword, loginAsDemo } = useAuth();

  const [screen, setScreen]             = useState<Screen>('form');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [isLoading, setIsLoading]       = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  // Autofocus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Where to redirect after successful auth
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';
  const afterAuthPath = isLogin ? from : '/onboarding';

  // ── Derived ────────────────────────────────────────────
  const strength = getPasswordStrength(password);
  const passwordsMatch = !isLogin && confirmPassword.length > 0 && password === confirmPassword;

  // ── Handlers ───────────────────────────────────────────
  const clearError = () => setError(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!isLogin && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      navigate(afterAuthPath, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getFriendlyError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearError();
    setIsLoading(true);
    try {
      await googleSignIn();
      navigate(afterAuthPath, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getFriendlyError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!resetEmail.trim()) {
      setError('Enter your email address.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(resetEmail.trim());
      setScreen('forgot-sent');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      setError(getFriendlyError(code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard', { replace: true });
  };

  // ── Shared styles ──────────────────────────────────────
  const inputClass = (field: string) =>
    `w-full text-xs bg-white/[0.02] border rounded-2xl pl-10 pr-4 py-3.5 outline-none transition-all duration-300 text-white placeholder-slate-600 ${
      focusedField === field
        ? 'border-[#6C47FF] shadow-[0_0_16px_rgba(108,71,255,0.18)] bg-white/[0.04]'
        : 'border-white/[0.07] hover:border-white/[0.13]'
    }`;

  // ══════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 text-slate-200 relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.18, 1], x: [0, 40, 0], y: [0, -28, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.14, 1], x: [0, -28, 0], y: [0, 38, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[540px] h-[540px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.28, 1], x: [0, 18, 0], y: [0, 28, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[22%] right-[14%] w-[340px] h-[340px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,0,118,0.05) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Card ── */}
      <motion.div
        key={screen}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div
          className="bg-[#111118]/90 border border-white/[0.07] p-8 rounded-[28px] shadow-[0_28px_70px_rgba(0,0,0,0.6)] space-y-6 backdrop-blur-2xl overflow-hidden"
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#6C47FF] via-[#F40076] to-[#00C2FF]" />

          {/* ── Brand header ── */}
          <div className="text-center space-y-3">
            <div className="relative w-14 h-14 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border border-dashed border-[#6C47FF]/50"
              />
              <div
                className="absolute inset-[3px] rounded-[14px] flex items-center justify-center font-black text-white text-base"
                style={{ background: 'linear-gradient(135deg,#6C47FF,#F40076)', boxShadow: '0 4px 18px rgba(108,71,255,0.5)' }}
              >
                IE
              </div>
            </div>

            <AnimatePresence mode="wait">
              {screen === 'form' && (
                <motion.div key="form-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {isLogin ? 'Welcome back' : 'Create your account'}
                  </h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {isLogin ? 'Sign in to your founder workspace' : 'Build your startup OS in minutes'}
                  </p>
                </motion.div>
              )}
              {screen === 'forgot-email' && (
                <motion.div key="forgot-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Reset your password
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">We'll send a reset link to your email</p>
                </motion.div>
              )}
              {screen === 'forgot-sent' && (
                <motion.div key="sent-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h1 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Check your inbox
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Reset link sent to <span className="text-white/70 font-semibold">{resetEmail}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Error alert ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2.5 bg-red-950/40 border border-red-800/50 text-red-300 p-3.5 rounded-2xl text-xs overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════
              SCREEN: Main form
          ══════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {screen === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="space-y-5"
              >
                {/* Google button */}
                <motion.button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white rounded-2xl text-xs font-bold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.706 15.42.5 12.24.5 5.866.5.688 5.648.688 12s5.178 11.5 11.552 11.5c6.657 0 11.08-4.685 11.08-11.277 0-.76-.08-1.339-.177-1.938H12.24z" />
                  </svg>
                  {isLogin ? 'Continue with Google' : 'Sign up with Google'}
                </motion.button>

                {/* Separator */}
                <div className="flex items-center gap-3">
                  <div className="flex-grow border-t border-white/[0.06]" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">or email</span>
                  <div className="flex-grow border-t border-white/[0.06]" />
                </div>

                {/* Email/password form */}
                <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Email</label>
                    <div className="relative">
                      <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField === 'email' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
                      <input
                        ref={emailRef}
                        id="auth-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@startup.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); clearError(); }}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('email')}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Password</label>
                    <div className="relative">
                      <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField === 'password' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); clearError(); }}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClass('password')} pr-11`}
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength (signup only) */}
                    {!isLogin && password.length > 0 && (
                      <div className="space-y-1 pt-0.5">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-[3px] flex-1 rounded-full transition-all duration-300"
                              style={{
                                background: strength.score >= i ? strength.color : 'rgba(255,255,255,0.07)',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-medium" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password (signup only) */}
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField === 'confirm' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
                        <input
                          id="auth-confirm"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                          onFocus={() => setFocusedField('confirm')}
                          onBlur={() => setFocusedField(null)}
                          className={`${inputClass('confirm')} pr-11 ${
                            confirmPassword.length > 0
                              ? passwordsMatch
                                ? 'border-[#00D4AA]'
                                : 'border-[#F40076]/60'
                              : ''
                          }`}
                          required
                          disabled={isLoading}
                        />
                        {confirmPassword.length > 0 && (
                          <div className="absolute right-3.5 top-3.5">
                            {passwordsMatch
                              ? <CheckCircle2 className="w-4 h-4 text-[#00D4AA]" />
                              : <AlertCircle className="w-4 h-4 text-[#F40076]/70" />
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Forgot password link (login only) */}
                  {isLogin && (
                    <div className="flex justify-end -mt-1">
                      <button
                        type="button"
                        onClick={() => { setScreen('forgot-email'); setResetEmail(email); clearError(); }}
                        className="text-[10px] text-[#6C47FF] hover:text-[#8B5CF6] font-semibold transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      background: 'linear-gradient(135deg, #6C47FF, #F40076)',
                      boxShadow: '0 6px 24px rgba(108,71,255,0.4)',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating…</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                  {/* Switch auth mode */}
                  <div className="text-center pt-1">
                    <Link
                      to={isLogin ? '/signup' : '/login'}
                      className="text-xs text-slate-400 hover:text-white transition-colors font-medium group inline-flex items-center gap-1"
                    >
                      {isLogin ? "Don't have an account? " : 'Already have an account? '}
                      <span className="text-[#6C47FF] font-semibold group-hover:text-[#8B5CF6] transition-colors">
                        {isLogin ? 'Sign up free' : 'Sign in'}
                      </span>
                    </Link>
                  </div>

                  {/* Demo mode */}
                  <div className="text-center border-t border-white/[0.04] pt-4">
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="text-[10px] text-slate-500 hover:text-[#00C2FF] transition-colors font-semibold"
                    >
                      Continue in Demo Mode (no account needed)
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                SCREEN: Forgot password — enter email
            ══════════════════════════════════════════════ */}
            {screen === 'forgot-email' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="space-y-5"
              >
                <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Email address</label>
                    <div className="relative">
                      <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${focusedField === 'reset-email' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
                      <input
                        id="reset-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@startup.com"
                        value={resetEmail}
                        onChange={(e) => { setResetEmail(e.target.value); clearError(); }}
                        onFocus={() => setFocusedField('reset-email')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass('reset-email')}
                        required
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg,#6C47FF,#F40076)', boxShadow: '0 6px 24px rgba(108,71,255,0.4)' }}
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    <span>{isLoading ? 'Sending…' : 'Send Reset Link'}</span>
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setScreen('form'); clearError(); }}
                      className="text-[10px] text-slate-500 hover:text-white transition-colors font-semibold"
                    >
                      ← Back to sign in
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                SCREEN: Forgot password — email sent
            ══════════════════════════════════════════════ */}
            {screen === 'forgot-sent' && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="space-y-5 text-center"
              >
                <div className="flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)' }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#00D4AA]" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If an account exists for <span className="text-white/70 font-semibold">{resetEmail}</span>, you will receive a reset link within a few minutes.
                </p>
                <button
                  onClick={() => { setScreen('form'); setResetEmail(''); clearError(); }}
                  className="w-full py-3.5 text-xs font-bold text-white rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                >
                  Back to Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
