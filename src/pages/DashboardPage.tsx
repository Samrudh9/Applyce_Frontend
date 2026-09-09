import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BarChart3, FileText, Github, LogOut, Plus, RotateCcw, Target, TrendingUp, Upload } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { DashboardStatsResponse, ScoreTrendsResponse } from '../types/api';

export default function DashboardPage() {
  const { user, login, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [trends, setTrends] = useState<ScoreTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [s, t] = await Promise.all([
      api.dashboardStats().catch(() => null),
      api.scoreTrends().catch(() => null),
    ]);
    if (s) setStats(s);
    if (t) setTrends(t);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const chartData = trends?.has_data
    ? trends.trends.dates.map((d, i) => ({
      date: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      resume: trends.trends.overall_scores[i],
      ats: trends.trends.ats_scores[i],
    }))
    : [];

  const summary = trends?.summary;

  /* Career health — a single glance at where you stand (from existing score trends). */
  const health = summary?.latest_score != null
    ? summary.latest_score >= 80
      ? { label: 'Strong', cls: 'bg-success/15 text-success' }
      : summary.latest_score >= 60
        ? { label: 'Progressing', cls: 'bg-warning/15 text-warning' }
        : { label: 'Needs work', cls: 'bg-danger/15 text-danger' }
    : null;

  const statCards = [
    { icon: FileText, label: 'Resume Score', value: summary?.latest_score?.toString() ?? '—', trend: summary ? `+${summary.total_improvement}` : '', color: 'text-accent-strong' },
    { icon: BarChart3, label: 'Total Scans', value: summary?.total_scans?.toString() ?? '0', trend: '', color: 'text-burgundy' },
    { icon: Target, label: 'Best Score', value: summary?.best_score?.toString() ?? '—', trend: '', color: 'text-success' },
    { icon: Award, label: 'Average Score', value: summary?.average_score?.toFixed(0) ?? '—', trend: '', color: 'text-warning' },
  ];

  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true" aria-label="Loading dashboard">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink p-6 md:p-8">
          <Skeleton className="h-6 w-48 mb-3" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} lines={2} />
          ))}
        </div>
        <SkeletonCard lines={5} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  const hasData = (stats && stats.total_resumes > 0) || (trends && trends.has_data);
  const loadError = !stats && !trends;

  return (
    <div className="space-y-8">
      {/* ── User Profile Header ── */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-ink p-6 text-canvas md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-burgundy/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-20 w-20 rounded-2xl border-2 border-canvas/10 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-canvas/10 text-3xl font-bold text-canvas">
                {user ? (user.username || 'U').slice(0, 2).toUpperCase() : '?'}
              </div>
            )}
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">
                {user ? `Welcome, ${user.username}` : 'Your Dashboard'}
              </h1>
              {user && (
                <p className="mt-1 text-sm text-canvas/50">{user.email}</p>
              )}
              {user && (
                <span className="mt-2 inline-block rounded-full bg-canvas/10 px-3 py-0.5 text-xs font-semibold text-canvas capitalize">
                  {user.account_type} Plan
                </span>
              )}
              {health && (
                <span className={`mt-2 ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${health.cls}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Career health: {health.label}
                  {(summary?.total_improvement ?? 0) > 0 && <span className="font-bold">↑{summary?.total_improvement}</span>}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!user && (
              <button
                onClick={login}
                className="flex items-center gap-2 rounded-xl border border-canvas/15 bg-canvas/10 px-4 py-2.5 text-sm font-medium text-canvas backdrop-blur-sm transition-colors hover:bg-canvas/20"
              >
                <Github size={16} /> Sign in with GitHub
              </button>
            )}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-canvas/15 bg-canvas/10 px-4 py-2.5 text-sm font-medium text-canvas/70 backdrop-blur-sm transition-colors hover:bg-danger/20 hover:text-danger"
              >
                <LogOut size={16} /> Sign out
              </button>
            )}
            <Link to="/upload">
              <button className="flex items-center gap-2 rounded-xl bg-canvas px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-canvas/85">
                <Plus size={16} /> Upload Resume
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Error state ── */}
      {loadError && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-danger/25 bg-danger/5 py-14 text-center">
          <BarChart3 size={40} className="text-ink-ter" />
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Couldn&apos;t load your dashboard</h2>
            <p className="mt-1 max-w-md text-sm text-ink-sec">
              We couldn&apos;t reach the score service. Check your connection and try again.
            </p>
          </div>
          <Button variant="outline" onClick={loadAll}>
            <RotateCcw size={16} /> Try again
          </Button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!loadError && !hasData && (
        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-line py-16 text-center">
          <div className="rounded-2xl bg-elevated p-6">
            <Upload size={48} className="text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">No Data Yet</h2>
          <p className="max-w-md text-ink-sec">Upload your first resume and we'll show your scores, trends, and next steps.</p>
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
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated">
                        <Icon size={20} className={stat.color} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ink-sec">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                    {stat.trend && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
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
                <h2 className="text-lg font-bold text-ink">Score Progress</h2>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Resume</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-burgundy" /> ATS</span>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="var(--line)" strokeDasharray="4 4" />
                    <XAxis dataKey="date" stroke="var(--ink-ter)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--ink-ter)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      itemStyle={{ color: 'var(--ink)' }}
                    />
                    <Line type="monotone" dataKey="resume" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ats" stroke="var(--burgundy)" strokeWidth={3} dot={{ r: 4, fill: 'var(--burgundy)' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* ── Score History Table ── */}
          {stats && stats.score_history.length > 0 && (
            <Card>
              <h2 className="mb-4 text-lg font-bold text-ink">Score History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-sec">
                      <th className="pb-3">Date</th><th className="pb-3">Score</th><th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.score_history.map((row) => (
                      <tr key={row.date} className="border-t border-line/50 transition-colors hover:bg-elevated/60">
                        <td className="py-3.5 text-ink-sec">{new Date(row.date).toLocaleDateString()}</td>
                        <td><Badge tone={row.score >= 80 ? 'success' : row.score >= 60 ? 'warning' : 'danger'}>{row.score}</Badge></td>
                        <td>
                          <Link to="/result"><button className="text-accent-strong hover:text-accent"><ArrowUpRight size={16} /></button></Link>
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
                    <span className="text-xs font-bold text-accent-strong">{entry.count}</span>
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-accent/30 to-accent/60"
                      style={{ height: `${Math.max(entry.count * 4, 8)}px` }}
                    />
                    <span className="text-[10px] text-ink-sec">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}</span>
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