import { useCallback, useEffect, useState } from 'react';
import { Briefcase, Building2, Calendar, ExternalLink, MapPin, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { Input } from '../components/ui/Input';
import { api } from '../lib/api';
import type { TrackerApplication, TrackerStats, TrackerStatus } from '../types/api';

const STATUS_CONFIG: Record<TrackerStatus, { label: string; tone: 'info' | 'warning' | 'success' | 'danger' | 'default' }> = {
    applied: { label: 'Applied', tone: 'info' },
    interviewing: { label: 'Interviewing', tone: 'warning' },
    offered: { label: 'Offered', tone: 'success' },
    rejected: { label: 'Rejected', tone: 'danger' },
    withdrawn: { label: 'Withdrawn', tone: 'default' },
};

const STATUSES: TrackerStatus[] = ['applied', 'interviewing', 'offered', 'rejected', 'withdrawn'];

export default function ApplicationTrackerPage() {
    const [apps, setApps] = useState<TrackerApplication[]>([]);
    const [stats, setStats] = useState<TrackerStats>({ total: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState({ job_title: '', company: '', location: '', job_url: '', salary_range: '', notes: '', status: 'applied' as TrackerStatus });
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState<TrackerStatus | 'all'>('all');
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.trackerList();
            setApps(res.applications);
            setStats(res.stats);
        } catch { setError('We couldn\'t load your applications right now.'); }
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const openAdd = () => {
        setEditId(null);
        setForm({ job_title: '', company: '', location: '', job_url: '', salary_range: '', notes: '', status: 'applied' });
        setShowModal(true);
    };

    const openEdit = (app: TrackerApplication) => {
        setEditId(app.id);
        setForm({ job_title: app.job_title, company: app.company, location: app.location ?? '', job_url: app.job_url ?? '', salary_range: app.salary_range ?? '', notes: app.notes ?? '', status: app.status });
        setShowModal(true);
    };

    const save = async () => {
        setSaving(true);
        setError(null);
        try {
            if (editId) {
                await api.trackerEdit(editId, form);
            } else {
                await api.trackerAdd(form);
            }
            setShowModal(false);
            await load();
        } catch { setError('We couldn\'t save that application. Try again.'); }
        setSaving(false);
    };

    const updateStatus = async (id: number, status: TrackerStatus) => {
        try { await api.trackerUpdateStatus(id, status); await load(); } catch { setError('We couldn\'t update that status. Try again.'); }
    };

    const deleteApp = async (id: number) => {
        if (!confirm('Delete this application? This can\'t be undone.')) return;
        try { await api.trackerDelete(id); await load(); } catch { setError('We couldn\'t delete that application. Try again.'); }
    };

    const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

    return (
        <div className="space-y-6 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* ── Header ── */}
                <div className="mb-6">
                    <h1 className="font-display text-display-md font-semibold tracking-tight text-ink">Application Tracker</h1>
                    <p className="mt-1 text-sm text-ink-sec">Every application, one place — status, notes, and follow-ups.</p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {[
                        { label: 'Total', value: stats.total },
                        { label: 'Applied', value: stats.applied },
                        { label: 'Interviewing', value: stats.interviewing },
                        { label: 'Offered', value: stats.offered },
                        { label: 'Rejected', value: stats.rejected },
                    ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-line bg-surface px-4 py-3 text-center">
                            <p className="text-xl font-bold text-ink">{s.value}</p>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-ter">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Controls ── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setFilter('all')} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-ink text-canvas' : 'border border-line bg-surface text-ink-sec hover:text-ink'}`}>All</button>
                        {STATUSES.map((s) => (
                            <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-ink text-canvas' : 'border border-line bg-surface text-ink-sec hover:text-ink'}`}>{s}</button>
                        ))}
                    </div>
                    <Button onClick={openAdd} size="sm"><Plus size={16} /> Add Application</Button>
                </div>

                {/* ── Error banner ── */}
                {error && (
                    <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3">
                        <span className="text-sm text-danger">{error}</span>
                        <Button variant="danger" size="sm" onClick={load}><RotateCcw size={14} /> Retry</Button>
                    </div>
                )}

                {/* ── Loading ── */}
                {loading ? (
                    <div className="space-y-2" aria-busy="true" aria-label="Loading applications">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3">
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : !error && filtered.length === 0 ? (
                    /* ── Empty state ── */
                    <div className="rounded-xl border border-line bg-surface px-4 py-10 text-center">
                        <Briefcase size={32} className="mx-auto text-ink-ter" />
                        <p className="mt-3 text-sm font-semibold text-ink">
                            {filter !== 'all'
                                ? `No ${filter} applications right now`
                                : 'Nothing tracked yet'}
                        </p>
                        <p className="mt-1 text-xs text-ink-sec">
                            {filter !== 'all'
                                ? 'Try another filter or add a new application.'
                                : 'Add your first application and never lose a follow-up.'}
                        </p>
                        {filter === 'all' && (
                            <Button size="sm" className="mt-4" onClick={openAdd}><Plus size={14} /> Add Application</Button>
                        )}
                    </div>
                ) : !error && (
                    /* ── Application list ── */
                    <div className="space-y-1.5">
                        {filtered.map((a) => (
                            <div key={a.id} className="flex items-start gap-4 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/20 hover:bg-accent/[0.02]">
                                <div className="flex-1 cursor-pointer min-w-0" onClick={() => openEdit(a)}>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={14} className="shrink-0 text-accent-strong" />
                                        <h3 className="truncate text-sm font-semibold text-ink">{a.job_title}</h3>
                                    </div>
                                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-sec">
                                        <span className="inline-flex items-center gap-1"><Building2 size={11} />{a.company}</span>
                                        {a.location && <span className="inline-flex items-center gap-1"><MapPin size={11} />{a.location}</span>}
                                        <span className="inline-flex items-center gap-1"><Calendar size={11} />{new Date(a.updated_at).toLocaleDateString()}</span>
                                    </p>
                                    {a.salary_range && <p className="mt-1 text-xs text-success">{a.salary_range}</p>}
                                    {a.notes && <p className="mt-1 text-xs text-ink-sec line-clamp-1">{a.notes}</p>}
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value as TrackerStatus)} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium text-ink focus:border-accent focus:outline-none">
                                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                    </select>
                                    <div className="flex gap-0.5">
                                        {a.job_url && <a href={a.job_url} target="_blank" rel="noopener noreferrer" className="rounded p-1 text-ink-sec hover:text-accent-strong"><ExternalLink size={13} /></a>}
                                        <button onClick={() => deleteApp(a.id)} className="rounded p-1 text-ink-sec hover:text-danger"><Trash2 size={13} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Add / Edit Modal ── */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
                        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-ink">{editId ? 'Edit Application' : 'Add Application'}</h2>
                                <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-ink-ter hover:bg-elevated hover:text-ink"><X size={20} /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-ink">Job Title *</label>
                                    <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Frontend Developer" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-ink">Company *</label>
                                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-ink">Location</label>
                                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bengaluru" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-ink">Salary Range</label>
                                        <Input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="e.g. ₹8L-₹10L" />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-ink">Job URL</label>
                                    <Input value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} placeholder="https://example.com/job-listing" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-ink">Status</label>
                                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TrackerStatus })} className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
                                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-ink">Notes</label>
                                    <textarea className="w-full rounded-lg border border-line bg-surface p-3 text-sm text-ink placeholder:text-ink-sec focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Interviews, follow-ups, or recruiter details..." />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button onClick={save} disabled={saving || !form.job_title.trim() || !form.company.trim()}>
                                        {saving ? 'Saving…' : editId ? 'Save Changes' : 'Add Application'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
