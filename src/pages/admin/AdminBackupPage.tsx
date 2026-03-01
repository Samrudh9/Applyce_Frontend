import { CheckCircle2, Clock, Database, Download, RotateCcw } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const backups = [
  { date: '2026-02-19 09:10 UTC', size: '24.8 MB', status: 'success' },
  { date: '2026-02-18 09:10 UTC', size: '24.2 MB', status: 'success' },
  { date: '2026-02-17 09:10 UTC', size: '23.9 MB', status: 'success' },
];

export default function AdminBackupPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Backup & Restore</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10"><CheckCircle2 size={18} className="text-success" /></div>
            <div><p className="text-xs text-muted">Last Backup</p><p className="font-semibold">19 Feb 2026</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10"><Database size={18} className="text-cyan" /></div>
            <div><p className="text-xs text-muted">Total Size</p><p className="font-semibold">72.9 MB</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/10"><Clock size={18} className="text-violet" /></div>
            <div><p className="text-xs text-muted">Next Scheduled</p><p className="font-semibold">Tomorrow 09:10</p></div>
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button><Database size={16} /> Create Backup Now</Button>
        <Button variant="secondary"><RotateCcw size={16} /> Restore</Button>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-bold">Backup History</h2>
        <div className="space-y-2">
          {backups.map((b) => (
            <div key={b.date} className="flex items-center justify-between rounded-lg border border-parchment/[0.04] bg-parchment/[0.02] px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-success" />
                <span>{b.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted">{b.size}</span>
                <Badge tone="success" size="sm">Success</Badge>
                <button className="text-cyan hover:text-mint"><Download size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
