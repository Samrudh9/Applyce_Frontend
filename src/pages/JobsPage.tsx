import { useEffect, useState } from 'react';
import { Briefcase, BellRing, CheckCircle2, ExternalLink, Gauge, MapPin, RotateCcw, Search, TrendingUp, X, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
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
  const [searchError, setSearchError] = useState<string | null>(null);
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
        setAlertMsg('You already have an alert for this role and location.');
        return;
      }
      await api.jobAlertCreate({
        career: selectedJob.title,
        location: selectedJob.location || 'India',
        min_match_score: 60,
        email: user?.email,
      });
      setAlertMsg('Alert saved — we\'ll email you when new matches appear.');
    } catch (e) {
      setAlertMsg(e instanceof Error ? `We couldn't save that alert: ${e.message}` : 'We couldn\'t save that alert. Try again in a minute.');
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
      setFitError(e instanceof Error ? e.message : 'We couldn\'t score that fit. Try again.');
    } finally {
      setFitLoading(false);
    }
  };

  useEffect(() => { if (career) handleSearch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (!career.trim()) return;
    setLoading(true); setSearched(true); setSearchError(null);
    try {
      const [jobRes, insightRes] = await Promise.all([
        api.jobSearch({ career: career.trim(), location: location.trim() || 'India', skills: userSkills, limit: 20, remote: remoteOnly ? 'true' : 'false' }).catch(() => null),
        api.jobInsights(career.trim(), location.trim() || 'India').catch(() => null),
      ]);
      if (jobRes) setJobs(jobRes.jobs);
      if (insightRes) setInsights(insightRes.insights);
      if (!jobRes) setSearchError('We couldn\'t reach the job search. Check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="font-display text-display-md font-semibold tracking-tight text-ink">Job Explorer</h1>
          <p className="mt-1 text-sm text-ink-sec">Live jobs scored against your skills — shortlist in seconds.</p>
        </div>

        {/* ── Search form ── */}
        <Card hover={false}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="grid gap-4 md:grid-cols-4">
            <Input label="Job Title / Career" placeholder="Machine Learning Engineer" icon={<Search size={16} />} value={career} onChange={(e) => setCareer(e.target.value)} />
            <Input label="Location" placeholder="Bengaluru" icon={<MapPin size={16} />} value={location} onChange={(e) => setLocation(e.target.value)} />
            <label className="flex items-end gap-2 pb-3 text-sm text-ink-sec">
              <input type="checkbox" className="accent-accent h-4 w-4 rounded" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} /> Remote only
            </label>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Searching…' : <><Search size={16} /> Search Jobs</>}
              </Button>
            </div>
          </form>
        </Card>

        {/* ── Market Insights ── */}
        {insights && (
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Open Positions', value: insights.total_jobs },
              { label: 'Growth Rate', value: insights.growth_rate ? `+${parseInt(insights.growth_rate) || 0}%` : '—' },
              { label: 'Remote Friendly', value: insights.remote_percentage != null ? `${insights.remote_percentage}%` : '—' },
              { label: 'Demand Level', value: insights.demand_level ?? '—' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-line bg-surface px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-ter">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-ink">{item.value}</p>
              </div>
            ))}
          </section>
        )}

        {/* ── Hot Skills & Top Companies ── */}
        {insights && (
          <div className="rounded-xl border border-line bg-surface px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              {insights.hot_skills.length > 0 && (
                <span className="text-xs font-medium text-ink-sec">Hot skills: {insights.hot_skills.join(', ')}</span>
              )}
              {insights.top_companies.length > 0 && (
                <span className="text-xs text-ink-ter">· Hiring now: {insights.top_companies.join(', ')}</span>
              )}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="space-y-2" aria-busy="true" aria-label="Loading jobs">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {searchError && !loading && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3">
            <span className="text-sm text-danger">{searchError}</span>
            <Button size="sm" variant="danger" onClick={handleSearch}>
              <RotateCcw size={14} /> Retry
            </Button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && searched && !searchError && jobs.length === 0 && (
          <div className="rounded-xl border border-line bg-surface px-4 py-10 text-center">
            <Briefcase size={32} className="mx-auto text-ink-ter" />
            <p className="mt-3 text-sm font-semibold text-ink">No roles match that search yet</p>
            <p className="mt-1 text-xs text-ink-sec">Try a broader title, another city, or turn off Remote only.</p>
          </div>
        )}

        {/* ── Job results ── */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/20 hover:bg-accent/[0.02]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent-strong">
                  {job.company.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{job.title}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-sec">
                    <span className="truncate">{job.company}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-ink-ter" aria-hidden="true" />
                    <span className="flex shrink-0 items-center gap-0.5"><MapPin size={10} /> {job.location}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={job.match_score >= 85 ? 'success' : job.match_score >= 70 ? 'warning' : 'danger'} size="sm">{job.match_score}%</Badge>
                  <Badge tone="neutral" size="sm">{job.job_type || 'Full-time'}</Badge>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {job.url && (
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-ink-ter transition-colors hover:bg-elevated hover:text-accent-strong" aria-label={`Apply to ${job.title}`}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button onClick={() => openJobDetail(job)} className="rounded-lg p-1.5 text-ink-ter transition-colors hover:bg-elevated hover:text-accent-strong" aria-label={`View details for ${job.title}`}>
                    <TrendingUp size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Job Detail Modal ── */}
        {openModal && selectedJob && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOpenModal(false)}>
            <div onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">Job Details</h3>
                <button onClick={() => setOpenModal(false)} className="rounded-lg p-1 text-ink-ter hover:bg-elevated hover:text-ink"><X size={18} /></button>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl font-bold text-accent-strong">{selectedJob.match_score}%</div>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{selectedJob.title}</p>
                  <p className="text-sm text-ink-sec">{selectedJob.company} · {selectedJob.location}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Badge tone="neutral" size="sm">{selectedJob.job_type || 'Full-time'}</Badge>
                    <Badge tone="info" size="sm">{selectedJob.experience_level}</Badge>
                    <Badge tone="neutral" size="sm">{selectedJob.source}</Badge>
                  </div>
                </div>
              </div>

              {selectedJob.description && (
                <p className="mb-4 text-sm leading-relaxed text-ink-sec">{selectedJob.description.slice(0, 300)}{selectedJob.description.length > 300 ? '…' : ''}</p>
              )}

              <div className="space-y-3 text-sm">
                {selectedJob.matching_skills.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium text-success">Matching Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.matching_skills.map((s) => <Badge key={s} tone="success" size="sm">{s}</Badge>)}</div>
                  </div>
                )}
                {selectedJob.missing_skills.length > 0 && (
                  <div>
                    <p className="mb-1 font-medium text-danger">Missing Skills</p>
                    <div className="flex flex-wrap gap-1">{selectedJob.missing_skills.map((s) => <Badge key={s} tone="danger" size="sm">{s}</Badge>)}</div>
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-line pt-5">
                <Button className="w-full" variant="secondary" onClick={checkJobFit} disabled={fitLoading}>
                  <Gauge size={16} />
                  {fitLoading ? 'Scoring your fit…' : 'Check My Fit'}
                </Button>

                {fitError && (
                  <p className="mt-3 rounded-lg bg-danger/10 p-3 text-center text-sm text-danger">
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
                    <div className="flex items-center gap-4 rounded-xl bg-accent/[0.06] p-4">
                      <div className="text-center">
                        <p className="font-display text-3xl font-bold text-accent-strong">{Math.round(fitResult.match_percentage)}%</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-sec">Fit Score</p>
                        <p className="text-sm font-medium text-ink">{fitResult.recommendation}</p>
                        <div className="mt-2">
                          <ProgressBar value={fitResult.match_percentage} height={4} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-sm">
                      <div className="rounded-lg bg-elevated p-3">
                        <p className="text-xl font-bold text-accent-strong">{fitResult.semantic_similarity?.toFixed(0) ?? 0}%</p>
                        <p className="text-xs text-ink-sec">Semantic Match</p>
                      </div>
                      <div className="rounded-lg bg-elevated p-3">
                        <p className="text-xl font-bold text-ink">{fitResult.total_resume_skills}</p>
                        <p className="text-xs text-ink-sec">Skills on your Resume</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-sec">Required Skills ({fitResult.required_matched.length}/{fitResult.total_required_skills})</p>
                      <div className="flex flex-wrap gap-1">
                        {fitResult.required_matched.map((s) => <Badge key={`r-${s}`} tone="success" size="sm" icon={<CheckCircle2 size={10} />}>{s}</Badge>)}
                        {fitResult.missing_required.map((s) => <Badge key={`m-${s}`} tone="danger" size="sm" icon={<XCircle size={10} />}>{s}</Badge>)}
                        {fitResult.total_required_skills === 0 && <span className="text-xs text-ink-sec">No required skills specified.</span>}
                      </div>
                    </div>

                    {(fitResult.preferred_matched.length > 0 || fitResult.missing_preferred.length > 0) && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-sec">Preferred Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {fitResult.preferred_matched.map((s) => <Badge key={`p-${s}`} tone="neutral" size="sm" icon={<CheckCircle2 size={10} />}>{s}</Badge>)}
                          {fitResult.missing_preferred.map((s) => <Badge key={`pm-${s}`} tone="warning" size="sm" icon={<XCircle size={10} />}>{s}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setOpenModal(false)}>Close</Button>
                <Button variant="outline" size="sm" onClick={saveJobAlert} disabled={savingAlert}>
                  {savingAlert ? 'Saving…' : <><BellRing size={14} /> Save as Job Alert</>}
                </Button>
                {selectedJob.url && (
                  <a href={selectedJob.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm"><ExternalLink size={14} /> Apply Now</Button>
                  </a>
                )}
              </div>

              {alertMsg && (
                <p className={`mt-3 rounded-lg px-3 py-2 text-center text-sm ${alertMsg.startsWith('Could not') || alertMsg.startsWith('We couldn') ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-success'}`}>
                  {alertMsg}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
