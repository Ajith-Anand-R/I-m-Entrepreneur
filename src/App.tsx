import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from './components/AppShell';

// Page imports
import { DashboardHome } from './app/dashboard/DashboardHome';
import { WorkspaceHome } from './app/workspace/WorkspaceHome';
import { JourneyHome } from './app/journey/JourneyHome';
import { LevelDetail } from './app/journey/LevelDetail';
import { MentorHub } from './app/mentor/MentorHub';
import { ChatContainer } from './app/mentor/ChatContainer';
import { MoreScreen } from './app/more/MoreScreen';
import { SettingsScreen } from './app/settings/SettingsScreen';
import { ScoreScreen } from './app/dashboard/ScoreScreen';
import { ProfileScreen } from './app/settings/ProfileScreen';
import { AcademyHome } from './app/academy/AcademyHome';
import { BuilderHome } from './app/builder/BuilderHome';
import { GeneratorHome } from './app/generator/GeneratorHome';
import { CommunityFeed } from './app/community/CommunityFeed';
import { MeetingsList } from './app/meetings/MeetingsList';

// Onboarding Pages
import { Splash } from './app/onboarding/Splash';
import { SignUp } from './app/onboarding/SignUp';
import { SetupWizard } from './app/onboarding/SetupWizard';

// Auth Imports
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }} // Custom cubic bezier ease-out
    className="h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Onboarding & Authentication */}
        <Route path="/splash" element={<PageWrapper><Splash /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><SignUp isLogin={true} /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignUp isLogin={false} /></PageWrapper>} />
        <Route path="/onboarding" element={<PageWrapper><ProtectedRoute><SetupWizard /></ProtectedRoute></PageWrapper>} />

        {/* Main Workspace Routes */}
        <Route path="/" element={<PageWrapper><ProtectedRoute><DashboardHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/workspace" element={<PageWrapper><ProtectedRoute><WorkspaceHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/journey" element={<PageWrapper><ProtectedRoute><JourneyHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/journey/level/:id" element={<PageWrapper><ProtectedRoute><LevelDetail /></ProtectedRoute></PageWrapper>} />
        <Route path="/mentor" element={<PageWrapper><ProtectedRoute><MentorHub /></ProtectedRoute></PageWrapper>} />
        <Route path="/mentor/chat/:id" element={<PageWrapper><ProtectedRoute><ChatContainer /></ProtectedRoute></PageWrapper>} />
        <Route path="/more" element={<PageWrapper><ProtectedRoute><MoreScreen /></ProtectedRoute></PageWrapper>} />
        
        {/* Sub-features */}
        <Route path="/score" element={<PageWrapper><ProtectedRoute><ScoreScreen /></ProtectedRoute></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProtectedRoute><ProfileScreen /></ProtectedRoute></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><ProtectedRoute><SettingsScreen /></ProtectedRoute></PageWrapper>} />
        <Route path="/academy" element={<PageWrapper><ProtectedRoute><AcademyHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/builder" element={<PageWrapper><ProtectedRoute><BuilderHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/generator" element={<PageWrapper><ProtectedRoute><GeneratorHome /></ProtectedRoute></PageWrapper>} />
        <Route path="/community" element={<PageWrapper><ProtectedRoute><CommunityFeed /></ProtectedRoute></PageWrapper>} />
        <Route path="/meetings" element={<PageWrapper><ProtectedRoute><MeetingsList /></ProtectedRoute></PageWrapper>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppShell>
          <AnimatedRoutes />
        </AppShell>
      </AuthProvider>
    </Router>
  );
};

export default App;
