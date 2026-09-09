import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, FileText, Loader2, Mail, Plus, X } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api, ApiError } from '../lib/api';
import type { CoverLetterRecord, CoverLetterTone, CoverLetterLength } from '../types/api';

const tones: CoverLetterTone[] = ['formal', 'friendly', 'confident'];
const lengths: CoverLetterLength[] = ['short', 'normal', 'long'];

export default function CoverLetterPage() {
    const [letters, setLetters] = useState<CoverLetterRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [tone, setTone] = useState<CoverLetterTone>('formal');
    const [length, setLength] = useState<CoverLetterLength>('normal');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<CoverLetterRecord | null>(null);

    useEffect(() => { loadLetters(); }, []);

    const loadLetters = async () => {
        setLoading(true);
        try { const res = await api.coverLetterList(); setLetters(res.cover_letters); } catch { }
        finally { setLoading(false); }
    };

    const handleGenerate = async () => {
        if (!jobTitle.trim() || !company.trim() || !jobDesc.trim()) { setError('Please fill in Job Title, Company, and Job Description.'); return; }
        setGenerating(true); setError('');
        try {
            const res = await api.coverLetterGenerate({ job_title: jobTitle.trim(), company: company.trim(), job_url: jobUrl.trim(), job_description: jobDesc.trim(), tone, length });
            setLetters((prev) => [res.cover_letter, ...prev]);
            setShowForm(false); setSelected(res.cover_letter);
            setJobTitle(''); setCompany(''); setJobUrl(''); setJobDesc('');
        } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to generate cover letter.'); }
        finally { setGenerating(false); }
    };

    const handleExportPdf = async (id: number) => {
        try {
            const blob = await api.coverLetterExportPdf(id);
            const url = URL.createObjectURL(blob); const a = document.createElement('a');
            a.href = url; a.download = `cover_letter_${id}.pdf`; a.click(); URL.revokeObjectURL(url);
        } catch { }
    };

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    const inputClass = 'w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-ter outline-none transition-colors focus:border-accent hover:border-line-strong';

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionHeading title="Cover Letters" subtitle="Get a tailored cover letter draft for any role — ready to edit and send." badge={<Badge tone="info" icon={<Mail size={12} />}>AI-Generated</Badge>} />
                <Button onClick={() => setShowForm(true)}><Plus size={16} /> New Cover Letter</Button>
            </div>

            {/* Generate Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <Card hover={false}>
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-ink">Generate Cover Letter</h3>
                                    <button onClick={() => setShowForm(false)} className="rounded-full p-1 hover:bg-elevated"><X size={18} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Job Title *</label><input type="text" className={inputClass} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer" /></div>
                                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Company *</label><input type="text" className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Acme Corp" /></div>
                                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Job URL (optional)</label><input type="url" className={inputClass} value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://example.com/job-listing" /></div>
                                    <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Job Description *</label><textarea className={`${inputClass} min-h-[100px] resize-y`} value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste the job description here..." /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Tone</label><select className={inputClass} value={tone} onChange={(e) => setTone(e.target.value as CoverLetterTone)}>{tones.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
                                        <div><label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-sec">Length</label><select className={inputClass} value={length} onChange={(e) => setLength(e.target.value as CoverLetterLength)}>{lengths.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}</select></div>
                                    </div>
                                    {error && <p className="text-sm text-danger">{error}</p>}
                                    <Button onClick={handleGenerate} disabled={generating} className="w-full">
                                        {generating ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                        {generating ? 'Generating…' : 'Generate Cover Letter'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <Card hover={false}>
                                <div className="mb-4 flex items-center justify-between">
                                    <div><h3 className="text-xl font-bold text-ink">{selected.job_title}</h3><p className="text-sm text-ink-sec">{selected.company}</p></div>
                                    <button onClick={() => setSelected(null)} className="rounded-full p-1 hover:bg-elevated"><X size={18} /></button>
                                </div>
                                <div className="flex gap-2 mb-4"><Badge tone="info">{selected.tone}</Badge><Badge tone="neutral">{selected.length}</Badge></div>
                                <div className="rounded-xl border border-line bg-elevated p-5 text-sm leading-relaxed whitespace-pre-wrap text-ink">{selected.body_text}</div>
                                <div className="mt-4 flex gap-3">
                                    <Button size="sm" onClick={() => copyToClipboard(selected.body_text)}><Copy size={14} /> Copy</Button>
                                    <Button size="sm" variant="outline" onClick={() => handleExportPdf(selected.id)}><Download size={14} /> PDF</Button>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading cover letters">
                    {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={3} />)}
                </div>
            )}

            {!loading && letters.length === 0 && (
                <Card hover={false} className="py-16 text-center">
                    <Mail size={48} className="mx-auto text-ink-sec" />
                    <p className="mt-4 text-lg font-semibold text-ink">No cover letters yet</p>
                    <p className="mt-1 text-sm text-ink-sec">Generate your first draft — it's ready to personalize in minutes.</p>
                    <Button onClick={() => setShowForm(true)} className="mt-6"><Plus size={16} /> Create One</Button>
                </Card>
            )}

            {!loading && letters.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {letters.map((letter, i) => (
                        <motion.div key={letter.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card className="cursor-pointer" onClick={() => setSelected(letter)}>
                                <div className="mb-3 flex items-center gap-2">
                                    <FileText size={18} className="text-accent" />
                                    <h3 className="font-semibold text-ink">{letter.job_title}</h3>
                                </div>
                                <p className="text-sm text-ink-sec">{letter.company}</p>
                                <div className="mt-3 flex gap-2"><Badge tone="info" size="sm">{letter.tone}</Badge><Badge tone="neutral" size="sm">{letter.length}</Badge></div>
                                <p className="mt-3 text-xs text-ink-sec">{new Date(letter.created_at).toLocaleDateString()}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
