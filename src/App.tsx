import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import AboutPage from './pages/AboutPage';
import AtsReportPage from './pages/AtsReportPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import RegisterPage from './pages/RegisterPage';
import ResultPage from './pages/ResultPage';
import RoadmapPage from './pages/RoadmapPage';
import UploadPage from './pages/UploadPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminResumesPage from './pages/admin/AdminResumesPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminBackupPage from './pages/admin/AdminBackupPage';
import AdminSystemPage from './pages/admin/AdminSystemPage';

const PageWrap = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppShell><PageWrap><LandingPage /></PageWrap></AppShell>} />
        <Route path="/register" element={<AppShell><PageWrap><RegisterPage /></PageWrap></AppShell>} />
        <Route path="/login" element={<AppShell><PageWrap><LoginPage /></PageWrap></AppShell>} />
        <Route path="/dashboard" element={<AppShell><PageWrap><DashboardPage /></PageWrap></AppShell>} />
        <Route path="/upload" element={<AppShell><PageWrap><UploadPage /></PageWrap></AppShell>} />
        <Route path="/result" element={<AppShell><PageWrap><ResultPage /></PageWrap></AppShell>} />
        <Route path="/jobs" element={<AppShell><PageWrap><JobsPage /></PageWrap></AppShell>} />
        <Route path="/roadmap" element={<AppShell><PageWrap><RoadmapPage /></PageWrap></AppShell>} />
        <Route path="/ats-report" element={<AppShell><PageWrap><AtsReportPage /></PageWrap></AppShell>} />
        <Route path="/pricing" element={<AppShell><PageWrap><PricingPage /></PageWrap></AppShell>} />
        <Route path="/about" element={<AppShell><PageWrap><AboutPage /></PageWrap></AppShell>} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="resumes" element={<AdminResumesPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="backup" element={<AdminBackupPage />} />
          <Route path="system" element={<AdminSystemPage />} />
        </Route>

        <Route path="*" element={<AppShell><PageWrap><LandingPage /></PageWrap></AppShell>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
