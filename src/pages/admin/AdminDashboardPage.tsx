import { motion } from 'framer-motion';
import { BarChart3, FileText, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const statCards = [
  { icon: Users, label: 'Total Users', value: '10,240', trend: '+12%', color: 'text-cyan' },
  { icon: FileText, label: 'Resumes Analyzed', value: '25,090', trend: '+18%', color: 'text-mint' },
  { icon: BarChart3, label: 'Avg Score', value: '78', trend: '+3%', color: 'text-violet' },
  { icon: MessageSquare, label: 'Feedback', value: '1,285', trend: '+8%', color: 'text-success' },
];

const pieData = [
  { name: 'A Grade', value: 42, color: '#6dba6a' },
  { name: 'B Grade', value: 35, color: '#f0a03c' },
  { name: 'C Grade', value: 23, color: '#e85d3a' },
];

const activity = [
  { text: 'New user registered', time: '2m ago', type: 'user' },
  { text: 'Backup completed successfully', time: '12m ago', type: 'system' },
  { text: 'Feedback submitted (5 stars)', time: '19m ago', type: 'feedback' },
  { text: 'Resume analyzed — Grade A', time: '31m ago', type: 'resume' },
  { text: 'System health check passed', time: '1h ago', type: 'system' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-parchment/5">
                    <Icon size={18} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <TrendingUp size={12} /> {stat.trend} this month
                </div>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* Chart + activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-bold">Score Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} strokeWidth={0}>
                  {pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1a16', border: '1px solid rgba(232, 224, 212, 0.08)', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name} ({d.value}%)
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-bold">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.text} className="flex items-center justify-between rounded-lg border border-parchment/[0.04] bg-parchment/[0.02] px-3 py-2.5 text-sm">
                <span>{a.text}</span>
                <Badge tone="neutral" size="sm">{a.time}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
