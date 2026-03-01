import { Activity, CheckCircle2, Clock, Cpu, Database, Globe, HardDrive, Server } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

const services = [
  { icon: Database, name: 'Database', status: 'Healthy', metric: '99.99% uptime', ok: true },
  { icon: Server, name: 'Application Server', status: 'Nominal', metric: '38ms avg latency', ok: true },
  { icon: Globe, name: 'API Gateway', status: 'Operational', metric: 'All endpoints up', ok: true },
  { icon: HardDrive, name: 'Storage', status: 'Healthy', metric: '42% used', ok: true },
];

const metrics = [
  { label: 'CPU Usage', value: 34 },
  { label: 'Memory', value: 58 },
  { label: 'Disk I/O', value: 22 },
  { label: 'Network', value: 41 },
];

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">System Health</h1>
        <Badge tone="success" icon={<Activity size={12} />}>All Systems Operational</Badge>
      </div>

      {/* Services */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <Card key={svc.name}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-parchment/5">
                  <Icon size={18} className="text-cyan" />
                </div>
                <div>
                  <p className="text-xs text-muted">{svc.name}</p>
                  <p className="font-semibold">{svc.status}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-xs text-muted">{svc.metric}</span>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Resource metrics */}
      <Card>
        <h2 className="mb-5 text-lg font-bold">Resource Utilization</h2>
        <div className="space-y-4">
          {metrics.map((m) => (
            <ProgressBar key={m.label} label={m.label} value={m.value} showValue animated colorClass={m.value > 75 ? 'from-danger to-warning' : m.value > 50 ? 'from-warning to-cyan' : 'from-cyan to-mint'} />
          ))}
        </div>
      </Card>

      {/* Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Cpu size={16} className="text-cyan" /> Environment</h3>
          <div className="space-y-2 text-sm text-muted">
            <p>Python <strong className="text-parchment">3.11.8</strong></p>
            <p>Flask <strong className="text-parchment">3.0.2</strong></p>
            <p>Node <strong className="text-parchment">20.11.1</strong></p>
            <p>OS: <strong className="text-parchment">Ubuntu 22.04 LTS</strong></p>
          </div>
        </Card>
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Clock size={16} className="text-violet" /> Uptime</h3>
          <p className="text-3xl font-bold text-success">99.99%</p>
          <p className="mt-1 text-sm text-muted">Last restart: 14 days ago</p>
          <p className="text-sm text-muted">Current session: 336 hours</p>
        </Card>
      </div>
    </div>
  );
}
