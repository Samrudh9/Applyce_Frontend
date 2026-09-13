import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle, ArrowRight, BarChart3, Brain, Briefcase,
  CheckCircle2, Eye, Layers, LightbulbIcon, Loader2, Map,
  RotateCcw, Search, Sparkles, Target, TrendingUp, Workflow, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import type { CareerPrediction } from '../types/api';

/* ---------- data ---------- */
const proofItems = [
  '84 career paths analyzed',
  'ATS score for every resume',
  'Salary + skill-gap mapping',
];

const predictExamples = [
  { label: 'Data & AI', skills: 'python, machine learning, sql', interests: 'data analysis, AI' },
  { label: 'Web & Design', skills: 'react, typescript, node.js', interests: 'web development, UI design' },
];

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

const whyApplyce = [
  { icon: Layers, title: 'One 84-career taxonomy', desc: 'Matches, ATS keywords, salary bands, and skill gaps all read from the same canonical map — so every answer stays consistent and comparable.' },
  { icon: Eye, title: 'Explainable, not a black box', desc: 'Every score shows its work: the keywords you hit, the ones you missed, and the exact fixes that move the needle.' },
  { icon: Workflow, title: 'Resume → roadmap → jobs', desc: 'One upload feeds the whole flow — career fits, a learning path, and matching roles. No re-entering your details, no dead ends.' },
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

/* ---------- hero sample score card (illustration only) ---------- */
function HeroScoreCard() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : { type: 'spring', stiffness: 110, damping: 15, delay: 0.5 }
      }
      className="relative z-0 mx-auto w-full max-w-md"
      aria-label="Sample resume analysis illustration"
    >
      {/* soft glow bed behind the card */}
      <div className="absolute -inset-5 -z-10 rounded-[2rem] bg-gradient-to-tr from-accent/15 via-accent/5 to-burgundy/10 blur-2xl" />

      <div className={reduceMotion ? '' : 'animate-float'}>
        <Card hover={false} className="relative overflow-hidden">
          {/* inner color washes for depth */}
          <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-burgundy/10 blur-3xl" />

          <div className="relative flex items-center justify-between">
            <Badge tone="neutral" size="sm" icon={<Sparkles size={11} className="text-accent" />}>
              Sample result
            </Badge>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-ter">Illustration</span>
          </div>

          <div className="relative mt-6 flex items-center gap-6">
            <CircularProgress value={78} size={112} strokeWidth={10}>
              <span className="font-display text-3xl font-semibold tracking-tight text-ink">78</span>
              <span className="mt-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                Strong fit
              </span>
            </CircularProgress>

            <div className="min-w-0 flex-1 space-y-4">
              <ProgressBar label="Keyword match" value={82} showValue height="h-1.5" />
              <ProgressBar label="Section coverage" value={74} showValue height="h-1.5" />
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-between rounded-xl border border-line bg-elevated/60 px-4 py-2.5">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-sec">
              <BarChart3 size={14} className="text-accent" />
              Sample only — your results may differ
            </span>
            <Badge tone="neutral" size="sm">Demo</Badge>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

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
      setPredError('Could not get predictions. Check your connection and try again.');
    } finally {
      setPredicting(false);
    }
  };

  const submitOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handlePredict();
  };

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ───── HERO ───── */}
      <section className="relative -mx-4 -mt-10 overflow-hidden border-b border-line px-5 py-16 sm:px-6 md:-mx-8 md:px-16 md:py-24 lg:py-28">
        {/* Subtle geometric accents */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-accent/[0.05] to-transparent" />
        <div className="absolute bottom-0 left-12 h-2/3 w-px bg-gradient-to-t from-accent/20 to-transparent" />
        <div className="absolute right-16 top-0 h-1/2 w-px bg-gradient-to-b from-burgundy/10 to-transparent hidden md:block" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          {/* Copy column */}
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge tone="info" dot className="mb-6">
                Powered by Advanced AI
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl xl:text-6xl 2xl:text-7xl"
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

            {/* Honest proof strip — product facts only */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm font-medium text-ink-sec"
            >
              {proofItems.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-2.5">
                  {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-ink-ter/60" aria-hidden="true" />}
                  <span>{item}</span>
                </span>
              ))}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/upload">
                <Button size="lg">
                  Upload Resume <ArrowRight size={18} />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles size={16} /> Try it now
              </Button>
            </motion.div>
          </div>

          {/* Sample score card — right on xl, stacked below on mobile */}
          <HeroScoreCard />
        </div>
      </section>

      {/* ───── LARGE ROUNDED CONTENT CONTAINER (Try It Now) ───── */}
      <section id="try-it" className="mx-auto -mt-16 max-w-5xl scroll-mt-24">
        <div className="rounded-3xl border border-line bg-surface p-8 shadow-card md:p-12">
          <SectionHeading
            align="center"
            badge={<Badge tone="info" dot>Try It Now</Badge>}
            title="Quick Career Prediction"
            subtitle="Not sure where to start? Type in what you know and like — get matched careers instantly."
          />

          <div className="mx-auto max-w-xl space-y-4" aria-busy={predicting}>
            <Input
              label="Your Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onKeyDown={submitOnEnter}
              placeholder="e.g. python, machine learning, sql, react"
            />
            <Input
              label="Your Interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              onKeyDown={submitOnEnter}
              placeholder="e.g. data analysis, AI, web development"
            />

            {/* Guidance chips — a friendly empty-state affordance */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-ink-ter">Try a sample:</span>
              {predictExamples.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => {
                    setSkills(ex.skills);
                    setInterests(ex.interests);
                    setPredError('');
                  }}
                  className="rounded-full border border-line bg-elevated/60 px-4 py-2.5 text-[13px] font-medium text-ink-sec transition-colors duration-150 hover:border-accent/40 hover:text-ink"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <Button onClick={handlePredict} disabled={predicting || !skills.trim()} className="w-full">
              {predicting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {predicting ? 'Predicting…' : 'Get Career Predictions'}
            </Button>
          </div>

          {predError && (
            <div
              role="alert"
              className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3"
            >
              <span className="inline-flex items-center gap-2 text-sm text-danger">
                <AlertCircle size={15} /> {predError}
              </span>
              <Button size="md" variant="danger" onClick={handlePredict} disabled={predicting} className="min-h-10">
                <RotateCcw size={14} /> Retry
              </Button>
            </div>
          )}

          {predicting && (
            <div
              role="status"
              aria-label="Analyzing your profile"
              className="mx-auto mt-8 max-w-xl space-y-2.5"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-sec">Analyzing your profile…</p>
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} lines={2} className="!p-4" />
              ))}
            </div>
          )}

          {!predicting && predictions.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto mt-8 max-w-xl"
            >
              <motion.div variants={fadeUp} className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-sec">Top Matches</p>
                <Badge tone="info" size="sm">{predictions.length} careers</Badge>
              </motion.div>
              <div className="space-y-3">
                {predictions.map((p, i) => (
                  <motion.div
                    key={p.career}
                    variants={fadeUp}
                    className="group flex items-center justify-between rounded-xl border border-line bg-elevated/60 px-5 py-3 transition-colors duration-150 hover:border-line-strong hover:bg-elevated"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent-strong transition-colors duration-150 group-hover:bg-accent/20">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-ink">{p.career}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden text-[11px] text-ink-ter sm:inline">confidence</span>
                      <Badge tone={p.confidence >= 80 ? 'success' : p.confidence >= 60 ? 'warning' : 'neutral'}>
                        {p.confidence.toFixed(1)}%
                      </Badge>
                    </div>
                  </motion.div>
                ))}
                <motion.div variants={fadeUp}>
                  <Link to={`/roadmap?career=${encodeURIComponent(predictions[0].career)}`}>
                    <Button variant="secondary" size="md" className="mt-2 min-h-10 w-full">
                      <Map size={14} /> View Roadmap for {predictions[0].career}
                    </Button>
                  </Link>
                </motion.div>
              </div>
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
              <motion.div key={f.label} variants={fadeUp} className="h-full">
                <Card className="group h-full hover:-translate-y-1">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/8 text-accent-strong transition-colors duration-150 group-hover:bg-accent/15">
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

      {/* ───── WHY APPLYCE ───── */}
      <section>
        <SectionHeading
          align="center"
          badge={<Badge tone="violet" dot>Why Applyce</Badge>}
          title="One consistent engine behind every answer"
          subtitle="No black boxes and no one-off calculators — every result comes from the same system of record."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {whyApplyce.map((w, i) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <Card className="group h-full hover:-translate-y-1">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/8 text-accent-strong transition-colors duration-150 group-hover:bg-accent/15">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-bold text-ink">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-sec">{w.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
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
      <section className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-20 text-center shadow-card md:px-12">
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