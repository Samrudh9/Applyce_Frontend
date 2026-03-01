import { motion } from 'framer-motion';
import { Brain, Code2, Database, Globe, Linkedin, Rocket, Shield, Upload, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { SectionHeading } from '../components/ui/SectionHeading';

const stats = [
  { label: 'Careers Mapped', value: 500, suffix: '+', color: 'text-cyan' },
  { label: 'Skills Tracked', value: 100, suffix: '+', color: 'text-mint' },
  { label: 'Active Users', value: 10000, suffix: '+', color: 'text-violet' },
  { label: 'Industries', value: 6, suffix: '', color: 'text-success' },
];

const techStack = [
  { name: 'Python', icon: Code2 },
  { name: 'Flask', icon: Globe },
  { name: 'PostgreSQL', icon: Database },
  { name: 'React', icon: Zap },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Tailwind CSS', icon: Zap },
  { name: 'TensorFlow', icon: Brain },
  { name: 'Supabase', icon: Database },
];

const howItWorks = [
  { step: 1, icon: Users, title: 'Sign Up', desc: 'Create your free account in seconds.' },
  { step: 2, icon: Upload, title: 'Upload Resume', desc: 'Upload PDF or DOCX — we parse it instantly.' },
  { step: 3, icon: Brain, title: 'AI Analyzes', desc: 'Our models score, match, and recommend.' },
  { step: 4, icon: Rocket, title: 'Grow', desc: 'Follow your roadmap and track progress.' },
];

const team = [
  { name: 'Aisha Rao', role: 'CEO & Co-founder', gradient: 'from-cyan to-mint' },
  { name: 'Karan Mehta', role: 'CTO & AI Lead', gradient: 'from-violet to-cyan' },
  { name: 'Nina Patel', role: 'Head of Product', gradient: 'from-mint to-success' },
];

export default function AboutPage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="text-center">
        <Badge tone="info" icon={<Rocket size={12} />} className="mb-4">Our Story</Badge>
        <h1 className="font-display text-4xl font-semibold md:text-5xl">About <span className="gradient-text">Applyce</span></h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted">Empowering job seekers with AI-driven career intelligence. We combine resume parsing, ATS analysis, and market data to map the best-fit career paths for every user.</p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="text-center">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} className={`font-display text-3xl font-semibold ${stat.color}`} />
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Mission + tech */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-2xl font-semibold">Our Mission</h2>
          <p className="text-muted leading-relaxed">We believe career decisions shouldn't be guesswork. Applyce (powered by the SkillFit engine) leverages machine learning to analyze resumes, predict career fits with 92%+ accuracy, and generate personalized learning roadmaps — all in real time.</p>
          <div className="mt-4 flex gap-2">
            <Badge tone="success" icon={<Shield size={12} />}>Privacy First</Badge>
            <Badge tone="info" icon={<Zap size={12} />}>AI-Powered</Badge>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-2xl font-semibold">Technology Stack</h2>
          <div className="grid grid-cols-2 gap-3">
            {techStack.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.name} className="flex items-center gap-2 rounded-lg border border-parchment/[0.06] bg-parchment/[0.02] px-3 py-2 text-sm">
                  <Icon size={16} className="text-cyan" />
                  <span>{t.name}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* How It Works */}
      <section>
        <SectionHeading title="How It Works" subtitle="From sign-up to career growth in 4 simple steps." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                <Card hover className="relative text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/10">
                    <Icon size={22} className="text-cyan" />
                  </div>
                  <p className="absolute right-3 top-3 text-xs font-bold text-muted">0{item.step}</p>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted">{item.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section>
        <SectionHeading title="Meet the Team" subtitle="A passionate crew building the future of career intelligence." />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} hover className="text-center">
              <div className={`mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br ${member.gradient}`} />
              <p className="text-lg font-bold">{member.name}</p>
              <p className="text-sm text-muted">{member.role}</p>
              <a href="#" className="mt-2 inline-flex items-center gap-1 text-sm text-amber hover:text-gold"><Linkedin size={14} /> LinkedIn</a>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card glow className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold">Ready to discover your perfect career?</h2>
          <p className="mt-2 text-muted">Join 10,000+ users and let AI map your career path.</p>
          <Link to="/register"><Button className="mt-5">Get Started Free</Button></Link>
        </Card>
      </section>
    </div>
  );
}
