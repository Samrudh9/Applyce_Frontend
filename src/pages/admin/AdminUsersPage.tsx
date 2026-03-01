import { Eye, Search, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

const users = [
  { name: 'Jane Doe', email: 'jane@applyce.ai', joined: '2026-01-15', plan: 'Pro', status: 'Active' },
  { name: 'Rahul Sharma', email: 'rahul@gmail.com', joined: '2026-01-22', plan: 'Free', status: 'Active' },
  { name: 'Emily Chen', email: 'emily@outlook.com', joined: '2026-02-03', plan: 'Pro', status: 'Active' },
  { name: 'Alex Kim', email: 'alex@company.io', joined: '2026-02-10', plan: 'Enterprise', status: 'Inactive' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Badge tone="info">{users.length} users</Badge>
      </div>
      <Card>
        <Input label="Search users" placeholder="Search by name or email…" icon={<Search size={16} />} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-parchment/[0.06] text-xs uppercase tracking-wider text-stone">
                <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Plan</th><th className="pb-3">Status</th><th className="pb-3">Joined</th><th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-parchment/[0.04] transition-colors hover:bg-parchment/[0.02]">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td><Badge tone={u.plan === 'Enterprise' ? 'violet' : u.plan === 'Pro' ? 'info' : 'neutral'} size="sm">{u.plan}</Badge></td>
                  <td><Badge tone={u.status === 'Active' ? 'success' : 'danger'} size="sm">{u.status}</Badge></td>
                  <td className="text-muted">{u.joined}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="text-cyan hover:text-mint"><Eye size={16} /></button>
                      <button className="text-muted hover:text-danger"><Trash2 size={16} /></button>
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
