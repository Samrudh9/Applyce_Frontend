import { motion } from 'framer-motion';
import { BarChart3, Database, LayoutDashboard, LogOut, MessageSquare, Shield, Sparkles, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/resumes', label: 'Resumes', icon: BarChart3 },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/admin/backup', label: 'Backup', icon: Database },
  { to: '/admin/system', label: 'System', icon: Shield },
];

export default function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-12 bg-ink text-parchment">
      {/* Sidebar */}
      <aside className="col-span-12 border-r border-parchment/[0.06] bg-surface p-5 md:col-span-3 lg:col-span-2">
        <div className="mb-8 flex items-center gap-2">
          <Sparkles size={20} className="text-amber" />
          <h1 className="font-display text-lg font-semibold">Applyce <span className="text-amber">Admin</span></h1>
        </div>
        <nav className="space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive ? 'bg-amber/15 text-amber shadow-sm shadow-amber/5' : 'text-stone hover:bg-parchment/[0.04] hover:text-parchment'}`
                }
              >
                <Icon size={16} /> {l.label}
              </NavLink>
            );
          })}
        </nav>
        <button className="mt-8 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="col-span-12 overflow-y-auto p-6 md:col-span-9 lg:col-span-10">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
