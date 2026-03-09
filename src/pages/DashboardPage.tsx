import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BarChart3, FileText, Loader2, Plus, Target, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { DashboardStatsResponse, ScoreTrendsResponse } from '../types/api';

export default function DashboardPage() {
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

  if (!hasData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-2xl bg-slate-50 p-8 border border-border">
          <FileText size={48} className="mx-auto text-mint" />
          <h2 className="mt-4 font-display text-2xl font-bold text-text">No Data Yet</h2>
          <p className="mt-2 max-w-md text-muted">Upload your first resume to see your dashboard come alive with scores, trends, and career insights.</p>
          <Link to="/upload" className="mt-6 inline-block">
            <Button><Plus size={16} /> Upload Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Your <span className="gradient-text">Dashboard</span></h1>
          <p className="mt-1 text-muted">Here's your career progress overview.</p>
        </div>
        <Link to="/upload">
          <Button size="md"><Plus size={16} /> Upload New Resume</Button>
        </Link>
      </section>

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
    </div>
  );
}
