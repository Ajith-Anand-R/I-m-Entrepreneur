import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { LandingPage } from './app/landing/LandingPage';

// Onboarding Pages
import { Splash } from './app/onboarding/Splash';
import { SignUp } from './app/onboarding/SignUp';
import { SetupWizard } from './app/onboarding/SetupWizard';

// Discovery Flow (Identity Discovery Engine) - forced refresh
import { InspirationScreen } from './app/discovery/InspirationScreen';
import { DiscoveryFlow } from './app/discovery/DiscoveryFlow';
import { ProblemDiscovery } from './app/discovery/ProblemDiscovery';
import { ProfileReveal } from './app/discovery/ProfileReveal';
import { RoadmapPreview } from './app/discovery/RoadmapPreview';
import { HunchBook } from './app/hunchbook/HunchBook';

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
        <Route path="/onboarding" element={<PageWrapper><ProtectedRoute><InspirationScreen /></ProtectedRoute></PageWrapper>} />
        <Route path="/setup" element={<PageWrapper><ProtectedRoute><SetupWizard /></ProtectedRoute></PageWrapper>} />

        {/* Identity Discovery Flow */}
        <Route path="/discover/inspiration" element={<PageWrapper><ProtectedRoute><InspirationScreen /></ProtectedRoute></PageWrapper>} />
        <Route path="/discover/identity" element={<PageWrapper><ProtectedRoute><DiscoveryFlow /></ProtectedRoute></PageWrapper>} />
        <Route path="/discover/problems" element={<PageWrapper><ProtectedRoute><ProblemDiscovery /></ProtectedRoute></PageWrapper>} />
        <Route path="/discover/profile" element={<PageWrapper><ProtectedRoute><ProfileReveal /></ProtectedRoute></PageWrapper>} />
        <Route path="/discover/roadmap" element={<PageWrapper><ProtectedRoute><RoadmapPreview /></ProtectedRoute></PageWrapper>} />

        {/* Main Workspace Routes */}
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><ProtectedRoute><DashboardHome /></ProtectedRoute></PageWrapper>} />
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
        <Route path="/hunchbook" element={<PageWrapper><ProtectedRoute><HunchBook /></ProtectedRoute></PageWrapper>} />

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
