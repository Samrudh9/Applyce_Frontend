import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileText, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api, ApiError } from '../lib/api';
import type { AnalyzeResumeResponse, ResumeRecord, ResumeData, TemplateName } from '../types/api';

const templates: { value: TemplateName; label: string }[] = [
    { value: 'classic_ats', label: 'Classic ATS' },
    { value: 'minimal_ats', label: 'Minimal ATS' },
    { value: 'modern_ats', label: 'Modern ATS' },
];

const emptyData: ResumeData = {
    profile: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [], languages: [] },
};

export default function ResumeBuilderPage() {
    const location = useLocation();
    const routeState = location.state as { analysisResult?: AnalyzeResumeResponse } | null;

    const [resumes, setResumes] = useState<ResumeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [templateName, setTemplateName] = useState<TemplateName>('classic_ats');
    const [data, setData] = useState<ResumeData>(emptyData);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [techInput, setTechInput] = useState('');
    const [softInput, setSoftInput] = useState('');
    const [toolInput, setToolInput] = useState('');
    const [langInput, setLangInput] = useState('');
    const [prefilled, setPrefilled] = useState(false);

    useEffect(() => { loadResumes(); }, []);

    // Auto-fill from analysis result (when navigating from Result page "Fix in Resume Builder")
    useEffect(() => {
        if (prefilled || !routeState?.analysisResult) return;
        const r = routeState.analysisResult;
        setPrefilled(true);

        const prefillData: ResumeData = {
            profile: {
                name: r.name || '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
            },
            summary: '',
            experience: (r.experience ?? []).map((e) => ({
                company: '',
                title: e,
                start_date: '',
                end_date: '',
                description: '',
            })),
            education: (r.education ?? []).map((e) => ({
                institution: e,
                degree: '',
                start_date: '',
                end_date: '',
            })),
            projects: (r.projects ?? []).map((p) => ({
                name: p,
                description: '',
                link: '',
            })),
            skills: {
                technical: r.skills ?? [],
                soft: [],
                tools: [],
                languages: [],
            },
        };

        setTitle(`${r.name || 'My'}'s Resume`);
        setData(prefillData);
        setShowEditor(true);
    }, [routeState, prefilled]);

    const loadResumes = async () => {
        setLoading(true);
        try { const res = await api.resumeList(); setResumes(res.resumes); } catch { }
        finally { setLoading(false); }
    };

    const openNew = () => { setEditingId(null); setTitle(''); setTemplateName('classic_ats'); setData(emptyData); setError(''); setShowEditor(true); };
    const openEdit = (r: ResumeRecord) => { setEditingId(r.id); setTitle(r.title); setTemplateName(r.template_name); setData(r.data_json); setError(''); setShowEditor(true); };

    const handleSave = async () => {
        if (!title.trim()) { setError('Please enter a title.'); return; }
        setSaving(true); setError('');
        try {
            if (editingId) { const res = await api.resumeUpdate(editingId, { title, template_name: templateName, data }); setResumes((prev) => prev.map((r) => r.id === editingId ? res.resume : r)); }
            else { const res = await api.resumeCreate({ title, template_name: templateName, data }); setResumes((prev) => [res.resume, ...prev]); }
            setShowEditor(false);
        } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to save.'); }
        finally { setSaving(false); }
    };

    const handleExport = async (id: number) => {
        try { const blob = await api.resumeExportPdf(id); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `resume_${id}.pdf`; a.click(); URL.revokeObjectURL(url); } catch { }
    };

    const updateProfile = (key: string, value: string) => setData((d) => ({ ...d, profile: { ...d.profile, [key]: value } }));

    const addSkills = (category: keyof ResumeData['skills'], input: string, setter: (v: string) => void) => {
        const newSkills = input.split(',').map((s) => s.trim()).filter(Boolean);
        if (!newSkills.length) return;
        setData((d) => ({ ...d, skills: { ...d.skills, [category]: [...d.skills[category], ...newSkills] } }));
        setter('');
    };
    const removeSkill = (category: keyof ResumeData['skills'], index: number) => setData((d) => ({ ...d, skills: { ...d.skills, [category]: d.skills[category].filter((_, i) => i !== index) } }));
    const addExperience = () => setData((d) => ({ ...d, experience: [...d.experience, { company: '', title: '', start_date: '', end_date: '', description: '' }] }));
    const updateExperience = (index: number, key: string, value: string) => setData((d) => ({ ...d, experience: d.experience.map((e, i) => i === index ? { ...e, [key]: value } : e) }));
    const removeExperience = (index: number) => setData((d) => ({ ...d, experience: d.experience.filter((_, i) => i !== index) }));
    const addEducation = () => setData((d) => ({ ...d, education: [...d.education, { institution: '', degree: '', start_date: '', end_date: '' }] }));
    const updateEducation = (index: number, key: string, value: string) => setData((d) => ({ ...d, education: d.education.map((e, i) => i === index ? { ...e, [key]: value } : e) }));
    const removeEducation = (index: number) => setData((d) => ({ ...d, education: d.education.filter((_, i) => i !== index) }));
    const addProject = () => setData((d) => ({ ...d, projects: [...d.projects, { name: '', description: '', link: '' }] }));
    const updateProject = (index: number, key: string, value: string) => setData((d) => ({ ...d, projects: d.projects.map((p, i) => i === index ? { ...p, [key]: value } : p) }));
    const removeProject = (index: number) => setData((d) => ({ ...d, projects: d.projects.filter((_, i) => i !== index) }));

    const inputClass = 'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder-stone outline-none transition-colors focus:border-mint hover:border-border-hover';
    const labelClass = 'mb-1 block text-xs font-medium uppercase tracking-wider text-muted';

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <SectionHeading title="Resume Builder" subtitle="Build ATS-optimized resumes with AI assistance." badge={<Badge tone="info" icon={<FileText size={12} />}>Builder</Badge>} />
                <Button onClick={openNew}><Plus size={16} /> New Resume</Button>
            </div>

            {/* Editor Modal */}
            <AnimatePresence>
                {showEditor && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-sm" onClick={() => setShowEditor(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            <Card hover={false}>
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-text">{editingId ? 'Edit Resume' : 'New Resume'}</h3>
                                    <button onClick={() => setShowEditor(false)} className="rounded-full p-1 hover:bg-slate-100"><X size={18} /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className={labelClass}>Resume Title *</label><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Resume" /></div>
                                        <div><label className={labelClass}>Template</label><select className={inputClass} value={templateName} onChange={(e) => setTemplateName(e.target.value as TemplateName)}>{templates.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                    </div>
                                    <div>
                                        <h4 className="mb-3 font-semibold text-text">Profile</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div><label className={labelClass}>Full Name</label><input className={inputClass} value={data.profile.name} onChange={(e) => updateProfile('name', e.target.value)} placeholder="John Doe" /></div>
                                            <div><label className={labelClass}>Email</label><input className={inputClass} value={data.profile.email} onChange={(e) => updateProfile('email', e.target.value)} placeholder="john@example.com" /></div>
                                            <div><label className={labelClass}>Phone</label><input className={inputClass} value={data.profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} placeholder="+91 9876543210" /></div>
                                            <div><label className={labelClass}>Location</label><input className={inputClass} value={data.profile.location} onChange={(e) => updateProfile('location', e.target.value)} placeholder="Bangalore, India" /></div>
                                            <div><label className={labelClass}>LinkedIn</label><input className={inputClass} value={data.profile.linkedin ?? ''} onChange={(e) => updateProfile('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                                            <div><label className={labelClass}>GitHub</label><input className={inputClass} value={data.profile.github ?? ''} onChange={(e) => updateProfile('github', e.target.value)} placeholder="https://github.com/..." /></div>
                                        </div>
                                    </div>
                                    <div><label className={labelClass}>Professional Summary</label><textarea className={`${inputClass} min-h-[80px] resize-y`} value={data.summary} onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))} placeholder="Experienced software developer..." /></div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold text-text">Experience</h4><button onClick={addExperience} className="text-xs font-medium text-mint-dark hover:text-mint">+ Add</button></div>
                                        {data.experience.map((exp, i) => (
                                            <div key={i} className="mb-3 rounded-xl border border-border p-3 space-y-2">
                                                <div className="flex justify-between"><span className="text-xs text-muted">Experience {i + 1}</span><button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button></div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className={inputClass} value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company" />
                                                    <input className={inputClass} value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} placeholder="Job Title" />
                                                    <input className={inputClass} value={exp.start_date} onChange={(e) => updateExperience(i, 'start_date', e.target.value)} placeholder="Start Date" />
                                                    <input className={inputClass} value={exp.end_date} onChange={(e) => updateExperience(i, 'end_date', e.target.value)} placeholder="End Date" />
                                                </div>
                                                <textarea className={`${inputClass} min-h-[60px] resize-y`} value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} placeholder="Description..." />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold text-text">Education</h4><button onClick={addEducation} className="text-xs font-medium text-mint-dark hover:text-mint">+ Add</button></div>
                                        {data.education.map((edu, i) => (
                                            <div key={i} className="mb-3 rounded-xl border border-border p-3 space-y-2">
                                                <div className="flex justify-between"><span className="text-xs text-muted">Education {i + 1}</span><button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button></div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className={inputClass} value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" />
                                                    <input className={inputClass} value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" />
                                                    <input className={inputClass} value={edu.start_date} onChange={(e) => updateEducation(i, 'start_date', e.target.value)} placeholder="Start Year" />
                                                    <input className={inputClass} value={edu.end_date} onChange={(e) => updateEducation(i, 'end_date', e.target.value)} placeholder="End Year" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="mb-2 flex items-center justify-between"><h4 className="font-semibold text-text">Projects</h4><button onClick={addProject} className="text-xs font-medium text-mint-dark hover:text-mint">+ Add</button></div>
                                        {data.projects.map((proj, i) => (
                                            <div key={i} className="mb-3 rounded-xl border border-border p-3 space-y-2">
                                                <div className="flex justify-between"><span className="text-xs text-muted">Project {i + 1}</span><button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button></div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input className={inputClass} value={proj.name} onChange={(e) => updateProject(i, 'name', e.target.value)} placeholder="Project Name" />
                                                    <input className={inputClass} value={proj.link ?? ''} onChange={(e) => updateProject(i, 'link', e.target.value)} placeholder="Link (optional)" />
                                                </div>
                                                <textarea className={`${inputClass} min-h-[60px] resize-y`} value={proj.description} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="Description..." />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <h4 className="mb-3 font-semibold text-text">Skills</h4>
                                        {([
                                            { key: 'technical' as const, label: 'Technical', input: techInput, setter: setTechInput },
                                            { key: 'soft' as const, label: 'Soft Skills', input: softInput, setter: setSoftInput },
                                            { key: 'tools' as const, label: 'Tools', input: toolInput, setter: setToolInput },
                                            { key: 'languages' as const, label: 'Languages', input: langInput, setter: setLangInput },
                                        ]).map(({ key, label, input, setter }) => (
                                            <div key={key} className="mb-3">
                                                <label className={labelClass}>{label}</label>
                                                <div className="flex gap-2">
                                                    <input className={inputClass} value={input} onChange={(e) => setter(e.target.value)} placeholder="Comma-separated skills" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkills(key, input, setter); } }} />
                                                    <button onClick={() => addSkills(key, input, setter)} className="shrink-0 rounded-xl bg-mint/10 px-3 text-xs font-medium text-mint-dark hover:bg-mint/20">Add</button>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {data.skills[key].map((s, idx) => (
                                                        <span key={idx} className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs text-text">
                                                            {s}<button onClick={() => removeSkill(key, idx)} className="text-red-400 hover:text-red-500"><X size={10} /></button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" onClick={() => setShowEditor(false)}>Cancel</Button>
                                        <Button onClick={handleSave} disabled={saving}>
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            {saving ? 'Saving…' : editingId ? 'Update Resume' : 'Create Resume'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-mint" size={40} /></div>}

            {!loading && resumes.length === 0 && (
                <Card hover={false} className="py-16 text-center">
                    <FileText size={48} className="mx-auto text-muted" />
                    <p className="mt-4 text-lg font-semibold text-text">No resumes yet</p>
                    <p className="mt-1 text-sm text-muted">Create your first ATS-optimized resume.</p>
                    <Button onClick={openNew} className="mt-6"><Plus size={16} /> Create Resume</Button>
                </Card>
            )}

            {!loading && resumes.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((r, i) => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                            <Card>
                                <div className="mb-3 flex items-center gap-2"><FileText size={18} className="text-mint" /><h3 className="font-semibold text-text">{r.title}</h3></div>
                                <Badge tone="info" size="sm">{r.template_name.replace(/_/g, ' ')}</Badge>
                                <p className="mt-2 text-xs text-muted">Created: {new Date(r.created_at).toLocaleDateString()}{r.updated_at !== r.created_at && ` · Updated: ${new Date(r.updated_at).toLocaleDateString()}`}</p>
                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
                                    <Button size="sm" variant="outline" onClick={() => handleExport(r.id)}><Download size={14} /> PDF</Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
