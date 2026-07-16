import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center gap-5">
        {/* Orbital spinner matching the app's design language */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-white/5" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#6C47FF] border-r-[#00C2FF] border-b-transparent border-l-transparent animate-spin" />
          <div
            className="absolute inset-2 rounded-full border border-dashed animate-spin"
            style={{ borderColor: 'rgba(244,0,118,0.3)', animationDuration: '3s', animationDirection: 'reverse' }}
          />
        </div>
        <p className="text-white/30 text-[11px] font-mono tracking-[0.25em] uppercase animate-pulse">
          Authenticating…
        </p>
      </div>
    );
  }

  if (!user) {
    // Preserve the destination so we can redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
