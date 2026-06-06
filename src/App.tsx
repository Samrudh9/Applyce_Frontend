import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import AtsReportPage from './pages/AtsReportPage';
import CoverLetterPage from './pages/CoverLetterPage';
import DashboardPage from './pages/DashboardPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import JobsPage from './pages/JobsPage';
import LandingPage from './pages/LandingPage';
import LoginPage, { AuthCallbackPage } from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import ResultPage from './pages/ResultPage';
import RoadmapPage from './pages/RoadmapPage';
import ScorecardPage from './pages/ScorecardPage';
import SkillQuizzesPage from './pages/SkillQuizzesPage';
import UploadPage from './pages/UploadPage';



const PageWrap = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AppShell><PageWrap><LandingPage /></PageWrap></AppShell>} />
          <Route path="/dashboard" element={<AppShell><PageWrap><DashboardPage /></PageWrap></AppShell>} />
          <Route path="/upload" element={<AppShell><PageWrap><UploadPage /></PageWrap></AppShell>} />
          <Route path="/result" element={<AppShell><PageWrap><ResultPage /></PageWrap></AppShell>} />
          <Route path="/jobs" element={<AppShell><PageWrap><JobsPage /></PageWrap></AppShell>} />
          <Route path="/roadmap" element={<AppShell><PageWrap><RoadmapPage /></PageWrap></AppShell>} />
          <Route path="/ats-report" element={<AppShell><PageWrap><AtsReportPage /></PageWrap></AppShell>} />
          <Route path="/pricing" element={<AppShell><PageWrap><PricingPage /></PageWrap></AppShell>} />
          <Route path="/about" element={<AppShell><PageWrap><AboutPage /></PageWrap></AppShell>} />
          <Route path="/resume-builder" element={<AppShell><PageWrap><ResumeBuilderPage /></PageWrap></AppShell>} />
          <Route path="/cover-letter" element={<AppShell><PageWrap><CoverLetterPage /></PageWrap></AppShell>} />
          <Route path="/interview" element={<AppShell><PageWrap><InterviewPrepPage /></PageWrap></AppShell>} />

          <Route path="/quizzes" element={<AppShell><PageWrap><SkillQuizzesPage /></PageWrap></AppShell>} />
          <Route path="/tracker" element={<AppShell><PageWrap><ApplicationTrackerPage /></PageWrap></AppShell>} />
          <Route path="/scorecard" element={<AppShell><PageWrap><ScorecardPage /></PageWrap></AppShell>} />
          <Route path="/scorecard/:token" element={<AppShell><PageWrap><ScorecardPage /></PageWrap></AppShell>} />
          <Route path="/login" element={<AppShell><PageWrap><LoginPage /></PageWrap></AppShell>} />
          <Route path="/auth/callback" element={<AppShell><PageWrap><AuthCallbackPage /></PageWrap></AppShell>} />
          <Route path="*" element={<AppShell><PageWrap><LandingPage /></PageWrap></AppShell>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
