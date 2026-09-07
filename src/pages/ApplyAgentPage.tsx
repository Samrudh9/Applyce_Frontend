import { useEffect, useState } from 'react';
import { Bot, Briefcase, Building2, CheckCircle2, ClipboardCopy, FileText, ExternalLink, Gauge, Link2, Loader2, MapPin, Save, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { ApplicationDraft } from '../types/api';

const inputCls = 'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-ter outline-none transition-all focus:border-accent';

export default function ApplyAgentPage() {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [preparingErr, setPreparingErr] = useState<string | null>(null);

  const [draft, setDraft] = useState<ApplicationDraft | null>(null);
  const [drafts, setDrafts] = useState<ApplicationDraft[]>([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [appMessage, setAppMessage] = useState('');
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [availability, setAvailability] = useState('Immediately');
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [copied, setCopied] = useState<'letter' | 'message' | null>(null);

  useEffect(() => {
    api.applyDrafts().then((res) => setDrafts(res.drafts)).catch(() => null);
  }, []);

  const syncDraftToState = (d: ApplicationDraft) => {
    setDraft(d);
    setCoverLetter(d.cover_letter ?? '');
    setAppMessage(d.application_message ?? '');
    setSalaryExpectation(d.extra_fields?.salary_expectation ?? '');
    setAvailability(d.extra_fields?.availability ?? 'Immediately');
  };

  const prepare = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      setPreparingErr('Job title and company are required.');
      return;
    }
    setPreparing(true);
    setPreparingErr(null);
    try {
      const res = await api.applyPrepare({
        job_title: jobTitle.trim(),
        company: company.trim(),
        location: location.trim() || undefined,
        url: jobUrl.trim() || undefined,
        description: description.trim() || undefined,
        required_skills: requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      syncDraftToState(res.draft);
      setDrafts((prev) => [res.draft, ...prev.filter((d) => d.id !== res.draft.id)]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to prepare the application draft.';
      setPreparingErr(msg.includes('resume') ? 'No resume found. Upload your resume first so the agent can tailor your application.' : msg);
    } finally {
      setPreparing(false);
    }
  };

  const saveDraft = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await api.applyDraftUpdate(draft.id, {
        cover_letter: coverLetter,
        application_message: appMessage,
        extra_fields: { salary_expectation: salaryExpectation, availability },
      });
      syncDraftToState(res.draft);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const applyNow = async () => {
    if (!draft) return;
    setApplying(true);
    try {
      const res = await api.applyDraftSubmit(draft.id);
      if (res.job_url) window.open(res.job_url, '_blank', 'noopener,noreferrer');
      setDraft(res.draft);
      setDrafts((prev) => prev.map((d) => (d.id === res.draft.id ? res.draft : d)));
    } finally {
      setApplying(false);
    }
  };

  const copyText = async (kind: 'letter' | 'message') => {
    const text = kind === 'letter' ? coverLetter : appMessage;
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        title="Apply Agent"
        subtitle="Paste a job, get a tailored cover letter and application message, then apply with confidence."
        badge={<Badge tone="violet" icon={<Bot size={12} />}>Draft-first</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Job details form ── */}
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink"><Briefcase size={18} className="text-accent-strong" /> Job details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Job title *" placeholder="e.g. Machine Learning Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            <Input label="Company *" placeholder="e.g. Acme Corp" icon={<Building2 size={15} />} value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label="Location" placeholder="e.g. Bengaluru" icon={<MapPin size={15} />} value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input label="Job URL" placeholder="https://your-company.com/careers/role" icon={<Link2 size={15} />} value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-ink">Job description <span className="text-ink-sec">(optional, helps tailoring)</span></label>
            <textarea className={`${inputCls} min-h-[90px] resize-y`} placeholder="Paste the job description here…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mt-4">
            <Input label="Required skills" placeholder="Python, AWS, SQL" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} />
          </div>
          <Button className="mt-5 w-full" onClick={prepare} disabled={preparing}>
            {preparing ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
            {preparing ? 'Preparing your application…' : 'Prepare Application'}
          </Button>
          {preparingErr && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{preparingErr}</p>}
        </Card>

        {/* ── Draft panel ── */}
        <Card>
          {!draft ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText size={40} className="text-ink-sec" />
              <p className="mt-3 text-sm text-ink-sec">No draft yet — add the job details above and we'll prep your application.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-ink">{draft.job_title}</h2>
                  <p className="text-sm text-ink-sec">{draft.company}{draft.location ? ` · ${draft.location}` : ''}</p>
                </div>
                <div className="flex gap-2">
                  {draft.match_score != null && <Badge tone="info" icon={<Gauge size={10} />}>{draft.match_score}% fit</Badge>}
                  <Badge tone={draft.status === 'applied' ? 'success' : 'neutral'}>{draft.status}</Badge>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-ink">Cover letter</label>
                  <button onClick={() => copyText('letter')} className="flex items-center gap-1 text-xs font-medium text-accent-strong hover:underline">
                    {copied === 'letter' ? <CheckCircle2 size={12} /> : <ClipboardCopy size={12} />}
                    {copied === 'letter' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea className={`${inputCls} min-h-[160px] resize-y leading-relaxed`} value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-ink">Application message</label>
                  <button onClick={() => copyText('message')} className="flex items-center gap-1 text-xs font-medium text-accent-strong hover:underline">
                    {copied === 'message' ? <CheckCircle2 size={12} /> : <ClipboardCopy size={12} />}
                    {copied === 'message' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <textarea className={`${inputCls} min-h-[110px] resize-y leading-relaxed`} value={appMessage} onChange={(e) => setAppMessage(e.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Salary expectation" placeholder="e.g. ₹12L" value={salaryExpectation} onChange={(e) => setSalaryExpectation(e.target.value)} />
                <Input label="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={saveDraft} disabled={saving}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                </Button>
                <Button size="sm" onClick={applyNow} disabled={applying || draft.status === 'applied'}>
                  {applying ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {draft.status === 'applied' ? 'Applied' : "I applied — open job & mark it"}
                </Button>
                {draft.status === 'applied' && draft.job_url && (
                  <a href={draft.job_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm"><ExternalLink size={14} /> Reopen job</Button>
                  </a>
                )}
              </div>
              <p className="text-xs text-ink-sec">
                When you’re ready, "I applied — open job" opens the listing in a new tab where you complete the final submission — the agent never sends on your behalf.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* ── Draft history ── */}
      {drafts.length > 0 && (
        <Card>
          <h2 className="mb-3 text-lg font-bold text-ink">Prepared applications</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {drafts.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button
                  onClick={() => syncDraftToState(d)}
                  className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">{d.job_title}</p>
                    <Badge tone={d.status === 'applied' ? 'success' : 'neutral'} size="sm">{d.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-sec">{d.company}{d.location ? ` · ${d.location}` : ''}</p>
                </button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}