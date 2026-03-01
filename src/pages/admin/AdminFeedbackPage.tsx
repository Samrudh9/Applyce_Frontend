import { Star } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const feedback = [
  { user: 'Jane Doe', rating: 4, comment: 'Loved the ATS analysis depth. Very detailed and actionable.', date: '2026-02-18' },
  { user: 'Rahul Sharma', rating: 5, comment: 'Roadmap is super actionable. Already started learning the suggested skills.', date: '2026-02-16' },
  { user: 'Emily Chen', rating: 5, comment: 'Best career tool I have used. The AI recommendations are spot on!', date: '2026-02-14' },
  { user: 'Alex Kim', rating: 3, comment: 'Good tool but would love more enterprise features.', date: '2026-02-12' },
];

export default function AdminFeedbackPage() {
  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <div className="flex items-center gap-2">
          <Star size={16} className="fill-warning text-warning" />
          <span className="font-bold text-warning">{avgRating}</span>
          <span className="text-sm text-muted">avg ({feedback.length} reviews)</span>
        </div>
      </div>
      <div className="space-y-4">
        {feedback.map((f) => (
          <Card key={f.user + f.date}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold">{f.user}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < f.rating ? 'fill-warning text-warning' : 'text-parchment/10'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted">"{f.comment}"</p>
              </div>
              <Badge tone="neutral" size="sm">{f.date}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
