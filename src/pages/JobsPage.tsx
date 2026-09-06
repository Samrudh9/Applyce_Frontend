import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, BellRing, CheckCircle2, ExternalLink, Gauge, Loader2, MapPin, Search, TrendingUp, X, XCircle, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Job, JobInsights, JobMatchResponse } from '../types/api';

export default function JobsPage() {
  const { user } = useAuth();
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
  const [fitResult, setFitResult] = useState<JobMatchResponse | null>(null);
  const [fitLoading, setFitLoading] = useState(false);
  const [fitError, setFitError] = useState<string | null>(null);
  const [savingAlert, setSavingAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const openJobDetail = (job: Job) => {
    setSelectedJob(job);
    setFitResult(null);
    setFitError(null);
    setFitLoading(false);
    setAlertMsg(null);
    setOpenModal(true);
  };

  const saveJobAlert = async () => {
    if (!selectedJob) return;
    setSavingAlert(true);
    setAlertMsg(null);
    try {
      const existing = await api.jobAlertsList().catch(() => null);
      const career = selectedJob.title.toLowerCase();
      const loc = (selectedJob.location || 'India').toLowerCase();
      if (existing?.alerts.some((a) => a.career.toLowerCase() === career && a.location.toLowerCase() === loc)) {
        setAlertMsg('An alert for this role & location is already saved.');
        return;
      }
      await api.jobAlertCreate({
        career: selectedJob.title,
        location: selectedJob.location || 'India',
        min_match_score: 60,
        email: user?.email,
      });
      setAlertMsg('Alert saved — we will email you about new matches.');
    } catch (e) {
      setAlertMsg(e instanceof Error ? `Could not save alert: ${e.message}` : 'Could not save alert.');
    } finally {
      setSavingAlert(false);
    }
  };

  const checkJobFit = async () => {
    if (!selectedJob) return;
    setFitLoading(true);
    setFitError(null);
    setFitResult(null);
    try {
      const res = await api.jobMatch({
        job_description: selectedJob.description || '',
        required_skills: selectedJob.skills_required || [],
      });
      setFitResult(res);
    } catch (e) {
      setFitError(e instanceof Error ? e.message : 'Failed to check fit. Please try again.');
    } finally {
      setFitLoading(false);
    }
  };

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
          <label className="flex items-end gap-2 pb-3 text-sm text-ink-sec">
            <input type="checkbox" className="accent-accent h-4 w-4 rounded" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} /> Remote only
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
            { label: 'Open Positions', value: insights.total_jobs, color: 'text-accent-strong' },
            { label: 'Growth Rate', value: (insights.growth_rate ? (parseInt(insights.growth_rate) || 0) : null), suffix: '%', prefix: '+', color: 'text-emerald-600' },
            { label: 'Remote Friendly', value: insights.remote_percentage, suffix: '%', color: 'text-burgundy' },
            { label: 'Demand Level', value: 0, color: 'text-amber-600', textOverride: insights.demand_level },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-sec">{item.label}</p>
                {item.textOverride ? (
                  <p className={`mt-1 font-display text-2xl font-bold ${item.color}`}>{item.textOverride}</p>
                ) : item.value === null || item.value === undefined ? (
                  <p className="mt-1 font-display text-2xl font-bold text-ink-sec">—</p>
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
          <h2 className="mb-3 text-lg font-bold text-ink">Hot Skills & Top Hiring Companies</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {insights.hot_skills.map((s) => <Badge key={s} tone="info" icon={<Zap size={10} />}>{s}</Badge>)}
          </div>
          <p className="text-sm text-ink-sec">Hiring now: {insights.top_companies.join(', ')}</p>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      )}

      {!loading && searched && jobs.length === 0 && (
        <Card hover={false} className="py-12 text-center">
          <Briefcase size={40} className="mx-auto text-ink-sec" />
          <p className="mt-3 text-lg font-semibold text-ink">No jobs found</p>
          <p className="mt-1 text-sm text-ink-sec">Try adjusting your search terms or location.</p>
        </Card>
      )}

      {!loading && jobs.length > 0 && (
        <section className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-ink">{job.title}</h3>
                    <p className="text-sm text-ink-sec">
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
                  <ProgressBar value={job.match_score} height={4} colorClass={job.match_score >= 85 ? 'from-accent-strong to-accent' : 'from-accent-strong to-accent'} />
                </div>
                <div className="mt-4 flex gap-3">
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm"><ExternalLink size={14} /> Apply</Button>
                    </a>
                  )}
                  <Button variant="outline" size="sm" onClick={() => openJobDetail(job)}>
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl">
              <Card hover={false}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-ink">Job Details</h3>
                  <button onClick={() => setOpenModal(false)} className="rounded-full p-1 hover:bg-elevated"><X size={18} /></button>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 font-display text-2xl font-bold text-accent-strong">{selectedJob.match_score}%</div>
                  <div>
                    <p className="font-semibold text-ink">{selectedJob.title}</p>
                    <p className="text-sm text-ink-sec">{selectedJob.company} · {selectedJob.location}</p>
                  </div>
                </div>
                {selectedJob.description && (
                  <p className="mb-4 text-sm text-ink-sec leading-relaxed">{selectedJob.description.slice(0, 300)}{selectedJob.description.length > 300 ? '…' : ''}</p>
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

                <div className="mt-5 border-t border-line pt-5">
                  <Button className="w-full" variant="secondary" onClick={checkJobFit} disabled={fitLoading}>
                    {fitLoading ? <Loader2 size={16} className="animate-spin" /> : <Gauge size={16} />}
                    {fitLoading ? 'Analyzing fit…' : 'Check Job Fit vs Your Resume'}
                  </Button>

                  {fitError && (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                      {fitError.includes('resume') || fitError.includes('authenticated') ? (
                        <>
                          No resume found for this session.{' '}
                          <Link to="/upload" className="font-semibold underline">Upload your resume</Link> to see your fit score.
                        </>
                      ) : (
                        fitError
                      )}
                    </p>
                  )}

                  {fitResult && (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center gap-4 rounded-xl bg-accent/10 p-4">
                        <div className="text-center">
                          <AnimatedCounter end={Math.round(fitResult.match_percentage)} suffix="%" className="font-display text-3xl font-bold text-accent-strong" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-ink-sec">Fit Score</p>
                          <p className="text-sm font-medium text-ink">{fitResult.recommendation}</p>
                          <div className="mt-2">
                            <ProgressBar value={fitResult.match_percentage} height={4} colorClass={fitResult.match_percentage >= 60 ? 'from-accent-strong to-accent' : 'from-accent-strong to-accent'} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-sm">
                        <div className="rounded-lg bg-elevated p-3">
                          <p className="font-display text-xl font-bold text-burgundy">{fitResult.semantic_similarity?.toFixed(0) ?? 0}%</p>
                          <p className="text-xs text-ink-sec">Semantic Match</p>
                        </div>
                        <div className="rounded-lg bg-elevated p-3">
                          <p className="font-display text-xl font-bold text-ink">{fitResult.total_resume_skills}</p>
                          <p className="text-xs text-ink-sec">Skills on your Resume</p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-sec">Required Skills ({fitResult.required_matched.length}/{fitResult.total_required_skills})</p>
                        <div className="flex flex-wrap gap-1">
                          {fitResult.required_matched.map((s) => <Badge key={`r-${s}`} tone="success" size="sm" icon={<CheckCircle2 size={10} />}>{s}</Badge>)}
                          {fitResult.missing_required.map((s) => <Badge key={`m-${s}`} tone="danger" size="sm" icon={<XCircle size={10} />}>{s}</Badge>)}
                          {fitResult.total_required_skills === 0 && <span className="text-xs text-ink-sec">No required skills specified.</span>}
                        </div>
                      </div>

                      {fitResult.preferred_matched.length > 0 || fitResult.missing_preferred.length > 0 ? (
                        <div>
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-ink-sec">Preferred Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {fitResult.preferred_matched.map((s) => <Badge key={`p-${s}`} tone="neutral" size="sm" icon={<CheckCircle2 size={10} />}>{s}</Badge>)}
                            {fitResult.missing_preferred.map((s) => <Badge key={`pm-${s}`} tone="warning" size="sm" icon={<XCircle size={10} />}>{s}</Badge>)}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>Close</Button>
                  <Button variant="outline" size="sm" onClick={saveJobAlert} disabled={savingAlert}>
                    {savingAlert ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
                    {savingAlert ? 'Saving…' : 'Save as Job Alert'}
                  </Button>
                  {selectedJob.url && (
                    <a href={selectedJob.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm"><ExternalLink size={14} /> Apply Now</Button>
                    </a>
                  )}
                </div>
                {alertMsg && (
                  <p className={`mt-3 rounded-lg px-3 py-2 text-center text-sm ${alertMsg.startsWith('Could not') ? 'bg-red-50 text-red-600' : 'bg-accent/10 text-emerald-700'}`}>
                    {alertMsg}
                  </p>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
