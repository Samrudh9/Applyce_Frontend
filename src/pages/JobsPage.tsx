import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, ExternalLink, Loader2, MapPin, Search, TrendingUp, X, Zap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { Job, JobInsights } from '../types/api';

export default function JobsPage() {
  const [searchParams] = useSearchParams();
  const [career, setCareer] = useState(searchParams.get('career') ?? '');
  const [location, setLocation] = useState('India');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const userSkills = searchParams.get('skills') ?? '';
  const [jobs, setJobs] = useState<Job[]>([]);
  const [insights, setInsights] = useState<JobInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => { if (career) handleSearch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (!career.trim()) return;
    setLoading(true); setSearched(true);
    try {
      const [jobRes, insightRes] = await Promise.all([
        api.jobSearch({ career: career.trim(), location: location.trim() || 'India', skills: userSkills, limit: 20, remote: remoteOnly ? 'true' : 'false' }).catch(() => null),
        api.jobInsights(career.trim(), location.trim() || 'India').catch(() => null),
      ]);
      if (jobRes) setJobs(jobRes.jobs);
      if (insightRes) setInsights(insightRes.insights);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      <SectionHeading title="Job Explorer" subtitle="Find roles that match your skills and career goals." badge={<Badge tone="info" icon={<Briefcase size={12} />}>AI-Matched</Badge>} />

      <Card>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="grid gap-4 md:grid-cols-4">
          <Input label="Job Title / Career" placeholder="Machine Learning Engineer" icon={<Search size={16} />} value={career} onChange={(e) => setCareer(e.target.value)} />
          <Input label="Location" placeholder="Bengaluru" icon={<MapPin size={16} />} value={location} onChange={(e) => setLocation(e.target.value)} />
          <label className="flex items-end gap-2 pb-3 text-sm text-muted">
            <input type="checkbox" className="accent-mint h-4 w-4 rounded" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} /> Remote only
          </label>
          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Search
            </Button>
          </div>
        </form>
      </Card>

      {insights && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Open Positions', value: insights.total_jobs, color: 'text-mint-dark' },
            { label: 'Growth Rate', value: parseInt(insights.growth_rate) || 0, suffix: '%', prefix: '+', color: 'text-emerald-600' },
            { label: 'Remote Friendly', value: insights.remote_percentage, suffix: '%', color: 'text-purple' },
            { label: 'Demand Level', value: 0, color: 'text-amber-600', textOverride: insights.demand_level },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{item.label}</p>
                {item.textOverride ? (
                  <p className={`mt-1 font-display text-2xl font-bold ${item.color}`}>{item.textOverride}</p>
                ) : (
                  <AnimatedCounter end={item.value} prefix={item.prefix} suffix={item.suffix} className={`mt-1 font-display text-3xl font-bold ${item.color}`} />
                )}
              </Card>
            </motion.div>
          ))}
        </section>
      )}

      {insights && (
        <Card>
          <h2 className="mb-3 text-lg font-bold text-text">Hot Skills & Top Hiring Companies</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {insights.hot_skills.map((s) => <Badge key={s} tone="info" icon={<Zap size={10} />}>{s}</Badge>)}
          </div>
          <p className="text-sm text-muted">Hiring now: {insights.top_companies.join(', ')}</p>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-mint" size={40} />
        </div>
      )}

      {!loading && searched && jobs.length === 0 && (
        <Card hover={false} className="py-12 text-center">
          <Briefcase size={40} className="mx-auto text-muted" />
          <p className="mt-3 text-lg font-semibold text-text">No jobs found</p>
          <p className="mt-1 text-sm text-muted">Try adjusting your search terms or location.</p>
        </Card>
      )}

      {!loading && jobs.length > 0 && (
        <section className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-text">{job.title}</h3>
                    <p className="text-sm text-muted">
                      {job.company} · {job.location}
                      {job.salary_min > 0 && ` · ${job.salary_currency} ${(job.salary_min / 100000).toFixed(1)}L – ${(job.salary_max / 100000).toFixed(1)}L`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={job.match_score >= 85 ? 'success' : job.match_score >= 70 ? 'warning' : 'danger'}>{job.match_score}% Match</Badge>
                    {job.is_remote && <Badge tone="violet">Remote</Badge>}
                    <Badge tone="neutral">{job.source}</Badge>
                  </div>
                </div>
                <div className="mt-3 grid gap-1 text-sm">
                  {job.matching_skills.length > 0 && <p className="text-emerald-600">✓ Matching: {job.matching_skills.join(', ')}</p>}
                  {job.missing_skills.length > 0 && <p className="text-red-500">✗ Missing: {job.missing_skills.join(', ')}</p>}
                </div>
                <div className="mt-3">
                  <ProgressBar value={job.match_score} height={4} colorClass={job.match_score >= 85 ? 'from-emerald-400 to-mint' : 'from-amber-400 to-mint'} />
                </div>
                <div className="mt-4 flex gap-3">
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm"><ExternalLink size={14} /> Apply</Button>
                    </a>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { setSelectedJob(job); setOpenModal(true); }}>
                    <TrendingUp size={14} /> Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>
      )}

      <AnimatePresence>
        {openModal && selectedJob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4 backdrop-blur-sm" onClick={() => setOpenModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
              <Card hover={false}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-text">Job Details</h3>
                  <button onClick={() => setOpenModal(false)} className="rounded-full p-1 hover:bg-slate-100"><X size={18} /></button>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-mint/10 font-display text-2xl font-bold text-mint-dark">{selectedJob.match_score}%</div>
                  <div>
                    <p className="font-semibold text-text">{selectedJob.title}</p>
                    <p className="text-sm text-muted">{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                {selectedJob.description && (
                  <p className="mb-4 text-sm text-muted leading-relaxed">{selectedJob.description.slice(0, 300)}{selectedJob.description.length > 300 ? '…' : ''}</p>
                )}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium text-emerald-600">Matching Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.matching_skills.map((s) => <Badge key={s} tone="success" size="sm">{s}</Badge>)}</div>
                  </div>
                  <div>
                    <p className="mb-1 font-medium text-red-500">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.missing_skills.map((s) => <Badge key={s} tone="danger" size="sm">{s}</Badge>)}</div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>Close</Button>
                  {selectedJob.url && (
                    <a href={selectedJob.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm"><ExternalLink size={14} /> Apply Now</Button>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
