import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, BookOpen, Brain, Briefcase,
  CheckCircle2, LightbulbIcon, Map, Search, Sparkles,
  Target, TrendingUp, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

/* ---------- data ---------- */
const features = [
  { icon: Brain, label: 'AI Career Matching', desc: 'Advanced ML models match your skills, experience, and interests to 500+ career paths with confidence scores.' },
  { icon: BarChart3, label: 'ATS Score Analysis', desc: 'Get a detailed breakdown of how well your resume passes Applicant Tracking Systems used by top companies.' },
  { icon: Briefcase, label: 'Real Job Search', desc: 'Search live job listings from LinkedIn, Indeed, and more — with personalized match percentages.' },
  { icon: Map, label: 'Career Roadmaps', desc: 'Step-by-step learning paths with resources, projects, and milestones for any target career.' },
  { icon: TrendingUp, label: 'Salary Estimation', desc: 'See market salary ranges for your career match, based on location, experience, and industry data.' },
  { icon: Search, label: 'Skill Gap Analysis', desc: 'Identify exactly which skills you need to learn and which ones already make you competitive.' },
  { icon: Target, label: 'Progress Tracking', desc: 'Track your resume scores, ATS improvements, and roadmap progress over time with rich charts.' },
  { icon: LightbulbIcon, label: 'Improvement Tips', desc: 'Get AI-generated, prioritized recommendations ranked by impact on your career readiness.' },
];

const steps = [
  { num: '01', emoji: '🔐', title: 'Sign Up Free', desc: 'Create your account in seconds — no credit card required.' },
  { num: '02', emoji: '📄', title: 'Upload Resume', desc: 'Upload a PDF or DOCX and let our parser extract key data.' },
  { num: '03', emoji: '🤖', title: 'AI Analysis', desc: 'Our ML engine evaluates skills, ATS fit, and career alignment.' },
  { num: '04', emoji: '🎯', title: 'Get Results', desc: 'Receive career matches, scores, roadmaps, and job suggestions.' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at Google', text: 'Applyce helped me identify the exact skill gaps holding me back. Within 3 months of following the roadmap, I landed my dream role.' },
  { name: 'Marcus Chen', role: 'Data Scientist at Meta', text: 'The ATS analysis was eye-opening. My resume score jumped from 62 to 91 after following the improvement suggestions.' },
  { name: 'Sarah Johnson', role: 'ML Engineer at Tesla', text: 'The career matching accuracy is incredible. It predicted my ideal role with 94% confidence, and it was spot on.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Career Paths' },
  { value: 100, suffix: '+', label: 'Skills Tracked' },
  { value: 10000, suffix: '+', label: 'Users Helped' },
  { value: 94, suffix: '%', label: 'Match Accuracy' },
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
  return (
    <div className="space-y-28">
      {/* ───── HERO ───── */}
      <section className="relative -mx-4 -mt-10 overflow-hidden border-b border-parchment/[0.06] px-6 py-24 md:-mx-8 md:px-16 md:py-36">
        {/* Geometric accents */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber/[0.03] to-transparent" />
        <div className="absolute bottom-0 left-12 h-2/3 w-px bg-gradient-to-t from-amber/20 to-transparent" />
        <div className="absolute right-16 top-0 h-1/2 w-px bg-gradient-to-b from-ember/15 to-transparent hidden md:block" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="violet" dot className="mb-6">
              Powered by Advanced AI
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          >
            Discover Your{' '}
            <em className="text-amber not-italic">Ideal Career</em>{' '}
            Path with AI
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 h-[3px] w-16 rounded-full bg-gradient-to-r from-amber to-ember"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-stone md:text-xl"
          >
            Applyce analyzes your resume, evaluates ATS compatibility, maps skill gaps, and delivers personalised career recommendations — all in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/register">
              <Button size="lg">
                Get Started Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest text-stone/50"
          >
            <span>Trusted by professionals at</span>
            {['Google', 'Meta', 'Amazon', 'Microsoft', 'Tesla'].map((co) => (
              <span key={co} className="font-semibold text-stone/70">{co}</span>
            ))}
          </motion.div>
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
                <Card className="group h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber/15 to-ember/10 text-amber transition-colors group-hover:from-amber/25 group-hover:to-ember/20">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-semibold">{f.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
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
          subtitle="From sign-up to career clarity in under 5 minutes."
        />
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-cyan/30 via-mint/20 to-transparent md:block lg:left-0 lg:right-0 lg:top-1/2 lg:mx-auto lg:h-px lg:w-[calc(100%-6rem)] lg:-translate-x-0 lg:-translate-y-1/2" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Card className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber to-gold text-xl font-bold text-ink shadow-[0_4px_20px_rgba(240,160,60,0.25)]">
                    {step.num}
                  </div>
                  <span className="text-2xl">{step.emoji}</span>
                  <h3 className="mt-2 font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="glass rounded-2xl px-6 py-14 md:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <AnimatedCounter
                end={s.value}
                suffix={s.suffix}
                className="font-display text-4xl font-semibold gradient-text md:text-5xl"
              />
              <p className="mt-2 text-sm font-medium text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section>
        <SectionHeading
          align="center"
          badge={<Badge tone="warning" dot>Testimonials</Badge>}
          title="Loved by Thousands of Professionals"
          subtitle="Hear from real users who transformed their career journey with Applyce."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Sparkles key={idx} size={14} className="text-warning" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-violet text-sm font-bold text-space">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative overflow-hidden rounded-2xl border border-parchment/[0.08] bg-surface px-8 py-20 text-center">
        <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-amber/[0.04] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber/20 to-transparent" />

        <div className="relative z-10">
          <Zap className="mx-auto mb-4 text-amber" size={36} />
          <h3 className="font-display text-3xl font-semibold md:text-4xl">Ready to Find Your Dream Career?</h3>
          <p className="mx-auto mt-3 max-w-lg text-muted md:text-lg">
            Join 10,000+ professionals who accelerated their career growth with Applyce. Start free — no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                Start Free Today <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">Learn More</Button>
            </Link>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <CheckCircle2 size={14} className="text-success" /> Free forever plan available
          </p>
        </div>
      </section>
    </div>
  );
}
