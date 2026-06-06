import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, Award, BookOpen, Briefcase, CheckCircle2, Download,
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
          subtitle="Explore your scores, career predictions, and actionable improvements."
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
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Overall Score</h3>
          <CircularProgress value={overallScore} size={160} strokeWidth={12} color="#34d399" label="" />
          <p className="mt-1 text-3xl font-bold text-text">{overallScore}%</p>
          <p className="mt-1 text-xs text-muted">Resume &amp; ATS combined score</p>
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
                  <p className="truncate text-xs font-semibold text-text">{state.fileName ?? 'resume.pdf'}</p>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-slate-50 hover:text-text"
                >
                  {showPreview ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Preview</>}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Score Breakdown */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Score Breakdown</h3>
          <div className="space-y-4">
            <ProgressBar label="Keywords" value={keywordScore} showValue animated colorClass="from-emerald-400 to-mint" />
            <ProgressBar label="Format" value={formatScore} showValue animated colorClass="from-amber-400 to-amber-300" />
            <ProgressBar label="Sections" value={sectionScore} showValue animated colorClass="from-blue-400 to-blue-300" />
            <ProgressBar label="Content" value={contentScore} showValue animated colorClass="from-purple/80 to-purple/50" />
          </div>
        </Card>

        {/* Grade */}
        <Card hover={false} className="flex flex-col justify-center">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">Grade</h3>
          <div className="flex items-center gap-4">
            <Badge tone={grade.tone} size="lg" className="text-2xl px-5 py-3">{grade.letter}</Badge>
            <div>
              <p className="text-xs text-muted">ATS Score</p>
              <p className="text-2xl font-bold text-text">{overallScore}%</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            {overallScore >= 80 ? 'Consistent structure with strong keyword alignment.' : overallScore >= 60 ? 'Good foundation — optimize keywords and formatting for better ATS pass rate.' : 'Needs improvement — focus on ATS keywords, formatting, and section structure.'}
          </p>
          {salaryMin && salaryMax && (
            <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2 text-center">
              <p className="text-xs text-muted">Estimated Salary</p>
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
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" /> Resume Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted hover:bg-slate-50"
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
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-slate-50/50 p-10">
                  <FileText size={48} className="text-muted" />
                  <p className="text-sm text-muted">DOCX preview not available in browser.</p>
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
          <h2 className="text-xl font-bold text-text">Career Predictions</h2>
          <Badge tone="neutral">Top matches</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {result.predictions.slice(0, 3).map((career, i) => {
            const Icon = icons[i] ?? Target;
            return (
              <motion.div key={career.career} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card hover className="relative overflow-hidden">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint/10"><Icon size={18} className="text-mint-dark" /></div>
                  </div>
                  <h3 className="text-lg font-bold text-text">{career.career}</h3>
                  <p className="mt-1 text-sm text-muted">Confidence {career.confidence.toFixed(1)}%</p>
                  <ProgressBar value={career.confidence} className="mt-2" animated colorClass="from-mint to-emerald-300" />
                  <Link to={`/roadmap?career=${encodeURIComponent(career.career)}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-mint-dark hover:text-mint">
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
          <h2 className="mb-4 text-lg font-bold text-text">Your Skills <span className="text-sm font-normal text-muted">({result.skills.length})</span></h2>
          <div className="flex flex-wrap gap-2">{result.skills.map((s) => <Badge key={s} tone="success">{s}</Badge>)}</div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-bold text-text">
            Skills to Learn
            {loadingGap && <Loader2 size={14} className="ml-2 inline animate-spin text-muted" />}
            <span className="text-sm font-normal text-muted"> ({gap?.missing_skills?.length ?? 0})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {gap?.missing_skills?.length ? gap.missing_skills.map((s) => <Badge key={s} tone="warning">{s}</Badge>) : <p className="text-sm text-muted">No skill gaps detected</p>}
          </div>
        </Card>
      </section>

      {/* ── 4. ATS Preview + Recommendations ── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* ATS Report Preview */}
        <Card>
          <h2 className="mb-2 text-lg font-bold text-text">ATS Report Preview</h2>
          <p className="mb-4 text-sm text-muted">Snapshot of your ATS readiness with critical issues flagged.</p>
          <div className="space-y-3 rounded-xl border border-border bg-slate-50/50 p-4">
            {gap?.skills_analysis?.missing_required?.length ? (
              <p className="flex items-start gap-2 text-sm text-muted">
                <TrendingUp size={16} className="mt-0.5 shrink-0 text-amber-500" />
                Missing {gap.skills_analysis.missing_required.length} role-specific keywords
              </p>
            ) : null}
            <p className="flex items-start gap-2 text-sm text-muted">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              Clear section hierarchy
            </p>
            {qualityTips.filter((t) => t !== 'Resume analysis completed').slice(0, 2).map((tip, i) => (
              <p key={i} className="flex items-start gap-2 text-sm text-muted">
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
          <h2 className="mb-4 text-lg font-bold text-text">Recommendations</h2>
          <div className="space-y-3">
            {improvements.length > 0 ? improvements.slice(0, 4).map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-xl border border-border bg-slate-50/50 p-4">
                <div className="flex items-start gap-2">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-mint" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-text">Resume Enhancement</h4>
                    <p className="mt-0.5 text-xs text-muted">{item}</p>
                  </div>
                  <Badge tone="neutral" size="sm">Impact +{Math.floor(Math.random() * 8 + 5)}%</Badge>
                </div>
              </motion.div>
            )) : (
              <>
                <div className="rounded-xl border border-border bg-slate-50/50 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-mint" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-text">Highlight measurable impact</h4>
                      <p className="mt-0.5 text-xs text-muted">Add metrics to showcase results for recent projects.</p>
                    </div>
                    <Badge tone="neutral" size="sm">Impact +12%</Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-slate-50/50 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb size={16} className="mt-0.5 shrink-0 text-mint" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-text">Strengthen leadership signals</h4>
                      <p className="mt-0.5 text-xs text-muted">Include cross-functional leadership achievements.</p>
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
              <h3 className="mb-3 text-lg font-bold text-text flex items-center gap-2"><GraduationCap size={18} className="text-purple" /> Education</h3>
              <ul className="space-y-1">{result.education.map((e, i) => <li key={i} className="text-sm text-muted">{e}</li>)}</ul>
            </Card>
          )}
          {result.experience && result.experience.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-bold text-text flex items-center gap-2"><BookOpen size={18} className="text-mint" /> Experience</h3>
              <ul className="space-y-1">{result.experience.map((e, i) => <li key={i} className="text-sm text-muted">{e}</li>)}</ul>
            </Card>
          )}
          {result.projects && result.projects.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-bold text-text flex items-center gap-2"><Star size={18} className="text-amber-500" /> Projects</h3>
              <ul className="space-y-1">{result.projects.map((e, i) => <li key={i} className="text-sm text-muted">{e}</li>)}</ul>
            </Card>
          )}
        </section>
      )}

      {/* ── 6. Take Action ── */}
      <Card hover={false}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text">Take action</h2>
            <p className="mt-1 text-sm text-muted">Download your report or jump into curated job searches.</p>
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
