import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileWarning, Lightbulb, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import type { AnalyzeResumeResponse } from '../types/api';

export default function AtsReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { analysisResult?: AnalyzeResumeResponse } | null;
  const result = state?.analysisResult;

  useEffect(() => { if (!result) navigate('/upload', { replace: true }); }, [result, navigate]);
  if (!result) return null;

  const atsData = result.ats_data ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ad = atsData as any;
  const keywordScore = ad.keyword_score ?? ad.keyword_analysis?.score ?? 0;
  const formatScore = ad.format_score ?? ad.format_analysis?.score ?? 0;
  const sectionScore = ad.section_score ?? ad.section_analysis?.score ?? 0;
  const overallScore = result.overall_score ?? ad.overall_score ?? 0;
  const skills = result.skills ?? [];
  const qualityTips = result.quality_tips ?? [];
  const gap = result.skill_gap;
  const keywordFound = ad.keyword_analysis?.found ?? [];
  const keywordMissing = ad.keyword_analysis?.missing ?? [];
  const sectionDetails = ad.section_analysis?.sections ?? {};

  // Gather any extra breakdown entries from ats_data (excluding known keys)
  const knownKeys = new Set(['overall_score', 'keyword_score', 'format_score', 'section_score', 'keyword_analysis', 'format_analysis', 'section_analysis', 'status', 'predicted_career']);
  const extraEntries = Object.entries(atsData).filter(([k]) => !knownKeys.has(k));

  return (
    <div className="space-y-8">
      <SectionHeading
        title="ATS Compatibility Report"
        subtitle="Here's how hiring software reads your resume — and what's holding you back."
        badge={<Badge tone={overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'} icon={<ShieldCheck size={12} />}>Score {overallScore}</Badge>}
      />

      {/* Overall Score */}
      <Card hover={false} className="flex flex-col items-center text-center">
        <CircularProgress value={overallScore} size={170} strokeWidth={14} color={overallScore >= 80 ? 'rgb(var(--success))' : overallScore >= 60 ? 'rgb(var(--warning))' : 'rgb(var(--danger))'} label="ATS Score" />
        <p className="mt-3 max-w-md text-sm text-ink-sec">
          {overallScore >= 80 ? "Nice work — your resume is well-prepared for ATS filters." : overallScore >= 60 ? "Good foundation — a few tweaks and you're there." : "Don't worry — these are the quick wins that will get you through."}
        </p>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <h2 className="mb-5 text-lg font-bold text-ink">Score Breakdown</h2>
        <div className="space-y-4">
          <ProgressBar label="Keyword Match" value={keywordScore} showValue animated colorClass={keywordScore >= 80 ? 'from-accent-strong to-accent' : keywordScore >= 60 ? 'from-warning to-warning/70' : 'from-danger to-danger/70'} />
          <ProgressBar label="Format & Structure" value={formatScore} showValue animated colorClass={formatScore >= 80 ? 'from-accent-strong to-accent' : formatScore >= 60 ? 'from-warning to-warning/70' : 'from-danger to-danger/70'} />
          <ProgressBar label="Section Coverage" value={sectionScore} showValue animated colorClass={sectionScore >= 80 ? 'from-accent-strong to-accent' : sectionScore >= 60 ? 'from-warning to-warning/70' : 'from-danger to-danger/70'} />
        </div>
      </Card>

      {/* Keyword Analysis Detail */}
      {(keywordFound.length > 0 || keywordMissing.length > 0) && (
        <Card>
          <h3 className="mb-3 text-lg font-bold text-ink">Keyword Analysis</h3>
          {keywordFound.length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-success">Found ({keywordFound.length})</p>
              <div className="flex flex-wrap gap-1">{keywordFound.map((k: string) => <Badge key={k} tone="success" size="sm">{k}</Badge>)}</div>
            </div>
          )}
          {keywordMissing.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-danger">Missing ({keywordMissing.length})</p>
              <div className="flex flex-wrap gap-1">{keywordMissing.map((k: string) => <Badge key={k} tone="danger" size="sm">{k}</Badge>)}</div>
            </div>
          )}
        </Card>
      )}

      {/* Section Analysis Detail */}
      {Object.keys(sectionDetails).length > 0 && (
        <Card>
          <h3 className="mb-3 text-lg font-bold text-ink">Section Analysis</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(sectionDetails).map(([section, present]) => (
              <div key={section} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${present ? 'border-success/30 bg-success/10 text-success' : 'border-danger/30 bg-danger/10 text-danger'}`}>
                {present ? '✓' : '✗'} {section}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Extra breakdown sections from ATS analyzer */}
      {extraEntries.length > 0 && extraEntries.map(([key, val]) => {
        if (typeof val === 'object' && val !== null) {
          const obj = val as Record<string, unknown>;
          return (
            <Card key={key}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
                <Lightbulb size={18} className="text-accent" />
                {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(obj).map(([subKey, subVal]) => (
                  <motion.div key={subKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-elevated/60 px-4 py-3">
                    <span className="text-ink-sec">{subKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                    <span className="font-semibold text-ink">{typeof subVal === 'number' ? subVal : String(subVal)}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          );
        }
        if (typeof val === 'number') {
          return (
            <Card key={key}>
              <ProgressBar
                label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                value={val}
                showValue
                animated
                colorClass={val >= 80 ? 'from-accent-strong to-accent' : 'from-amber-400 to-amber-300'}
              />
            </Card>
          );
        }
        return null;
      })}

      {/* Quality Tips */}
      {qualityTips.length > 0 && qualityTips[0] !== 'Resume analysis completed' && (
        <Card>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink"><Lightbulb size={18} className="text-warning" /> Improvement Tips</h3>
          <ul className="space-y-2">
            {qualityTips.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-sec">
                <FileWarning size={16} className="mt-0.5 shrink-0 text-warning" />{tip}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Skill Gap */}
      {gap && (
        <Card>
          <h3 className="mb-3 text-lg font-bold text-ink">Skill Gap Overview</h3>
          <div className="mb-4">
            <ProgressBar label="Skills Match" value={gap.match_percentage} showValue animated colorClass={gap.match_percentage >= 70 ? 'from-accent-strong to-accent' : 'from-accent-strong to-accent'} />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-sec">Matching</p>
              <p className="text-2xl font-bold text-success">{gap.skills_analysis.total_matching}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-sec">Missing</p>
              <p className="text-2xl font-bold text-danger">{gap.skills_analysis.missing_required.length}</p>
            </div>
          </div>
          {gap.missing_skills.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-sec">Missing Skills</p>
              <div className="flex flex-wrap gap-1">{gap.missing_skills.map((s: string) => <Badge key={s} tone="warning" size="sm">{s}</Badge>)}</div>
            </div>
          )}
        </Card>
      )}

      {/* Skills Analyzed */}
      {skills.length > 0 && (
        <Card>
          <h3 className="mb-3 text-lg font-bold text-ink">Skills Analyzed ({skills.length})</h3>
          <div className="flex flex-wrap gap-2">{skills.map((s: string) => <Badge key={s} tone="info">{s}</Badge>)}</div>
        </Card>
      )}
    </div>
  );
}
