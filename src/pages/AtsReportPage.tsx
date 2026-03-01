import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileWarning, Lightbulb, XCircle } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';

const radarData = [
  { subject: 'Keywords', score: 88 },
  { subject: 'Format', score: 84 },
  { subject: 'Sections', score: 80 },
  { subject: 'Readability', score: 86 },
  { subject: 'Impact', score: 78 },
];

const foundKeywords = ['Python', 'Flask', 'SQL', 'TensorFlow', 'REST API', 'Git'];
const missingKeywords = ['Kubernetes', 'MLOps', 'CI/CD', 'Docker', 'AWS'];

const sectionChecklist = [
  { name: 'Contact Information', ok: true },
  { name: 'Professional Summary', ok: true },
  { name: 'Work Experience', ok: true },
  { name: 'Education', ok: true },
  { name: 'Technical Skills', ok: false },
  { name: 'Certifications', ok: false },
];

const redFlags = [
  { level: 'high', text: 'Missing quantified achievements in latest role' },
  { level: 'medium', text: 'Skills section too generic — add proficiency levels' },
  { level: 'low', text: 'Summary could be more concise (currently 85 words)' },
];

const suggestions = [
  { text: 'Add role-specific keywords to each experience bullet', impact: 9.1 },
  { text: 'Quantify project outcomes with metrics', impact: 8.4 },
  { text: 'Use action verbs at the start of every bullet point', impact: 7.8 },
  { text: 'Add a dedicated "Certifications" section', impact: 7.2 },
];

export default function AtsReportPage() {
  return (
    <div className="space-y-8">
      <SectionHeading title="ATS Compatibility Report" subtitle="Detailed analysis of how your resume performs against Applicant Tracking Systems." badge={<Badge tone="warning" icon={<FileWarning size={12} />}>Score 86</Badge>} />

      {/* Overall score */}
      <Card glow className="flex flex-col items-center text-center">
        <CircularProgress value={86} size={160} strokeWidth={12} color="#ffb300" label="ATS Score" />
        <p className="mt-3 text-sm text-muted">Your resume passes most ATS filters but has room for improvement.</p>
      </Card>

      {/* Radar + bars */}
      <Card>
        <h2 className="mb-4 text-lg font-bold">Score Breakdown</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(232, 224, 212, 0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#7a7168" fontSize={12} />
                <Radar dataKey="score" stroke="#f0a03c" fill="#f0a03c" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {radarData.map((x) => (
              <ProgressBar key={x.subject} label={x.subject} value={x.score} showValue animated />
            ))}
          </div>
        </div>
      </Card>

      {/* Keywords + checklist */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-bold">Keywords Analysis</h3>
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Found ({foundKeywords.length})</p>
            <div className="flex flex-wrap gap-2">{foundKeywords.map((k) => <Badge key={k} tone="success">{k}</Badge>)}</div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-danger">Missing ({missingKeywords.length})</p>
            <div className="flex flex-wrap gap-2">{missingKeywords.map((k) => <Badge key={k} tone="danger">{k}</Badge>)}</div>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-bold">Section Checklist</h3>
          <div className="space-y-2.5">
            {sectionChecklist.map((sec) => (
              <div key={sec.name} className="flex items-center justify-between text-sm">
                <span>{sec.name}</span>
                {sec.ok
                  ? <CheckCircle2 size={18} className="text-success" />
                  : <XCircle size={18} className="text-danger" />}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Red flags */}
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><AlertTriangle size={18} className="text-warning" /> Red Flags</h3>
        <div className="space-y-2">
          {redFlags.map((flag) => (
              <motion.div key={flag.text} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${flag.level === 'high' ? 'border-danger/20 bg-danger/5' : flag.level === 'medium' ? 'border-warning/20 bg-warning/5' : 'border-parchment/[0.06] bg-parchment/[0.02]'}`}>
              <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${flag.level === 'high' ? 'bg-danger' : flag.level === 'medium' ? 'bg-warning' : 'bg-muted'}`} />
              <span>{flag.text}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Lightbulb size={18} className="text-cyan" /> Improvement Suggestions</h3>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
              <motion.div key={s.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between gap-4 rounded-xl border border-parchment/[0.06] bg-parchment/[0.02] px-4 py-3 text-sm">
              <span>{s.text}</span>
              <Badge tone="info" className="shrink-0">Impact {s.impact}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
