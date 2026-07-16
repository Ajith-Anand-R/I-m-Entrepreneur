import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';

interface SignUpProps {
  isLogin?: boolean;
}

export const SignUp: React.FC<SignUpProps> = ({ isLogin = false }) => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        navigate('/');
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
      navigate('/');
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(getFriendlyErrorMessage(err.code || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-800 relative overflow-hidden">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-teal/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-violet/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm bg-white border border-slate-100/70 p-6 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.02)] space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-teal to-accent-violet flex items-center justify-center font-bold text-white text-xl mx-auto shadow-md">
            IE
          </div>
          <h2 className="text-base font-bold text-slate-800">
            {isLogin ? 'Welcome Back' : 'Create Founder Profile'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isLogin 
              ? 'Log in to your startup command center' 
              : 'Get access to clean-energy startup operating templates'}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition shadow-sm disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.706 15.42.5 12.24.5 5.866.5.688 5.648.688 12s5.178 11.5 11.552 11.5c6.657 0 11.08-4.685 11.08-11.277 0-.76-.08-1.339-.177-1.938H12.24z"
            />
          </svg>
          {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">or email</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="email" 
                placeholder="name@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-accent-teal transition text-slate-800"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-accent-teal transition text-slate-800"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-450 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 outline-none focus:border-accent-teal transition text-slate-800"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-tr from-accent-teal to-accent-violet hover:opacity-90 text-white rounded-xl text-xs font-bold transition shadow-[0_4px_12px_rgba(124,92,242,0.2)] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Profile'}</span>
            )}
          </button>
          
          <div className="text-center pt-2">
            <Link 
              to={isLogin ? '/signup' : '/login'}
              className="text-xs text-accent-teal hover:underline font-bold"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
