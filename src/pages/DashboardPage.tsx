import { useCallback, useEffect, useState } from 'react';
import { ArrowUpRight, Award, BarChart3, FileText, Github, LogOut, Plus, RotateCcw, Target, TrendingUp, Upload } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { DashboardStatsResponse, ScoreTrendsResponse } from '../types/api';

export default function DashboardPage() {
  const { user, login, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [trends, setTrends] = useState<ScoreTrendsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [s, t] = await Promise.all([
        api.dashboardStats().catch(() => null),
        api.scoreTrends().catch(() => null),
      ]);
      if (s) setStats(s);
      if (t) setTrends(t);
      if (!s && !t) setLoadError(true);
    } catch {
      setLoadError(true);
    }
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

  const health = summary?.latest_score != null
    ? summary.latest_score >= 80
      ? { label: 'Strong', cls: 'bg-success/15 text-success' }
      : summary.latest_score >= 60
        ? { label: 'Progressing', cls: 'bg-warning/15 text-warning' }
        : { label: 'Needs work', cls: 'bg-danger/15 text-danger' }
    : null;

  const statCards = [
    { icon: FileText, label: 'Resume Score', value: summary?.latest_score?.toString() ?? '—', trend: summary ? `+${summary.total_improvement}` : '', color: 'text-accent-strong' },
    { icon: BarChart3, label: 'Total Scans', value: summary?.total_scans?.toString() ?? '—', trend: '', color: 'text-ink' },
    { icon: Target, label: 'Best Score', value: summary?.best_score?.toString() ?? '—', trend: '', color: 'text-success' },
    { icon: Award, label: 'Average Score', value: summary?.average_score?.toFixed(0) ?? '—', trend: '', color: 'text-warning' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading dashboard">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6">
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
          </div>
          <SkeletonCard lines={5} />
          <SkeletonCard lines={4} />
        </div>
      </div>
    );
  }

  const hasData = (stats && stats.total_resumes > 0) || (trends && trends.has_data);

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* ── Profile header ── */}
        <section className="rounded-xl border border-line bg-surface p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="h-16 w-16 rounded-xl border border-line object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent-strong">
                  {user ? (user.username || 'U').slice(0, 2).toUpperCase() : '?'}
                </div>
              )}
              <div>
                <h1 className="font-display text-xl font-bold sm:text-2xl">
                  {user ? `Welcome, ${user.username}` : 'Your Dashboard'}
                </h1>
                {user && <p className="mt-0.5 text-sm text-ink-sec">{user.email}</p>}
                {user && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-full bg-elevated px-2.5 py-0.5 text-[11px] font-semibold text-ink-sec capitalize">{user.account_type} Plan</span>
                    {health && (
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${health.cls}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Career health: {health.label}
                        {(summary?.total_improvement ?? 0) > 0 && <span className="font-bold">↑{summary?.total_improvement}</span>}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!user && (
                <Button variant="outline" size="sm" onClick={login}>
                  <Github size={14} /> Sign in with GitHub
                </Button>
              )}
              {user && (
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut size={14} /> Sign out
                </Button>
              )}
              <Link to="/upload">
                <Button size="sm"><Plus size={14} /> Upload Resume</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Error ── */}
        {loadError && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/25 bg-danger/5 py-12 text-center">
            <BarChart3 size={36} className="text-ink-ter" />
            <div>
              <p className="text-sm font-semibold text-ink">Couldn&apos;t load your dashboard</p>
              <p className="mt-1 max-w-md text-xs text-ink-sec">We couldn&apos;t reach the score service. Check your connection and try again.</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadAll}><RotateCcw size={14} /> Try again</Button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loadError && !hasData && (
          <div className="rounded-xl border border-dashed border-line px-4 py-14 text-center">
            <Upload size={36} className="mx-auto text-accent-strong" />
            <p className="mt-4 text-sm font-semibold text-ink">Ready for your first analysis?</p>
            <p className="mt-1 max-w-md text-xs text-ink-sec">Upload a resume and we&apos;ll show your scores, trends, and the next steps that move them.</p>
            <Link to="/upload">
              <Button size="sm" className="mt-4"><Plus size={14} /> Upload Resume</Button>
            </Link>
          </div>
        )}

        {/* ── Stat cards ── */}
        {hasData && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-line bg-surface px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated">
                        <Icon size={16} className={stat.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-ink-ter">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                    </div>
                    {stat.trend && (
                      <p className="mt-2 flex items-center gap-1 text-xs font-medium text-success">
                        <TrendingUp size={12} /> {stat.trend}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Score Progress Chart ── */}
            {chartData.length > 0 && (
              <Card hover={false}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-ink">Score Progress</h2>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Resume</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-strong" /> ATS</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="var(--line)" strokeDasharray="4 4" />
                      <XAxis dataKey="date" stroke="var(--ink-ter)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--ink-ter)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: 'var(--ink)' }}
                      />
                      <Line type="monotone" dataKey="resume" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="ats" stroke="var(--accent-strong)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-strong)' }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* ── Score History Table ── */}
            {stats && stats.score_history.length > 0 && (
              <Card hover={false}>
                <h2 className="mb-4 text-sm font-bold text-ink">Score History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-ter">
                        <th className="pb-2.5 font-semibold">Date</th><th className="pb-2.5 font-semibold">Score</th><th className="pb-2.5 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.score_history.map((row) => (
                        <tr key={row.date} className="border-t border-line/50 transition-colors hover:bg-elevated/60">
                          <td className="py-3 text-ink-sec">{new Date(row.date).toLocaleDateString()}</td>
                          <td><Badge tone={row.score >= 80 ? 'success' : row.score >= 60 ? 'warning' : 'danger'} size="sm">{row.score}</Badge></td>
                          <td>
                            <Link to="/result" className="text-accent-strong hover:text-accent"><ArrowUpRight size={15} /></Link>
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
              <Card hover={false}>
                <h2 className="mb-4 text-sm font-bold text-ink">Skills Growth</h2>
                <p className="mb-4 text-xs text-ink-sec">Detected skills per resume analysis.</p>
                <div className="flex items-end gap-2">
                  {stats.skills_over_time.map((entry) => (
                    <div key={entry.date} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-accent-strong">{entry.count}</span>
                      <div
                        className="w-10 rounded-t bg-accent/25"
                        style={{ height: `${Math.max(entry.count * 4, 8)}px` }}
                      />
                      <span className="text-[10px] text-ink-ter">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
