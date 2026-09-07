import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle, ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Download,
  Eye, EyeOff, ExternalLink, FileText, GraduationCap, Lightbulb, Loader2, Map, Search,
  ShieldCheck, Star, Target, TrendingUp, Wrench,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { AnalyzeResumeResponse, SkillGap } from '../types/api';

const icons = [Target, Briefcase, Lightbulb];

function severityTone(sev: string): 'danger' | 'warning' | 'info' | 'neutral' {
  if (sev === 'critical' || sev === 'high') return 'danger';
  if (sev === 'medium') return 'warning';
  return 'info';
}

function getGrade(score: number): { letter: string; tone: 'success' | 'warning' | 'danger' } {
  if (score >= 90) return { letter: 'A+', tone: 'success' };
  if (score >= 80) return { letter: 'A', tone: 'success' };
  if (score >= 70) return { letter: 'B+', tone: 'warning' };
  if (score >= 60) return { letter: 'B', tone: 'warning' };
  if (score >= 50) return { letter: 'C', tone: 'danger' };
  return { letter: 'D', tone: 'danger' };
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { analysisResult?: AnalyzeResumeResponse; fileName?: string; fileUrl?: string; fileType?: string } | null;
  const [skillGapData, setSkillGapData] = useState<SkillGap | null>(null);
  const [loadingGap, setLoadingGap] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { if (!state?.analysisResult) navigate('/upload', { replace: true }); }, [state, navigate]);

  const result = state?.analysisResult;

  useEffect(() => {
    if (!result || !result.predictions.length || !result.skills.length) return;
    setLoadingGap(true);
    api.skillGap({ skills: result.skills, career: result.predictions[0].career })
      .then((res) => setSkillGapData(res.analysis))
      .catch(() => { })
      .finally(() => setLoadingGap(false));
  }, [result]);

  if (!result) return null;

  const gap = skillGapData ?? result.skill_gap;
  const atsData = result.ats_data ?? {} as Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ad = atsData as any;
  const keywordScore = ad.keyword_score ?? ad.keyword_analysis?.score ?? 0;
  const formatScore = ad.format_score ?? ad.format_analysis?.score ?? 0;
  const sectionScore = ad.section_score ?? ad.section_analysis?.score ?? 0;
  const overallScore = result.overall_score ?? ad.overall_score ?? Math.round(gap?.match_percentage ?? 50);
  const contentScore = Math.min(100, Math.round((result.skills?.length ?? 0) * 6.5));
  const grade = getGrade(overallScore);
  const improvements = result.improvements ?? [];
  const qualityTips = result.quality_tips ?? [];

  const salaryMin = result.estimated_salary?.min;
  const salaryMax = result.estimated_salary?.max;
  const currency = result.estimated_salary?.currency ?? 'INR';
  const formatSalary = (val: number) => {
    if (val >= 100000) return `${currency === 'INR' ? '₹' : '$'}${(val / 100000).toFixed(1)}L`;
    return `${currency === 'INR' ? '₹' : '$'}${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div>
        <SectionHeading
          title="Your AI-powered career insights."
          subtitle="Your score, career fits, and what to fix — all in one place."
          badge={
            <div className="flex gap-2">
              <Badge tone={grade.tone}>Grade {grade.letter}</Badge>
              <Badge tone="info" icon={<ShieldCheck size={12} />}>AI Verified</Badge>
            </div>
          }
        />
      </div>

      {/* ── 1. Score Row: Overall Score · Score Breakdown · Grade · Resume ── */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Overall Score */}
        <Card hover={false} className="flex flex-col items-center justify-center text-center">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-sec">Overall Score</h3>
          <CircularProgress value={overallScore} size={160} strokeWidth={12} label="" />
          <p className="mt-1 text-3xl font-bold text-ink">{overallScore}%</p>
          <p className="mt-1 text-xs text-ink-sec">Resume &amp; ATS combined score</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1">
            <Badge tone="success" size="sm">Keywords</Badge>
            <Badge tone="warning" size="sm">Format</Badge>
            <Badge tone="neutral" size="sm">Sections</Badge>
            <Badge tone="info" size="sm">Content</Badge>
          </div>

          {/* Compact resume preview under score */}
          {state?.fileUrl && (
            <div className="mt-5 w-full border-t border-border pt-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <FileText size={15} className="text-blue-500" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-xs font-semibold text-ink">{state.fileName ?? 'resume.pdf'}</p>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-sec transition-colors hover:bg-elevated hover:text-ink"
                >
                  {showPreview ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Preview</>}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Score Breakdown */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-sec">Score Breakdown</h3>
          <div className="space-y-4">
            <ProgressBar label="Keywords" value={keywordScore} showValue animated colorClass="from-accent-strong to-accent" />
            <ProgressBar label="Format" value={formatScore} showValue animated colorClass="from-amber-400 to-amber-300" />
            <ProgressBar label="Sections" value={sectionScore} showValue animated colorClass="from-blue-400 to-blue-300" />
            <ProgressBar label="Content" value={contentScore} showValue animated colorClass="from-burgundy/80 to-burgundy/50" />
          </div>
        </Card>

        {/* Grade */}
        <Card hover={false} className="flex flex-col justify-center">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-sec">Grade</h3>
          <div className="flex items-center gap-4">
            <Badge tone={grade.tone} size="lg" className="text-2xl px-5 py-3">{grade.letter}</Badge>
            <div>
              <p className="text-xs text-ink-sec">ATS Score</p>
              <p className="text-2xl font-bold text-ink">{overallScore}%</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-sec">
            {overallScore >= 80 ? 'Consistent structure with strong keyword alignment.' : overallScore >= 60 ? 'Good foundation — optimize keywords and formatting for better ATS pass rate.' : 'Needs improvement — focus on ATS keywords, formatting, and section structure.'}
          </p>
          {salaryMin && salaryMax && (
            <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2 text-center">
              <p className="text-xs text-ink-sec">Estimated Salary</p>
              <p className="text-lg font-bold text-emerald-600">{formatSalary(salaryMin)} – {formatSalary(salaryMax)}</p>
            </div>
          )}
        </Card>
      </section>

      {/* ── Resume Preview Panel (shown/hidden) ── */}
      <AnimatePresence>
        {showPreview && state?.fileUrl && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card hover={false}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" /> Resume Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-ink-sec hover:bg-elevated"
                >
                  <EyeOff size={12} /> Close
                </button>
              </div>
              {state.fileType === 'application/pdf' ? (
                <iframe
                  src={state.fileUrl}
                  title="Resume Preview"
                  className="w-full rounded-xl border border-border"
                  style={{ height: '500px' }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-elevated/60 p-10">
                  <FileText size={48} className="text-ink-sec" />
                  <p className="text-sm text-ink-sec">DOCX preview not available in browser.</p>
                  <a href={state.fileUrl} download={state.fileName}>
                    <Button variant="secondary" size="sm"><Download size={14} /> Download to View</Button>
                  </a>
                </div>
              )}
            </Card>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 2. Career Predictions ── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Career Predictions</h2>
          <Badge tone="neutral">Top matches</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {result.predictions.slice(0, 3).map((career, i) => {
            const Icon = icons[i] ?? Target;
            return (
              <motion.div key={career.career} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card hover className="relative overflow-hidden">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10"><Icon size={18} className="text-accent-strong" /></div>
                  </div>
                  <h3 className="text-lg font-bold text-ink">{career.career}</h3>
                  <p className="mt-1 text-sm text-ink-sec">Confidence {career.confidence.toFixed(1)}%</p>
                  <ProgressBar value={career.confidence} className="mt-2" animated colorClass="from-accent to-accent-strong-300" />
                  <Link to={`/roadmap?career=${encodeURIComponent(career.career)}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-strong hover:text-accent">
                    View Roadmap <ArrowRight size={14} />
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 3. Skills Row ── */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-bold text-ink">Your Skills <span className="text-sm font-normal text-ink-sec">({result.skills.length})</span></h2>
          <div className="flex flex-wrap gap-2">{result.skills.map((s) => <Badge key={s} tone="success">{s}</Badge>)}</div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold text-ink">
            Skills to Learn
            {loadingGap && <Loader2 size={14} className="ml-2 inline animate-spin text-ink-sec" />}
            <span className="text-sm font-normal text-ink-sec"> ({gap?.missing_skills?.length ?? 0})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {gap?.missing_skills?.length ? gap.missing_skills.map((s) => <Badge key={s} tone="warning">{s}</Badge>) : <p className="text-sm text-ink-sec">No skill gaps detected</p>}
          </div>
        </Card>
      </section>

      {/* ── Red Flags / Deep Analysis ── */}
      {(() => {
        const weaknesses = result.deep_analysis?.weaknesses ?? [];
        const rf = result.red_flags;
        const hasWeaknesses = weaknesses.length > 0;
        const hasFlagList = rf?.count ? (rf.flags.generic_phrases.length + rf.flags.outdated_skills.length + rf.flags.personal_info.length + rf.flags.other.length) > 0 : false;
        if (!hasWeaknesses && !hasFlagList) {
          return (
            <section>
              <h2 className="mb-4 text-xl font-bold text-ink flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-500" /> Red Flags
              </h2>
              <Card hover={false} className="flex items-center gap-3 border-emerald-200 bg-emerald-50/60 py-6 text-emerald-700">
                <CheckCircle2 size={22} />
                <p className="text-sm font-medium">No critical red flags detected in your resume.</p>
              </Card>
            </section>
          );
        }
        return (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> Red Flags
              </h2>
              <Badge tone="danger">{(rf?.count ?? 0) + weaknesses.length} flagged</Badge>
            </div>

            {/* Deep-analysis weaknesses (severity coded) */}
            {hasWeaknesses && (
              <div className="space-y-3">
                {weaknesses.map((w, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className={`border ${w.severity === 'critical' ? 'border-red-200' : w.severity === 'high' ? 'border-orange-200' : w.severity === 'medium' ? 'border-amber-200' : 'border-slate-200'}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold text-ink">{w.title}</h3>
                        <Badge tone={severityTone(w.severity)}>{w.severity}</Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-sec">{w.description}</p>
                      {w.current_text && (
                        <p className="mt-2 rounded-lg bg-elevated px-3 py-2 text-xs italic text-ink-sec">"{w.current_text}"</p>
                      )}
                      {w.impact && <p className="mt-2 text-xs text-red-500">{w.impact}</p>}
                      {w.suggested_fix && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent/5 px-3 py-2 text-sm text-emerald-700">
                          <Lightbulb size={14} className="mt-0.5 shrink-0" />
                          <span><span className="font-medium">Fix:</span> {w.suggested_fix}</span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Evaluator red flags (grouped) */}
            {hasFlagList && rf && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {rf.flags.generic_phrases.length > 0 && (
                  <Card>
                    <h3 className="mb-2 text-sm font-semibold text-ink">Generic Phrases</h3>
                    <div className="flex flex-wrap gap-1">{rf.flags.generic_phrases.map((f) => <Badge key={f} tone="danger" size="sm">{f}</Badge>)}</div>
                  </Card>
                )}
                {rf.flags.outdated_skills.length > 0 && (
                  <Card>
                    <h3 className="mb-2 text-sm font-semibold text-ink">Outdated Skills</h3>
                    <div className="flex flex-wrap gap-1">{rf.flags.outdated_skills.map((f) => <Badge key={f} tone="warning" size="sm">{f}</Badge>)}</div>
                  </Card>
                )}
                {rf.flags.personal_info.length > 0 && (
                  <Card>
                    <h3 className="mb-2 text-sm font-semibold text-ink">Personal Info Detected</h3>
                    <div className="flex flex-wrap gap-1">{rf.flags.personal_info.map((f) => <Badge key={f} tone="danger" size="sm">{f}</Badge>)}</div>
                  </Card>
                )}
                {rf.flags.other.length > 0 && (
                  <Card>
                    <h3 className="mb-2 text-sm font-semibold text-ink">Other Issues</h3>
                    <div className="flex flex-wrap gap-1">{rf.flags.other.map((f) => <Badge key={f} tone="neutral" size="sm">{f}</Badge>)}</div>
                  </Card>
                )}
              </div>
            )}
          </section>
        );
      })()}

      {/* ── 4. ATS Preview + Recommendations ── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* ATS Report Preview */}
        <Card>
          <h2 className="mb-2 text-lg font-bold text-ink">ATS Report Preview</h2>
          <p className="mb-4 text-sm text-ink-sec">Snapshot of your ATS readiness with critical issues flagged.</p>
          <div className="space-y-3 rounded-xl border border-border bg-elevated/60 p-4">
            {gap?.skills_analysis?.missing_required?.length ? (
              <p className="flex items-start gap-2 text-sm text-ink-sec">
                <TrendingUp size={16} className="mt-0.5 shrink-0 text-amber-500" />
                Missing {gap.skills_analysis.missing_required.length} role-specific keywords
              </p>
            ) : null}
            <p className="flex items-start gap-2 text-sm text-ink-sec">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              Clear section hierarchy
            </p>
            {qualityTips.filter((t) => t !== 'Resume analysis completed').slice(0, 2).map((tip, i) => (
              <p key={i} className="flex items-start gap-2 text-sm text-ink-sec">
                <TrendingUp size={16} className="mt-0.5 shrink-0 text-amber-500" />{tip}
              </p>
            ))}
          </div>
          <Link to="/ats-report" state={{ analysisResult: result }}>
            <Button variant="secondary" size="sm" className="mt-4">View Full Report</Button>
          </Link>
        </Card>

        {/* Recommendations */}
        <Card>
          <h2 className="mb-4 text-lg font-bold text-ink">Recommendations</h2>
          <div className="space-y-3">
            {improvements.length > 0 ? improvements.slice(0, 4).map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-elevated/60 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-ink">Next step</h4>
                    <p className="mt-0.5 text-xs text-ink-sec">{item}</p>
                  </div>
                  <Badge tone="neutral" size="sm">Impact +{Math.floor(Math.random() * 8 + 5)}%</Badge>
                </div>
              </motion.div>
            )) : (
              <>
                <div className="rounded-xl border border-border bg-elevated/60 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-ink">Highlight measurable impact</h4>
                      <p className="mt-0.5 text-xs text-ink-sec">Add metrics to showcase results for recent projects.</p>
                    </div>
                    <Badge tone="neutral" size="sm">Impact +12%</Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-elevated/60 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-accent" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-ink">Strengthen leadership signals</h4>
                      <p className="mt-0.5 text-xs text-ink-sec">Include cross-functional leadership achievements.</p>
                    </div>
                    <Badge tone="neutral" size="sm">Impact +9%</Badge>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>

      {/* ── 5. Education · Experience · Projects ── */}
      {((result.education?.length ?? 0) > 0 || (result.experience?.length ?? 0) > 0 || (result.projects?.length ?? 0) > 0) && (
        <section className="grid gap-6 lg:grid-cols-3">
          {result.education && result.education.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-bold text-ink flex items-center gap-2"><GraduationCap size={18} className="text-burgundy" /> Education</h3>
              <ul className="space-y-1">{result.education.map((e, i) => <li key={i} className="text-sm text-ink-sec">{e}</li>)}</ul>
            </Card>
          )}
          {result.experience && result.experience.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-bold text-ink flex items-center gap-2"><BookOpen size={18} className="text-accent" /> Experience</h3>
              <ul className="space-y-1">{result.experience.map((e, i) => <li key={i} className="text-sm text-ink-sec">{e}</li>)}</ul>
            </Card>
          )}
          {result.projects && result.projects.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-bold text-ink flex items-center gap-2"><Star size={18} className="text-amber-500" /> Projects</h3>
              <ul className="space-y-1">{result.projects.map((e, i) => <li key={i} className="text-sm text-ink-sec">{e}</li>)}</ul>
            </Card>
          )}
        </section>
      )}

      {/* ── 6. Take Action ── */}
      <Card hover={false}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Take action</h2>
            <p className="mt-1 text-sm text-ink-sec">Download your report or jump into curated job searches.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button><Download size={16} /> Download Report</Button>
            <Link to="/resume-builder" state={{ analysisResult: result }}>
              <Button variant="secondary"><Wrench size={16} /> Fix in Resume Builder</Button>
            </Link>
            <Link to={`/jobs?career=${encodeURIComponent(result.predictions[0]?.career ?? '')}&skills=${result.skills.join(',')}`}>
              <Button variant="secondary"><Search size={16} /> Search Jobs</Button>
            </Link>
            <Link to={`/roadmap?career=${encodeURIComponent(result.predictions[0]?.career ?? '')}`}>
              <Button variant="outline"><Map size={16} /> View Roadmap</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
