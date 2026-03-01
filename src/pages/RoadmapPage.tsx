import { motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle2, Circle, DollarSign, Map, TrendingUp, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';

const phases = [
  {
    title: 'Foundation',
    timeline: '0-3 months',
    progress: 85,
    skills: ['Python', 'Git', 'SQL', 'Statistics', 'Linear Algebra'],
    resources: ['Coursera ML Specialization', 'Python for Data Science (Udemy)', 'Git & GitHub Crash Course'],
    projects: ['Build a data pipeline', 'Create EDA notebook'],
    status: 'in-progress' as const,
  },
  {
    title: 'Intermediate',
    timeline: '3-6 months',
    progress: 62,
    skills: ['ML Models', 'REST APIs', 'Docker', 'Feature Engineering'],
    resources: ['Fast.ai Deep Learning', 'Flask REST API Tutorial', 'Docker Desktop Guide'],
    projects: ['Deploy ML model as API', 'Build image classifier'],
    status: 'in-progress' as const,
  },
  {
    title: 'Advanced',
    timeline: '6-12 months',
    progress: 35,
    skills: ['MLOps', 'System Design', 'Cloud (AWS/GCP)', 'Kubernetes'],
    resources: ['Designing ML Systems (Book)', 'AWS ML Certification', 'MLOps Zoomcamp'],
    projects: ['End-to-end ML pipeline on AWS', 'Real-time model monitoring'],
    status: 'not-started' as const,
  },
  {
    title: 'Expert',
    timeline: '12+ months',
    progress: 12,
    skills: ['Architecture', 'Leadership', 'Research Papers', 'Distributed Training'],
    resources: ['Papers with Code', 'Staff Engineer (Book)', 'System Design Interview'],
    projects: ['Contribute to open-source ML framework', 'Publish a technical blog series'],
    status: 'not-started' as const,
  },
];

const relatedCareers = ['Data Scientist', 'AI Engineer', 'ML Platform Engineer', 'Research Scientist'];

export default function RoadmapPage() {
  const overall = Math.round(phases.reduce((s, p) => s + p.progress, 0) / phases.length);

  return (
    <div className="space-y-8">
      <SectionHeading title="Machine Learning Engineer Roadmap" subtitle="Your personalized learning path from foundation to expert level." badge={<Badge tone="info" icon={<Map size={12} />}>AI-Generated</Badge>} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline */}
        <div className="relative space-y-0 lg:col-span-2">
          {/* Connecting line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-cyan/40 via-violet/20 to-transparent lg:block" />

          {phases.map((phase, i) => (
            <motion.div key={phase.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative pb-6">
              {/* Dot on timeline */}
              <div className="absolute left-[18px] top-6 z-10 hidden lg:block">
                {phase.progress >= 80
                  ? <CheckCircle2 size={16} className="text-success" />
                  : <Circle size={16} className="text-cyan/40" />}
              </div>

              <Card hover className="lg:ml-14">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold">{phase.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted"><Calendar size={12} /> {phase.timeline}</p>
                  </div>
                  <Badge tone={phase.progress >= 80 ? 'success' : phase.progress >= 50 ? 'warning' : 'neutral'}>{phase.progress}%</Badge>
                </div>

                <div className="mt-3">
                  <ProgressBar value={phase.progress} height={6} animated colorClass={phase.progress >= 80 ? 'from-success to-mint' : phase.progress >= 50 ? 'from-cyan to-mint' : 'from-violet to-cyan'} />
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.skills.map((s) => <Badge key={s} tone="info" size="sm">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Resources</p>
                    <ul className="space-y-0.5 text-muted">
                      {phase.resources.map((r) => <li key={r} className="flex items-center gap-1.5"><BookOpen size={12} className="text-cyan" /> {r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Projects</p>
                    <ul className="space-y-0.5 text-muted">
                      {phase.projects.map((p) => <li key={p} className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-mint" /> {p}</li>)}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card glow className="flex flex-col items-center text-center">
            <CircularProgress value={overall} size={120} strokeWidth={10} color="#f0a03c" label="Overall" />
            <p className="mt-3 text-sm text-muted">Keep going! You're on track.</p>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-bold"><TrendingUp size={16} className="text-cyan" /> Quick Stats</h3>
            <div className="space-y-2 text-sm text-muted">
              <p>Next milestone in <strong className="text-parchment">3 weeks</strong></p>
              <p>Completed skills: <strong className="text-success">12</strong></p>
              <p>Current streak: <strong className="text-cyan">14 days</strong></p>
            </div>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-bold"><Users size={16} className="text-violet" /> Related Careers</h3>
            <div className="flex flex-wrap gap-1.5">
              {relatedCareers.map((c) => <Badge key={c} tone="violet" size="sm">{c}</Badge>)}
            </div>
          </Card>

          <Card>
            <h3 className="mb-2 flex items-center gap-2 font-bold"><DollarSign size={16} className="text-success" /> Salary Range</h3>
            <p className="font-display text-3xl font-semibold text-success">$95k – $145k</p>
            <p className="mt-1 text-xs text-muted">Average for ML Engineers in the US</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
