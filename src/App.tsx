import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { useRouteMeta } from './hooks/useRouteMeta';
import { AppLayout } from './components/layout/AppLayout';
import { MarketingLayout } from './components/layout/MarketingLayout';
import { AuthProvider } from './context/AuthContext';
import AboutPage from './pages/AboutPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import ApplyAgentPage from './pages/ApplyAgentPage';
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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    {children}
  </motion.div>
);

const marketing = (node: ReactNode) => (
  <MarketingLayout>
    <PageWrap>{node}</PageWrap>
  </MarketingLayout>
);

const app = (node: ReactNode) => (
  <AppLayout>
    <PageWrap>{node}</PageWrap>
  </AppLayout>
);

function App() {
  const location = useLocation();
  useRouteMeta();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Marketing */}
          <Route path="/" element={marketing(<LandingPage />)} />
          <Route path="/pricing" element={marketing(<PricingPage />)} />
          <Route path="/about" element={marketing(<AboutPage />)} />
          <Route path="/login" element={marketing(<LoginPage />)} />
          <Route path="/auth/callback" element={marketing(<AuthCallbackPage />)} />

          {/* Product */}
          <Route path="/dashboard" element={app(<DashboardPage />)} />
          <Route path="/upload" element={app(<UploadPage />)} />
          <Route path="/result" element={app(<ResultPage />)} />
          <Route path="/jobs" element={app(<JobsPage />)} />
          <Route path="/roadmap" element={app(<RoadmapPage />)} />
          <Route path="/ats-report" element={app(<AtsReportPage />)} />
          <Route path="/resume-builder" element={app(<ResumeBuilderPage />)} />
          <Route path="/cover-letter" element={app(<CoverLetterPage />)} />
          <Route path="/interview" element={app(<InterviewPrepPage />)} />
          <Route path="/quizzes" element={app(<SkillQuizzesPage />)} />
          <Route path="/tracker" element={app(<ApplicationTrackerPage />)} />
          <Route path="/scorecard" element={app(<ScorecardPage />)} />
          <Route path="/scorecard/:token" element={app(<ScorecardPage />)} />
          <Route path="/apply-agent" element={app(<ApplyAgentPage />)} />

          <Route path="*" element={marketing(<LandingPage />)} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;