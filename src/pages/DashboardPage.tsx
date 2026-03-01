import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BarChart3, FileText, Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { resumeHistory, scoreHistory } from '../data/mockData';

const statCards = [
  { icon: FileText, label: 'Resume Score', value: '88', trend: '+6%', trendUp: true, color: 'text-cyan' },
  { icon: BarChart3, label: 'ATS Score', value: '86', trend: '+5%', trendUp: true, color: 'text-mint' },
  { icon: Target, label: 'Top Career Match', value: 'ML Engineer', trend: '92% fit', trendUp: true, color: 'text-violet' },
  { icon: Award, label: 'Best Grade', value: 'A', trend: 'Excellent', trendUp: true, color: 'text-success' },
];

const roadmapPhases = [
  { name: 'Foundation', value: 85, color: 'from-success to-mint' },
  { name: 'Intermediate', value: 62, color: 'from-cyan to-mint' },
  { name: 'Advanced', value: 35, color: 'from-violet to-cyan' },
  { name: 'Expert', value: 12, color: 'from-danger to-warning' },
];

const ownedSkills = ['Python', 'Flask', 'SQL', 'TensorFlow', 'Git', 'Communication'];
const missingSkills = ['MLOps', 'System Design', 'Kubernetes', 'Distributed Systems'];

const recommendations = [
  { text: 'Add quantifiable achievements (e.g., "Improved model accuracy by 15%")', impact: 9.2 },
  { text: 'Include missing ATS keywords: "MLOps", "Kubernetes", "CI/CD"', impact: 8.8 },
  { text: 'Rewrite professional summary to target ML Engineer roles', impact: 8.5 },
  { text: 'Add 2-3 relevant side projects with GitHub links', impact: 7.9 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Welcome back, <span className="gradient-text">Username</span>!</h1>
          <p className="mt-1 text-muted">Here's your career progress overview.</p>
        </div>
        <Link to="/upload">
          <Button size="md"><Plus size={16} /> Upload New Resume</Button>
        </Link>
      </section>

      {/* Stat cards */}
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
              <Card className="relative overflow-hidden">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-amber/5 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-parchment/5">
                    <Icon size={20} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-success">
                  <TrendingUp size={12} /> {stat.trend}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* Chart */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Score Progress</h2>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> Resume Score</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> ATS Score</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory}>
              <CartesianGrid stroke="rgba(232, 224, 212, 0.04)" />
              <XAxis dataKey="month" stroke="#7a7168" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#7a7168" fontSize={12} tickLine={false} axisLine={false} domain={[50, 100]} />
              <Tooltip
                contentStyle={{ background: '#1c1a16', border: '1px solid rgba(232, 224, 212, 0.08)', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#e8e0d4' }}
              />
              <Line type="monotone" dataKey="resume" stroke="#f0a03c" strokeWidth={3} dot={{ r: 4, fill: '#f0a03c' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="ats" stroke="#6dba6a" strokeWidth={3} dot={{ r: 4, fill: '#6dba6a' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Resume History */}
      <Card>
        <h2 className="mb-4 text-lg font-bold">Resume History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-parchment/[0.06] text-xs uppercase tracking-wider text-stone">
                <th className="pb-3">Date</th><th className="pb-3">Filename</th><th className="pb-3">Resume</th><th className="pb-3">ATS</th><th className="pb-3">Career Match</th><th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumeHistory.map((row) => (
                <tr key={row.file} className="table-row-hover border-t border-parchment/[0.04] transition-colors">
                  <td className="py-3.5 text-muted">{row.date}</td>
                  <td className="font-medium">{row.file}</td>
                  <td><Badge tone={row.resume >= 85 ? 'success' : row.resume >= 70 ? 'warning' : 'danger'}>{row.resume}</Badge></td>
                  <td><Badge tone={row.ats >= 85 ? 'success' : row.ats >= 70 ? 'warning' : 'danger'}>{row.ats}</Badge></td>
                  <td className="text-amber">{row.match}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to="/result"><button className="text-amber hover:text-gold"><ArrowUpRight size={16} /></button></Link>
                      <button className="text-muted hover:text-danger"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Two-column: Roadmap + Skills */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-5 text-lg font-bold">Career Roadmap Progress</h3>
          <div className="space-y-4">
            {roadmapPhases.map((phase) => (
              <ProgressBar key={phase.name} label={phase.name} value={phase.value} showValue colorClass={phase.color} />
            ))}
          </div>
          <Link to="/roadmap" className="mt-5 inline-block">
            <Button variant="secondary" size="sm">View Full Roadmap</Button>
          </Link>
        </Card>

        <Card>
          <h3 className="mb-5 text-lg font-bold">Skills Analysis</h3>
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Your Skills</p>
            <div className="flex flex-wrap gap-2">
              {ownedSkills.map((s) => <Badge key={s} tone="success">{s}</Badge>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Skills to Learn</p>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((s) => <Badge key={s} tone="warning">{s}</Badge>)}
            </div>
          </div>
        </Card>
      </section>

      {/* Recommendations */}
      <Card>
        <SectionHeading title="AI Recommendations" subtitle="Prioritized actions to improve your career readiness." className="mb-4" />
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.text} className="flex items-start justify-between gap-4 rounded-xl border border-parchment/[0.06] bg-parchment/[0.02] px-4 py-3">
              <p className="text-sm">{rec.text}</p>
              <Badge tone="info" className="shrink-0">Impact {rec.impact}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
