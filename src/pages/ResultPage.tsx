import { motion } from 'framer-motion';
import { ArrowRight, Award, Briefcase, Download, Lightbulb, Map, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';

const scoreBreakdown = [
  { label: 'Keywords', value: 92, color: 'from-cyan to-mint' },
  { label: 'Format & Layout', value: 85, color: 'from-mint to-success' },
  { label: 'Section Structure', value: 81, color: 'from-violet to-cyan' },
  { label: 'Content Quality', value: 89, color: 'from-cyan to-violet' },
];

const careerPredictions = [
  { name: 'Machine Learning Engineer', confidence: 92, icon: Target, growth: '+34%' },
  { name: 'Data Scientist', confidence: 84, icon: Briefcase, growth: '+28%' },
  { name: 'Backend Engineer', confidence: 78, icon: Lightbulb, growth: '+18%' },
];

const yourSkills = ['Python', 'Flask', 'SQL', 'TensorFlow', 'Git', 'REST APIs', 'Pandas', 'NumPy'];
const skillsToLearn = ['MLOps', 'Kubernetes', 'Distributed Systems', 'System Design', 'Spark'];

const recommendations = [
  { text: 'Add 5 role-specific keywords to your experience section', impact: 9.2 },
  { text: 'Rewrite professional summary targeting ML Engineer roles', impact: 8.6 },
  { text: 'Quantify project outcomes (e.g., "reduced latency by 40%")', impact: 8.2 },
  { text: 'Add a dedicated "Technical Projects" section', impact: 7.8 },
];

export default function ResultPage() {
  return (
    <div className="space-y-8">
      {/* Overall Score + Breakdown */}
      <section className="grid gap-6 lg:grid-cols-3">
        <Card glow className="flex flex-col items-center justify-center text-center lg:col-span-1">
          <CircularProgress value={88} size={170} strokeWidth={12} color="#f0a03c" label="Overall" />
          <div className="mt-4 flex items-center gap-2">
            <Badge tone="success" icon={<Award size={12} />}>Grade A</Badge>
            <Badge tone="info">Top 15%</Badge>
          </div>
          <p className="mt-2 text-xs text-muted">Based on 4 evaluation dimensions</p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold">Score Breakdown</h2>
          <div className="space-y-4">
            {scoreBreakdown.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} showValue colorClass={item.color} animated />
            ))}
          </div>
        </Card>
      </section>

      {/* Career Predictions */}
      <SectionHeading title="Top Career Predictions" subtitle="AI-matched careers based on your skills, experience, and resume content." />
      <div className="grid gap-4 md:grid-cols-3">
        {careerPredictions.map((career, i) => {
          const Icon = career.icon;
          return (
            <motion.div key={career.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover className="relative overflow-hidden">
                <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-gradient-to-br from-amber/5 to-transparent" />
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10"><Icon size={18} className="text-cyan" /></div>
                  <Badge tone="success" size="sm">{career.confidence}% match</Badge>
                </div>
                <h3 className="text-lg font-bold">{career.name}</h3>
                <p className="mt-1 text-xs text-success">Job growth {career.growth}</p>
                <Link to="/roadmap" className="mt-3 flex items-center gap-1 text-sm font-medium text-cyan hover:text-mint">
                  View Roadmap <ArrowRight size={14} />
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Skills */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-bold">Your Skills <span className="text-sm font-normal text-muted">({yourSkills.length} detected)</span></h3>
          <div className="flex flex-wrap gap-2">
            {yourSkills.map((s) => <Badge key={s} tone="success">{s}</Badge>)}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-bold">Skills to Learn <span className="text-sm font-normal text-muted">({skillsToLearn.length} recommended)</span></h3>
          <div className="flex flex-wrap gap-2">
            {skillsToLearn.map((s) => <Badge key={s} tone="warning">{s}</Badge>)}
          </div>
        </Card>
      </section>

      {/* ATS Preview */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">ATS Report Preview</h3>
            <p className="mt-1 text-sm text-muted">Missing key achievements in experience section. Low keyword density for target role.</p>
          </div>
          <Link to="/ats"><Button variant="secondary" size="sm">View Full Report</Button></Link>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <h3 className="mb-4 text-lg font-bold">AI Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <motion.div key={rec.text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex items-center justify-between gap-4 rounded-xl border border-parchment/[0.06] bg-parchment/[0.02] px-4 py-3 text-sm">
              <span>{rec.text}</span>
              <Badge tone="info" className="shrink-0">Impact {rec.impact}</Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* CTAs */}
      <section className="flex flex-wrap gap-3">
        <Button><Download size={16} /> Download Report</Button>
        <Link to="/jobs"><Button variant="secondary"><Search size={16} /> Search Jobs</Button></Link>
        <Link to="/roadmap"><Button variant="outline"><Map size={16} /> View Roadmap</Button></Link>
      </section>
    </div>
  );
}
