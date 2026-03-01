import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, ExternalLink, MapPin, Search, TrendingUp, X, Zap } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { jobs } from '../data/mockData';

const insights = [
  { label: 'Open Positions', value: 2451, suffix: '+', color: 'text-cyan' },
  { label: 'Growth Rate', value: 22, suffix: '%', prefix: '+', color: 'text-success' },
  { label: 'Remote Friendly', value: 58, suffix: '%', color: 'text-violet' },
  { label: 'Avg Salary', value: 120, prefix: '$', suffix: 'k', color: 'text-mint' },
];

const hotSkills = ['Python', 'AWS', 'NLP', 'MLOps', 'LLMs', 'PyTorch', 'Docker'];
const topHiring = ['Google', 'Microsoft', 'Amazon', 'OpenAI', 'Atlassian', 'Meta'];

export default function JobsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeading title="Job Explorer" subtitle="Find roles that match your skills and career goals." badge={<Badge tone="info" icon={<Briefcase size={12} />}>AI-Matched</Badge>} />

      {/* Search */}
      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Input label="Job Title" placeholder="Machine Learning Engineer" icon={<Search size={16} />} />
          <Input label="Location" placeholder="Bengaluru" icon={<MapPin size={16} />} />
          <label className="flex items-end gap-2 pb-3 text-sm text-stone"><input type="checkbox" className="accent-amber" /> Remote only</label>
          <div className="flex items-end"><Button className="w-full"><Search size={16} /> Search</Button></div>
        </div>
      </Card>

      {/* Market insights */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">{item.label}</p>
              <AnimatedCounter end={item.value} prefix={item.prefix} suffix={item.suffix} className={`mt-1 font-display text-3xl font-semibold ${item.color}`} />
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Hot skills & hiring */}
      <Card>
        <h2 className="mb-3 text-lg font-bold">Hot Skills & Top Hiring Companies</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {hotSkills.map((s) => <Badge key={s} tone="info" icon={<Zap size={10} />}>{s}</Badge>)}
        </div>
        <p className="text-sm text-muted">Hiring now: {topHiring.join(', ')}</p>
      </Card>

      {/* Job listings */}
      <section className="space-y-4">
        {jobs.map((job, i) => (
          <motion.div key={job.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <Card hover>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-sm text-muted">{job.company} · {job.location} · {job.salary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={job.match >= 85 ? 'success' : job.match >= 70 ? 'warning' : 'danger'}>{job.match}% Match</Badge>
                  {job.remote && <Badge tone="violet">Remote</Badge>}
                  <Badge tone="neutral">{job.source}</Badge>
                </div>
              </div>

              <div className="mt-3 grid gap-1 text-sm">
                <p className="text-success">✓ Matching: {job.matchingSkills.join(', ')}</p>
                <p className="text-danger">✗ Missing: {job.missingSkills.join(', ')}</p>
              </div>

              <div className="mt-3">
                <ProgressBar value={job.match} height={4} colorClass={job.match >= 85 ? 'from-success to-mint' : 'from-warning to-cyan'} />
              </div>

              <div className="mt-4 flex gap-3">
                <Button size="sm"><ExternalLink size={14} /> Apply</Button>
                <Button variant="secondary" size="sm" onClick={() => { setSelectedJob(job); setOpenModal(true); }}>
                  <TrendingUp size={14} /> Check Fit
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {openModal && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpenModal(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
              <Card glow>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Job Fit Analysis</h3>
                  <button onClick={() => setOpenModal(false)} className="rounded-full p-1 hover:bg-parchment/10"><X size={18} /></button>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber/10 font-display text-2xl font-semibold text-amber">{selectedJob.match}%</div>
                  <div>
                    <p className="font-semibold">{selectedJob.title}</p>
                    <p className="text-sm text-muted">{selectedJob.company}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-success">Matching Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.matchingSkills.map((s) => <Badge key={s} tone="success" size="sm">{s}</Badge>)}</div>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-danger">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.missingSkills.map((s) => <Badge key={s} tone="danger" size="sm">{s}</Badge>)}</div>
                  </div>
                  <p className="rounded-xl bg-parchment/[0.03] p-3 text-stone">Upskill in <strong className="text-parchment">{selectedJob.missingSkills[0]}</strong> to improve fit by approximately +7 points.</p>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>Close</Button>
                  <Button size="sm"><ExternalLink size={14} /> Apply Now</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
