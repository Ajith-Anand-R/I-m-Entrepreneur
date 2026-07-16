import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  onAuthStateChanged,
  type UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: typeof signInWithEmailAndPassword;
  signUp: typeof createUserWithEmailAndPassword;
  logout: typeof signOut;
  signInWithGoogle: () => Promise<UserCredential>;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.warn("Firebase Auth state error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn: typeof signInWithEmailAndPassword = (authInstance, email, password) => {
    return signInWithEmailAndPassword(authInstance, email, password);
  };

  const signUp: typeof createUserWithEmailAndPassword = (authInstance, email, password) => {
    return createUserWithEmailAndPassword(authInstance, email, password);
  };

  const logout: typeof signOut = (authInstance) => {
    if (user?.uid === 'demo-founder-ajith') {
      setUser(null);
      return Promise.resolve();
    }
    return signOut(authInstance);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const loginAsDemo = () => {
    const mockUser = {
      uid: 'demo-founder-ajith',
      email: 'ajith@im-entrepreneur.com',
      displayName: 'Ajith',
      emailVerified: true,
    } as unknown as User;
    setUser(mockUser);
    setLoading(false);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    loginAsDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
