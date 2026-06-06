import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BarChart3, FileText, Github, Loader2, LogOut, Plus, Target, TrendingUp, Upload } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { DashboardStatsResponse, ScoreTrendsResponse } from '../types/api';

export default function DashboardPage() {
  const { user, login, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [trends, setTrends] = useState<ScoreTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.dashboardStats().catch(() => null),
      api.scoreTrends().catch(() => null),
    ]).then(([s, t]) => {
      if (s) setStats(s);
      if (t) setTrends(t);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = trends?.has_data
    ? trends.trends.dates.map((d, i) => ({
      date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      resume: trends.trends.overall_scores[i],
      ats: trends.trends.ats_scores[i],
    }))
    : [];

  const summary = trends?.summary;

  const statCards = [
    { icon: FileText, label: 'Resume Score', value: summary?.latest_score?.toString() ?? '—', trend: summary ? `+${summary.total_improvement}` : '', color: 'text-mint-dark' },
    { icon: BarChart3, label: 'Total Scans', value: summary?.total_scans?.toString() ?? '0', trend: '', color: 'text-purple' },
    { icon: Target, label: 'Best Score', value: summary?.best_score?.toString() ?? '—', trend: '', color: 'text-emerald-600' },
    { icon: Award, label: 'Average Score', value: summary?.average_score?.toFixed(0) ?? '—', trend: '', color: 'text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-mint" size={40} />
      </div>
    );
  }

  const hasData = (stats && stats.total_resumes > 0) || (trends && trends.has_data);

  return (
    <div className="space-y-8">
      {/* ── User Profile Header ── */}
      <section className="rounded-2xl border border-border bg-gradient-to-br from-[#0f1420] to-[#1a2235] p-6 text-white md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-20 w-20 rounded-2xl border-2 border-white/10 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-mint/20 text-3xl font-bold text-mint">
                {user ? (user.username || 'U').slice(0, 2).toUpperCase() : '?'}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">
                {user ? `Welcome, ${user.username}` : 'Your Dashboard'}
              </h1>
              {user && (
                <p className="mt-1 text-sm text-white/50">{user.email}</p>
              )}
              {user && (
                <span className="mt-2 inline-block rounded-full bg-mint/15 px-3 py-0.5 text-xs font-semibold text-mint capitalize">
                  {user.account_type} Plan
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!user && (
              <button
                onClick={login}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Github size={16} /> Sign in with GitHub
              </button>
            )}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-red-500/20 hover:text-red-300"
              >
                <LogOut size={16} /> Sign out
              </button>
            )}
            <Link to="/upload">
              <button className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-mint-dark">
                <Plus size={16} /> Upload Resume
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Empty state ── */}
      {!hasData && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="rounded-2xl bg-slate-50 p-6">
            <Upload size={48} className="text-mint" />
          </div>
          <h2 className="font-display text-2xl font-bold text-text">No Data Yet</h2>
          <p className="max-w-md text-muted">Upload your first resume to see your dashboard come alive with scores, trends, and career insights.</p>
          <Link to="/upload">
            <Button><Plus size={16} /> Upload Resume</Button>
          </Link>
        </div>
      )}

      {/* ── Stat Cards ── */}
      {hasData && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Card>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                        <Icon size={20} className={stat.color} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                    {stat.trend && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <TrendingUp size={12} /> {stat.trend}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </section>

          {/* ── Score Progress Chart ── */}
          {chartData.length > 0 && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text">Score Progress</h2>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mint" /> Resume</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-purple" /> ATS</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      itemStyle={{ color: '#1e293b' }}
                    />
                    <Line type="monotone" dataKey="resume" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ats" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* ── Score History Table ── */}
          {stats && stats.score_history.length > 0 && (
            <Card>
              <h2 className="mb-4 text-lg font-bold text-text">Score History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                      <th className="pb-3">Date</th><th className="pb-3">Score</th><th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.score_history.map((row) => (
                      <tr key={row.date} className="table-row-hover border-t border-border/50 transition-colors">
                        <td className="py-3.5 text-muted">{new Date(row.date).toLocaleDateString()}</td>
                        <td><Badge tone={row.score >= 80 ? 'success' : row.score >= 60 ? 'warning' : 'danger'}>{row.score}</Badge></td>
                        <td>
                          <Link to="/result"><button className="text-mint-dark hover:text-mint"><ArrowUpRight size={16} /></button></Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── Skills Growth ── */}
          {stats && stats.skills_over_time.length > 0 && (
            <Card>
              <SectionHeading title="Skills Growth" subtitle="Number of detected skills over time." className="mb-4" />
              <div className="flex items-end gap-2">
                {stats.skills_over_time.map((entry) => (
                  <div key={entry.date} className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-mint-dark">{entry.count}</span>
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-mint/30 to-mint/60"
                      style={{ height: `${Math.max(entry.count * 4, 8)}px` }}
                    />
                    <span className="text-[10px] text-muted">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
