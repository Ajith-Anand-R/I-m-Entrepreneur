import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';

interface SignUpProps {
  isLogin?: boolean;
}

export const SignUp: React.FC<SignUpProps> = ({ isLogin = false }) => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in window was closed before completion.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(auth, email, password);
        navigate('/dashboard');
      } else {
        await signUp(auth, email, password);
        navigate('/onboarding');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(getFriendlyErrorMessage(err.code || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(getFriendlyErrorMessage(err.code || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 text-slate-200 relative overflow-hidden font-sans">
      
      {/* ── Ambient Animated Blobs (Interactive Background) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Violet Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            x: [0, 40, 0], 
            y: [0, -30, 0] 
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.12) 0%, rgba(108,71,255,0) 70%)' }}
        />
        {/* Teal Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1], 
            x: [0, -30, 0], 
            y: [0, 40, 0] 
          }}
          transition={{ 
            duration: 16, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, rgba(0,212,170,0) 70%)' }}
        />
        {/* Pink Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1], 
            x: [0, 20, 0], 
            y: [0, 30, 0] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-[25%] right-[15%] w-[350px] h-[350px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,0,118,0.04) 0%, rgba(244,0,118,0) 70%)' }}
        />
      </div>

      {/* ── Glassmorphic Authentication Card ── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] bg-[#111118]/85 border border-white/[0.07] p-8 rounded-[28px] shadow-[0_25px_60px_rgba(0,0,0,0.55)] space-y-6 relative z-10 backdrop-blur-xl overflow-hidden"
      >
        {/* Neon Gradient Card Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6C47FF] via-[#F40076] to-[#00C2FF]" />

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 mx-auto">
            {/* Spinning dotted accent border */}
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl border border-dashed border-[#6C47FF]/50" 
            />
            <div 
              className="absolute inset-[3px] rounded-[14px] flex items-center justify-center font-black text-white text-base shadow-[0_4px_16px_rgba(108,71,255,0.4)]"
              style={{ background: 'linear-gradient(135deg,#6C47FF,#F40076)' }}
            >
              IE
            </div>
          </div>

          <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {isLogin ? 'Welcome back to your workspace' : 'Register Founder Account'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isLogin 
              ? 'Enter credentials to access your operating OS' 
              : 'Unlock cleaner-energy templates and accelerator hubs'}
          </p>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 bg-red-950/40 border border-red-800/50 text-red-300 p-3.5 rounded-2xl text-xs"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Authentication Button */}
        <motion.button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white/[0.03] border border-white/[0.07] text-white rounded-2xl text-xs font-bold transition shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.706 15.42.5 12.24.5 5.866.5.688 5.648.688 12s5.178 11.5 11.552 11.5c6.657 0 11.08-4.685 11.08-11.277 0-.76-.08-1.339-.177-1.938H12.24z"
            />
          </svg>
          {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
        </motion.button>

        {/* Separator */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-white/[0.06]"></div>
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or email access</span>
          <div className="flex-grow border-t border-white/[0.06]"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
              <input 
                type="email" 
                placeholder="name@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full text-xs bg-white/[0.02] border rounded-2xl pl-10 pr-4 py-3.5 outline-none transition-all duration-300 text-white placeholder-slate-600 ${focusedField === 'email' ? 'border-[#6C47FF] shadow-[0_0_15px_rgba(108,71,255,0.15)] bg-white/[0.04]' : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Password</label>
            <div className="relative">
              <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors duration-200 ${focusedField === 'password' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`w-full text-xs bg-white/[0.02] border rounded-2xl pl-10 pr-11 py-3.5 outline-none transition-all duration-300 text-white placeholder-slate-600 ${focusedField === 'password' ? 'border-[#6C47FF] shadow-[0_0_15px_rgba(108,71,255,0.15)] bg-white/[0.04]' : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field for Signup */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-400">Confirm Password</label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors duration-200 ${focusedField === 'confirmPassword' ? 'text-[#6C47FF]' : 'text-slate-500'}`} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full text-xs bg-white/[0.02] border rounded-2xl pl-10 pr-11 py-3.5 outline-none transition-all duration-300 text-white placeholder-slate-600 ${focusedField === 'confirmPassword' ? 'border-[#6C47FF] shadow-[0_0_15px_rgba(108,71,255,0.15)] bg-white/[0.04]' : 'border-white/[0.07] hover:border-white/[0.12]'}`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 bg-gradient-to-tr from-[#6C47FF] via-[#7C5CF2] to-[#F40076] hover:opacity-95 text-white rounded-2xl text-xs font-bold transition-all duration-300 shadow-[0_6px_20px_rgba(108,71,255,0.35)] flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="font-bold tracking-wide">Authenticating...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Access Workspace' : 'Create Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
          
          {/* Switch Action */}
          <div className="text-center pt-3">
            <Link 
              to={isLogin ? '/signup' : '/login'}
              className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center justify-center gap-1 group"
            >
              <span>{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </Link>
          </div>

          {/* Demo Mode Bypass */}
          <div className="text-center pt-2 border-t border-white/[0.04] mt-4">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-[#00C2FF] hover:text-[#00D4AA] hover:underline font-bold transition-colors cursor-pointer"
            >
              Continue in Demo Mode (Local Offline Bypass)
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
