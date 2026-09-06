import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, CheckCircle2, Circle, ExternalLink, Loader2, Map } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
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

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-accent" size={40} /></div>;

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Map size={48} className="text-ink-sec" />
        <p className="text-lg font-semibold text-ink">Couldn't load roadmap</p>
        <p className="text-sm text-ink-sec">{error}</p>
      </div>
    );
  }

  const total = phases.length;
  const phasesWithProgress = phases.map((phase) => ({ ...phase, progress: 0 }));
  const overall = 0;

  return (
    <div className="space-y-8">
      <SectionHeading title={title || `${career} Roadmap`} subtitle={`Your personalized learning path for ${career}.`} badge={<Badge tone="info" icon={<Map size={12} />}>AI-Generated</Badge>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="relative space-y-0 lg:col-span-2">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-accent/30 via-burgundy/15 to-transparent lg:block" />
          {phasesWithProgress.map((phase, i) => (
            <motion.div key={phase.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative pb-6">
              <div className="absolute left-[18px] top-6 z-10 hidden lg:block">
                {phase.progress >= 80 ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-ink-ter" />}
              </div>
              <Card hover className="lg:ml-14">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-ink">{phase.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-ink-sec"><Calendar size={12} /> {phase.duration}</p>
                  </div>
                  <Badge tone={phase.progress >= 80 ? 'success' : phase.progress >= 50 ? 'warning' : 'neutral'}>{phase.progress}%</Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar value={phase.progress} height={6} animated colorClass={phase.progress >= 80 ? 'from-accent-strong to-accent' : phase.progress >= 50 ? 'from-accent to-accent-strong' : 'from-burgundy/60 to-accent/60'} />
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
            <CircularProgress value={overall} size={120} strokeWidth={10} label="Overall" />
            <p className="mt-3 text-sm text-ink-sec">Keep going! You're on track.</p>
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
