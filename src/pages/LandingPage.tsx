import { useEffect, useState } from 'react';
import {
  ArrowRight, AlertCircle, Briefcase, FileText, Layout,
  LetterText, MapPin, MessageSquare, RotateCcw,
  Search, Target, Trophy, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import type { Job } from '../types/api';

/* ──────────────────────────────────────────────────────────────
   Static data — every value here is verified against the backend
   or pricing page before being written.
   ────────────────────────────────────────────────────────────── */

const FREE_TOOLS = [
  {
    icon: FileText,
    label: 'Resume Analysis',
    desc: 'Upload a resume — get career matches, ATS score, and fixes.',
    link: '/upload',
    limit: '1 per month',
  },
  {
    icon: Target,
    label: 'Career Match',
    desc: 'Type your skills and interests — get ranked career fits.',
    link: '/upload',
    limit: 'Free',
  },
  {
    icon: Layout,
    label: 'Resume Builder',
    desc: 'Build a resume from scratch with section-by-section guidance.',
    link: '/resume-builder',
    limit: 'Free',
  },
  {
    icon: LetterText,
    label: 'Cover Letter',
    desc: 'Generate a tailored cover letter for any job application.',
    link: '/cover-letter',
    limit: 'Free',
  },
] as const;

const QUICK_ACCESS = [
  { label: 'Jobs', path: '/jobs' },
  { label: 'Roadmaps', path: '/roadmap' },
  { label: 'Interview Prep', path: '/interview' },
  { label: 'Skill Quizzes', path: '/quizzes' },
  { label: 'Resume Builder', path: '/resume-builder' },
  { label: 'Cover Letter', path: '/cover-letter' },
  { label: 'Application Tracker', path: '/tracker' },
  { label: 'Scorecard', path: '/scorecard' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
] as const;

const INTERVIEW_TOPICS = [
  { label: 'Career Roadmaps', path: '/roadmap' },
  { label: 'Skill Quizzes', path: '/quizzes' },
  { label: 'Mock Interviews', path: '/interview' },
  { label: 'ATS Report', path: '/ats-report' },
  { label: 'Job Matching', path: '/jobs' },
  { label: 'Scorecard', path: '/scorecard' },
] as const;

/* ──────────────────────────────────────────────────────────────
   Section 1 — Hero
   Dark surface, big headline, ONE CTA, 4 metric chips.
   ────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface px-4 py-14 sm:px-6 md:py-20 lg:py-24">
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-accent/[0.06] to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          AI career tools —{' '}
          <span className="text-accent-strong">from resume to offer</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-sec sm:text-lg">
          Upload once. Get matched to 84 careers, scored for ATS, shown your salary range —
          then build, track, and apply.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/upload">
            <Button size="lg" variant="accent">
              Upload Resume <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="secondary">
              See Pricing
            </Button>
          </Link>
        </div>

        {/* Metric chips — every number is a verified product fact */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { icon: Target, label: '84 career paths', sub: 'Canonical taxonomy' },
            { icon: Trophy, label: 'ATS score', sub: 'For every resume' },
            { icon: Zap, label: 'Salary + skill-gap', sub: 'Per career match' },
            { icon: Briefcase, label: 'Job search', sub: 'Live, scored results' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-line bg-elevated/60 px-3 py-3 sm:px-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon size={16} className="text-accent-strong" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink sm:text-sm">{item.label}</p>
                  <p className="text-[11px] text-ink-ter">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 2 — Free tools (2×2 grid)
   Flat tiles with hover, no card chrome. Each links to its route.
   ────────────────────────────────────────────────────────────── */

function FreeToolsSection() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-1 font-display text-lg font-bold text-ink sm:text-xl">
          Free tools for your job hunt
        </h2>
        <p className="mb-6 text-sm text-ink-sec">No card, no subscription. Start now.</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {FREE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.label}
                to={tool.link}
                className="group flex items-start justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-4 transition-colors hover:border-accent/30 hover:bg-accent/[0.03]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
                    <Icon size={16} className="text-accent-strong" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink group-hover:underline">{tool.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-sec">{tool.desc}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-ink-ter">{tool.limit}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 3 — Quick Access
   Dense grid of small text links.
   ────────────────────────────────────────────────────────────── */

function QuickAccessSection() {
  return (
    <section className="border-y border-line bg-elevated/40 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-1 font-display text-lg font-bold text-ink sm:text-xl">Quick Access</h2>
        <p className="mb-4 text-sm text-ink-sec">Jump to any feature instantly</p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
          {QUICK_ACCESS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-ink-sec transition-colors hover:text-accent-strong hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 4 — Live Jobs preview
   Fetches real data from the backend job search API.
   Loading / empty / error all handled honestly.
   ────────────────────────────────────────────────────────────── */

function LiveJobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.jobSearch({ career: 'Software Engineer', location: 'India', limit: 3 });
      setJobs(res.jobs);
    } catch {
      setError('Jobs are temporarily unavailable. Try again soon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadJobs();
  }, []);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
              Jobs filtered by your skills
            </h2>
            <p className="mt-0.5 text-sm text-ink-sec">
              Live openings — search by career and location.
            </p>
          </div>
          <Link
            to="/jobs"
            className="hidden shrink-0 text-sm font-medium text-accent-strong hover:underline sm:inline-flex"
          >
            Browse Jobs <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-2">
          {/* Loading state */}
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                </div>
              ))}
            </>
          )}

          {/* Error state */}
          {!loading && error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3"
            >
              <span className="inline-flex items-center gap-2 text-sm text-danger">
                <AlertCircle size={14} /> {error}
              </span>
              <Button
                size="sm"
                variant="danger"
                onClick={() => void loadJobs()}
              >
                <RotateCcw size={12} /> Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && jobs.length === 0 && (
            <p className="rounded-xl border border-line bg-surface px-4 py-6 text-center text-sm text-ink-sec">
              No live jobs right now — check back soon.
            </p>
          )}

          {/* Job cards — real data only */}
          {!loading && !error && jobs.map((job) => (
            <a
              key={job.id}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/30 hover:bg-accent/[0.03]"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-xs font-bold text-accent-strong">
                {job.company.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink group-hover:underline">
                  {job.title}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-sec">
                  <span className="truncate">{job.company}</span>
                  {job.location && (
                    <>
                      <span className="h-0.5 w-0.5 rounded-full bg-ink-ter" aria-hidden="true" />
                      <span className="flex shrink-0 items-center gap-0.5">
                        <MapPin size={10} /> {job.location}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <Badge tone="neutral" size="sm">
                {job.job_type || 'Full-time'}
              </Badge>
            </a>
          ))}
        </div>

        <Link
          to="/jobs"
          className="mt-4 block text-center text-sm font-medium text-accent-strong hover:underline sm:hidden"
        >
          Browse Jobs <ArrowRight size={14} className="ml-1 inline" />
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 5 — Interview / Prep preview
   Static topic chips + CTA. No invented counts.
   ────────────────────────────────────────────────────────────── */

function InterviewPrepSection() {
  return (
    <section className="border-y border-line bg-elevated/40 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl grid gap-6 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-strong">
            <MessageSquare size={14} /> Interview Prep
          </div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Practise the rounds you will actually face
          </h2>
          <p className="mt-2 text-sm text-ink-sec">
            Career roadmaps, skill quizzes, mock interviews, and ATS reports —
            everything you need before you apply.
          </p>
          <div className="mt-5">
            <Link to="/interview">
              <Button size="md" variant="accent">
                Start Preparing <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INTERVIEW_TOPICS.map((topic) => (
            <Link
              key={topic.path + topic.label}
              to={topic.path}
              className="rounded-xl border border-line bg-surface p-3 text-center transition-colors hover:border-accent/30 hover:bg-accent/[0.03] group"
            >
              <p className="text-xs font-semibold text-ink group-hover:underline sm:text-sm">
                {topic.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 6 — Application Tracker preview
   Simple card with honest copy. Dashboard requires auth, so
   no live data here — just a clear link.
   ────────────────────────────────────────────────────────────── */

function TrackerSection() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                Keep track of what you have applied to
              </h2>
              <p className="mt-1.5 max-w-lg text-sm text-ink-sec">
                Log every application, set statuses, and see your progress at a glance.
                No spreadsheets needed.
              </p>
            </div>
            <Link to="/tracker" className="shrink-0">
              <Button size="md" variant="secondary">
                View Dashboard <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Example rows — clearly labelled as examples */}
          <div className="mt-6 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-ter">Example</p>
            {[
              { role: 'Frontend Engineer', company: 'Acme Corp', status: 'Applied' },
              { role: 'ML Engineer', company: 'DataCo', status: 'Interview' },
              { role: 'Full Stack Dev', company: 'StartupXYZ', status: 'Offer' },
            ].map((row) => (
              <div
                key={row.role}
                className="flex items-center justify-between rounded-lg border border-line bg-elevated/40 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{row.role}</p>
                  <p className="text-xs text-ink-ter">{row.company}</p>
                </div>
                <Badge
                  tone={
                    row.status === 'Offer'
                      ? 'success'
                      : row.status === 'Interview'
                        ? 'warning'
                        : 'neutral'
                  }
                  size="sm"
                >
                  {row.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section 7 — Bottom CTA band
   Orange background, two buttons.
   ────────────────────────────────────────────────────────────── */

function BottomCtaSection() {
  return (
    <section className="bg-accent px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Start building your career toolkit
        </h2>
        <p className="mt-2 text-sm text-white/80 sm:text-base">
          Upload a resume, search live jobs, and track your applications — all in one place.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/upload" className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-white text-accent-strong hover:bg-white/90 sm:w-auto">
              <Briefcase size={16} /> Upload Resume <ArrowRight size={14} />
            </Button>
          </Link>
          <Link to="/jobs" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white text-white hover:bg-white/15 sm:w-auto"
            >
              <Search size={16} /> Find Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main page — full composition in talentd section order.
   ────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FreeToolsSection />
      <QuickAccessSection />
      <LiveJobsSection />
      <InterviewPrepSection />
      <TrackerSection />
      <BottomCtaSection />
    </div>
  );
}
