import { Brain, Code2, Database, FileSearch, Globe, Layout, Rocket, Shield, Upload, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

/* Static facts — every number here is verified against the product:
   84 = canonical career taxonomy size, 16 = quiz catalogue (SkillQuizzesPage),
   3 = resume templates (ResumeBuilderPage), 1 = free tier monthly scan (Pricing). */
const stats = [
  { label: 'Career Paths Mapped', value: 84, suffix: '+', color: 'text-accent-strong' },
  { label: 'Skill Quizzes', value: 16, suffix: '', color: 'text-accent-strong' },
  { label: 'ATS Resume Templates', value: 3, suffix: '', color: 'text-accent-strong' },
  { label: 'Free Analysis / Month', value: 1, suffix: '', color: 'text-success' },
];

const techStack = [
  { name: 'Python', icon: Code2 },
  { name: 'Flask', icon: Globe },
  { name: 'PostgreSQL', icon: Database },
  { name: 'React', icon: Zap },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Tailwind CSS', icon: Zap },
  { name: 'Vite', icon: Layout },
  { name: 'scikit-learn', icon: Brain },
];

const howItWorks = [
  { step: 1, icon: Users, title: 'Sign Up', desc: 'Create your free account — under a minute.' },
  { step: 2, icon: Upload, title: 'Upload Resume', desc: 'Drop your PDF or DOCX — we parse it instantly.' },
  { step: 3, icon: FileSearch, title: 'AI Analyzes', desc: 'We score your resume and match you to careers.' },
  { step: 4, icon: Rocket, title: 'Grow', desc: 'Follow your roadmap, practice, and track applications.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Hero */}
        <section className="text-center">
          <Badge tone="info" icon={<Rocket size={12} />} className="mb-4">Our Story</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">About Applyce</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-sec">We help students, freshers, and career switchers find their next step — with clear, data-backed guidance.</p>
        </section>

        {/* Stats */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} hover={false} className="text-center">
              <p className={`text-3xl font-semibold tracking-tight ${stat.color}`}>{stat.value}{stat.suffix}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-sec">{stat.label}</p>
            </Card>
          ))}
        </section>

        {/* Mission + tech */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card hover={false}>
            <h2 className="mb-3 text-lg font-semibold text-ink">Our Mission</h2>
            <p className="text-sm text-ink-sec leading-relaxed">Career decisions shouldn&apos;t be guesswork. Applyce reads your resume, checks ATS readiness, matches you to careers, and builds a learning plan — whether you&apos;re starting out, switching paths, or leveling up.</p>
            <div className="mt-4 flex gap-1.5">
              <Badge tone="success" icon={<Shield size={12} />}>Privacy First</Badge>
              <Badge tone="info" icon={<Zap size={12} />}>AI-Powered</Badge>
            </div>
          </Card>
          <Card hover={false}>
            <h2 className="mb-4 text-lg font-semibold text-ink">Technology Stack</h2>
            <div className="grid grid-cols-2 gap-2">
              {techStack.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.name} className="flex items-center gap-2 rounded-lg border border-line bg-elevated/60 px-3 py-2 text-sm text-ink">
                    <Icon size={16} className="text-accent-strong" />
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
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} hover className="relative text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                    <Icon size={20} className="text-accent-strong" />
                  </div>
                  <p className="absolute right-3 top-3 text-xs font-bold text-ink-ter">0{item.step}</p>
                  <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-xs text-ink-sec">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card hover={false} className="mx-auto max-w-2xl bg-accent/5 ring-1 ring-accent/10">
            <h2 className="text-xl font-semibold text-ink">See where your resume stands today</h2>
            <p className="mt-2 text-sm text-ink-sec">Free to start — your first analysis takes under a minute.</p>
            <Link to="/upload"><Button className="mt-4" size="sm">Start Free</Button></Link>
          </Card>
        </section>
      </div>
    </div>
  );
}