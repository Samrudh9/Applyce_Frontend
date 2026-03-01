import { Download, Eye } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

const resumes = [
  { user: 'Jane Doe', file: 'resume_v4.pdf', score: 88, grade: 'A', date: '2026-02-10' },
  { user: 'Rahul Sharma', file: 'rahul_resume.pdf', score: 72, grade: 'B', date: '2026-02-08' },
  { user: 'Emily Chen', file: 'emily_cv_2026.docx', score: 91, grade: 'A', date: '2026-02-05' },
  { user: 'Alex Kim', file: 'alex_resume.pdf', score: 65, grade: 'C', date: '2026-02-01' },
];

export default function AdminResumesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <Badge tone="info">{resumes.length} analyzed</Badge>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-parchment/[0.06] text-xs uppercase tracking-wider text-stone">
                <th className="pb-3">User</th><th className="pb-3">File</th><th className="pb-3">Score</th><th className="pb-3">Grade</th><th className="pb-3">Date</th><th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((r) => (
                <tr key={r.file} className="border-t border-parchment/[0.04] transition-colors hover:bg-parchment/[0.02]">
                  <td className="py-3 font-medium">{r.user}</td>
                  <td className="text-muted">{r.file}</td>
                  <td><Badge tone={r.score >= 85 ? 'success' : r.score >= 70 ? 'warning' : 'danger'} size="sm">{r.score}</Badge></td>
                  <td><Badge tone={r.grade === 'A' ? 'success' : r.grade === 'B' ? 'warning' : 'danger'} size="sm">{r.grade}</Badge></td>
                  <td className="text-muted">{r.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="text-cyan hover:text-mint"><Eye size={16} /></button>
                      <button className="text-stone hover:text-parchment"><Download size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
