import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, BookOpen, Brain, Briefcase,
  CheckCircle2, LightbulbIcon, Loader2, Map, Search, Sparkles,
  Target, TrendingUp, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { CareerPrediction } from '../types/api';

/* ---------- data ---------- */
const features = [
  { icon: Brain, label: 'AI Career Matching', desc: 'Tell us what you know and what you enjoy — get career fits ranked by confidence.' },
  { icon: BarChart3, label: 'ATS Score Analysis', desc: 'See how hiring software reads your resume — and exactly what to fix.' },
  { icon: Briefcase, label: 'Real Job Search', desc: 'Browse live roles that match your skills, with fit scores up front.' },
  { icon: Map, label: 'Career Roadmaps', desc: 'A step-by-step learning path for your goal role — skills, resources, and milestones.' },
  { icon: TrendingUp, label: 'Salary Estimation', desc: 'Realistic salary ranges for your role, location, and experience level.' },
  { icon: Search, label: 'Skill Gap Analysis', desc: 'Know exactly which skills to learn next — and which you already have.' },
  { icon: Target, label: 'Progress Tracking', desc: 'Watch your resume and ATS scores improve each time you upload.' },
  { icon: LightbulbIcon, label: 'Improvement Tips', desc: 'Simple, prioritized fixes ranked by how much they boost your score.' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'Add your resume — PDF or DOCX, we handle the rest.' },
  { num: '02', title: 'AI Analysis', desc: 'We break down your skills, ATS fit, and career alignment.' },
  { num: '03', title: 'Get Results', desc: 'See your scores, career fits, and a plan to improve.' },
  { num: '04', title: 'Take Action', desc: 'Build your resume, prep for interviews, and track applications.' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ---------- component ---------- */
export default function LandingPage() {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [predictions, setPredictions] = useState<CareerPrediction[]>([]);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState('');

  const handlePredict = async () => {
    if (!skills.trim()) return;
    setPredicting(true);
    setPredError('');
    setPredictions([]);
    try {
      const res = await api.predict({ skills: skills.trim(), interests: interests.trim() });
      setPredictions(res.predictions);
    } catch {
      setPredError('Could not get predictions. Please try again.');
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-28">
      {/* ───── HERO ───── */}
      <section className="relative -mx-4 -mt-10 overflow-hidden border-b border-line px-6 py-24 md:-mx-8 md:px-16 md:py-36">
        {/* Subtle geometric accents */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-accent/[0.05] to-transparent" />
        <div className="absolute bottom-0 left-12 h-2/3 w-px bg-gradient-to-t from-accent/20 to-transparent" />
        <div className="absolute right-16 top-0 h-1/2 w-px bg-gradient-to-b from-burgundy/10 to-transparent hidden md:block" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="info" dot className="mb-6">
              Powered by Advanced AI
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-7xl lg:text-8xl"
          >
            Discover Your{' '}
            <em className="not-italic gradient-text">Ideal Career</em>{' '}
            Path with AI
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-accent to-burgundy"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-sec md:text-xl"
          >
            Upload your resume and get a clear read on your strengths, your gaps, and the careers that fit you — all in under a minute.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/upload">
              <Button size="lg">
                Upload Resume <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ───── LARGE ROUNDED CONTENT CONTAINER ───── */}
      <section className="mx-auto -mt-16 max-w-5xl">
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-card md:p-12">
          <SectionHeading
            align="center"
            badge={<Badge tone="info" dot>Try It Now</Badge>}
            title="Quick Career Prediction"
            subtitle="Not sure where to start? Type in what you know and like — get matched careers instantly."
          />
          <div className="mx-auto max-w-xl space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Your Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. python, machine learning, sql, react"
                className="input-glow w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-ter focus:border-accent hover:border-line-strong"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Your Interests</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. data analysis, AI, web development"
                className="input-glow w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-ter focus:border-accent hover:border-line-strong"
              />
            </div>
            <Button onClick={handlePredict} disabled={predicting || !skills.trim()} className="w-full">
              {predicting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {predicting ? 'Predicting…' : 'Get Career Predictions'}
            </Button>
          </div>

          {predError && <p className="mt-3 text-center text-sm text-danger">{predError}</p>}

          {predictions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-sec">Top Matches</p>
              {predictions.map((p, i) => (
                <div key={p.career} className="flex items-center justify-between rounded-xl border border-line bg-elevated/60 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent-strong">{i + 1}</span>
                    <span className="font-semibold text-ink">{p.career}</span>
                  </div>
                  <Badge tone={p.confidence >= 80 ? 'success' : p.confidence >= 60 ? 'warning' : 'neutral'}>
                    {p.confidence.toFixed(1)}%
                  </Badge>
                </div>
              ))}
              <Link to={`/roadmap?career=${encodeURIComponent(predictions[0].career)}`}>
                <Button variant="secondary" size="sm" className="mt-2 w-full">
                  <Map size={14} /> View Roadmap for {predictions[0].career}
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section>
        <SectionHeading
          align="center"
          badge={<Badge tone="info" dot>Features</Badge>}
          title="Everything You Need to Accelerate Your Career"
          subtitle="From resume analysis to job search — Applyce covers every step of your professional journey."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.label} variants={fadeUp}>
                <Card hover={false} className="group h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 text-accent-strong transition-colors group-hover:bg-accent/15">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold text-ink">{f.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-sec">{f.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section>
        <SectionHeading
          align="center"
          badge={<Badge tone="success" dot>How It Works</Badge>}
          title="Get Started in 4 Simple Steps"
          subtitle="From upload to career clarity in under 5 minutes."
        />
        <div className="relative">
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-accent/20 via-burgundy/10 to-transparent md:block lg:left-0 lg:right-0 lg:top-1/2 lg:mx-auto lg:h-px lg:w-[calc(100%-6rem)] lg:-translate-x-0 lg:-translate-y-1/2" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Card className="relative text-center" hover={false}>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-xl font-bold text-white shadow-card">
                    {step.num}
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-sec">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-20 text-center shadow-card">
        <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-accent/[0.04] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <div className="relative z-10">
          <Zap className="mx-auto mb-4 text-accent" size={36} />
          <h3 className="font-display text-3xl font-bold text-ink md:text-4xl">Ready to Find Your Dream Career?</h3>
          <p className="mx-auto mt-3 max-w-lg text-ink-sec md:text-lg">
            Free to start — see what your resume says about your next step.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/upload">
              <Button size="lg">
                Upload Resume <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-sec">
            <CheckCircle2 size={14} className="text-accent" /> Free forever plan available
          </p>
        </div>
      </section>
    </div>
  );
}