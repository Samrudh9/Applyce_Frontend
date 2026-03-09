import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, Calendar, ExternalLink, Loader2, MapPin, Plus, Trash2, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
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

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.trackerList();
            setApps(res.applications);
            setStats(res.stats);
        } catch { /* */ }
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
        try {
            if (editId) {
                await api.trackerEdit(editId, form);
            } else {
                await api.trackerAdd(form);
            }
            setShowModal(false);
            await load();
        } catch { /* */ }
        setSaving(false);
    };

    const updateStatus = async (id: number, status: TrackerStatus) => {
        try { await api.trackerUpdateStatus(id, status); await load(); } catch { /* */ }
    };

    const deleteApp = async (id: number) => {
        if (!confirm('Delete this application?')) return;
        try { await api.trackerDelete(id); await load(); } catch { /* */ }
    };

    const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter);

    return (
        <div className="space-y-8">
            <SectionHeading title="Application Tracker" subtitle="Track and manage all your job applications in one place." />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                    { label: 'Total', value: stats.total, tone: 'info' as const },
                    { label: 'Applied', value: stats.applied, tone: 'info' as const },
                    { label: 'Interviewing', value: stats.interviewing, tone: 'warning' as const },
                    { label: 'Offered', value: stats.offered, tone: 'success' as const },
                    { label: 'Rejected', value: stats.rejected, tone: 'danger' as const },
                ].map((s) => (
                    <Card key={s.label} hover={false} className="text-center">
                        <p className="text-2xl font-bold text-text">{s.value}</p>
                        <Badge tone={s.tone} size="sm">{s.label}</Badge>
                    </Card>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilter('all')} className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-mint text-white' : 'border border-border bg-white text-muted hover:text-text'}`}>All</button>
                    {STATUSES.map((s) => (
                        <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-mint text-white' : 'border border-border bg-white text-muted hover:text-text'}`}>{s}</button>
                    ))}
                </div>
                <Button onClick={openAdd} size="sm"><Plus size={16} /> Add Application</Button>
            </div>

            {/* App list */}
            {loading ? (
                <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-mint" /></div>
            ) : filtered.length === 0 ? (
                <Card><p className="text-center text-muted py-8">No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}. Click "Add Application" to get started.</p></Card>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((a) => (
                            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                <Card hover>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 cursor-pointer" onClick={() => openEdit(a)}>
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-mint" />
                                                <h3 className="font-semibold text-text">{a.job_title}</h3>
                                            </div>
                                            <p className="mt-1 text-sm text-muted flex items-center gap-3 flex-wrap">
                                                <span className="flex items-center gap-1"><Building2 size={12} />{a.company}</span>
                                                {a.location && <span className="flex items-center gap-1"><MapPin size={12} />{a.location}</span>}
                                                <span className="flex items-center gap-1"><Calendar size={12} />{new Date(a.updated_at).toLocaleDateString()}</span>
                                            </p>
                                            {a.salary_range && <p className="mt-1 text-xs text-emerald-600">{a.salary_range}</p>}
                                            {a.notes && <p className="mt-1 text-xs text-muted line-clamp-1">{a.notes}</p>}
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value as TrackerStatus)} className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-medium text-text focus:border-mint focus:outline-none">
                                                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                            </select>
                                            <div className="flex gap-1">
                                                {a.job_url && <a href={a.job_url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-mint"><ExternalLink size={14} /></a>}
                                                <button onClick={() => deleteApp(a.id)} className="text-muted hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setShowModal(false)}>
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text">{editId ? 'Edit Application' : 'Add Application'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted hover:text-text"><X size={20} /></button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-text">Job Title *</label>
                                <Input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="e.g. Frontend Developer" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-text">Company *</label>
                                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-text">Location</label>
                                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-text">Salary Range</label>
                                    <Input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} placeholder="e.g. $80k-$100k" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-text">Job URL</label>
                                <Input value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-text">Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TrackerStatus })} className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30">
                                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-text">Notes</label>
                                <textarea className="w-full rounded-xl border border-border bg-white p-3 text-sm text-text placeholder:text-muted focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes..." />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button onClick={save} disabled={saving || !form.job_title.trim() || !form.company.trim()}>
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : editId ? 'Save Changes' : 'Add Application'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
