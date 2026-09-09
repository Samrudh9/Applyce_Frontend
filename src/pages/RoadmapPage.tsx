import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle2, ExternalLink, Map, RotateCcw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Skeleton, SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import type { RoadmapPhase } from '../types/api';

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const career = searchParams.get('career') ?? 'Data Scientist';
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    api.roadmap(career)
      .then((res) => {
        if (!res?.roadmap) throw new Error('No roadmap data returned from server.');
        setPhases(res.roadmap.phases ?? []);
        setTitle(res.roadmap.title ?? '');
      })
      .catch((err) => setError(err.message ?? 'Failed to load roadmap.'))
      .finally(() => setLoading(false));
  }, [career]);

  if (loading) {
    return (
      <div className="space-y-8" aria-busy="true" aria-label="Loading roadmap">
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={4} />)}
          </div>
          <div className="space-y-4">
            <SkeletonCard lines={3} />
            <SkeletonCard lines={2} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Map size={48} className="text-ink-sec" />
        <p className="text-lg font-semibold text-ink">Couldn't load roadmap</p>
        <p className="text-sm text-ink-sec">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
          <RotateCcw size={16} /> Try again
        </Button>
      </div>
    );
  }

  const total = phases.length;

  return (
    <div className="space-y-8">
      <SectionHeading title={title || `${career} Roadmap`} subtitle={`Your step-by-step plan to get there — skills, resources, and timelines.`} badge={<Badge tone="info" icon={<Map size={12} />}>AI-Generated</Badge>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="relative space-y-0 lg:col-span-2">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-accent/30 via-burgundy/15 to-transparent lg:block" />
          {phases.map((phase, i) => (
            <motion.div key={phase.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative pb-6">
              <div className="absolute left-[18px] top-6 z-10 hidden lg:block">
                <CheckCircle2 size={16} className="text-accent" />
              </div>
              <Card hover className="lg:ml-14">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-ink">{phase.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-ink-sec"><Calendar size={12} /> {phase.duration}</p>
                  </div>
                  <Badge tone="neutral">Phase {i + 1} of {total}</Badge>
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-sec">Skills</p>
                    <div className="flex flex-wrap gap-1.5">{phase.skills.map((s) => <Badge key={s} tone="info" size="sm">{s}</Badge>)}</div>
                  </div>
                  {phase.resources && phase.resources.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-sec">Learning Resources</p>
                      <div className="space-y-1.5">
                        {phase.resources.map((r) => (
                          <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 transition-all hover:border-accent/20 hover:bg-accent/[0.04]"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <ExternalLink size={12} className="shrink-0 text-ink-sec group-hover:text-accent transition-colors" />
                              <span className="truncate text-xs font-medium text-ink group-hover:text-accent transition-colors">{r.name}</span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              <Badge tone="neutral" size="sm">{r.platform}</Badge>
                              <Badge tone={r.type === 'free' ? 'success' : 'warning'} size="sm">{r.type.toUpperCase()}</Badge>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="space-y-4">
          <Card hover={false} className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
              <Map size={36} className="text-accent-strong" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">{total}</h3>
            <p className="text-sm text-ink-sec">Learning phases to get there</p>
            <p className="mt-4 text-sm text-ink-sec">Work through each phase top-to-bottom, and you'll be ready for the role.</p>
          </Card>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-bold text-ink"><BookOpen size={16} className="text-accent" /> Career</h3>
            <p className="text-lg font-semibold text-accent-strong">{career}</p>
            <p className="mt-1 text-xs text-ink-sec">{phases.length} learning phases</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
