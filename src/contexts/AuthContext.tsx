import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  type UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────
interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  /** Authenticated Firebase user, or null if logged out. */
  user: User | null;
  /** True while Firebase is resolving the initial auth state. */
  loading: boolean;
  /** Sign in with email + password. Sets user immediately on success. */
  login: (email: string, password: string) => Promise<UserCredential>;
  /** Create a new account. Sets user immediately on success. */
  register: (email: string, password: string) => Promise<UserCredential>;
  /** Sign out of Firebase and clear local user state. */
  logout: () => Promise<void>;
  /** Sign in with Google popup. Sets user immediately on success. */
  googleSignIn: () => Promise<UserCredential>;
  /** Send a password-reset email to the given address. */
  resetPassword: (email: string) => Promise<void>;
  /** Update the current user's displayName or photoURL. */
  updateUserProfile: (data: UpdateProfileData) => Promise<void>;
  /** Bypass auth with a local demo user (no network). */
  loginAsDemo: () => void;
}

// ──────────────────────────────────────────────────────────
// CONTEXT
// ──────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes (handles page refresh, token expiry, etc.)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        const e = error as { code?: string; message?: string };
        console.warn('[Auth] onAuthStateChanged error:', e.code, e.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  // ── login ──────────────────────────────────────────────
  // Sets user *synchronously* from the returned credential so that
  // ProtectedRoute never sees a null user when navigate('/dashboard') fires.
  const login = async (email: string, password: string): Promise<UserCredential> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    return cred;
  };

  // ── register ───────────────────────────────────────────
  const register = async (email: string, password: string): Promise<UserCredential> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    setUser(cred.user);
    return cred;
  };

  // ── logout ─────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    if (user?.uid === 'demo-founder') {
      setUser(null);
      return;
    }
    await signOut(auth);
    setUser(null);
  };

  // ── googleSignIn ───────────────────────────────────────
  const googleSignIn = async (): Promise<UserCredential> => {
    const cred = await signInWithPopup(auth, googleProvider);
    setUser(cred.user);
    return cred;
  };

  // ── resetPassword ──────────────────────────────────────
  const resetPassword = (email: string): Promise<void> =>
    sendPasswordResetEmail(auth, email);

  // ── updateUserProfile ──────────────────────────────────
  const updateUserProfile = async (data: UpdateProfileData): Promise<void> => {
    if (!auth.currentUser) return;
    await firebaseUpdateProfile(auth.currentUser, data);
    // Refresh local state to reflect new displayName/photoURL
    setUser({ ...auth.currentUser } as User);
  };

  // ── demo login ─────────────────────────────────────────
  const loginAsDemo = (): void => {
    const mockUser = {
      uid: 'demo-founder',
      email: 'demo@im-entrepreneur.com',
      displayName: 'Demo Founder',
      emailVerified: true,
      isAnonymous: false,
    } as unknown as User;
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleSignIn, resetPassword, updateUserProfile, loginAsDemo }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ──────────────────────────────────────────────────────────
// HOOK
// ──────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
