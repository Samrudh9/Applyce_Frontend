import { useEffect, useState } from 'react';
import { Award, Copy, Loader2, Share2, Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { ScorecardData } from '../types/api';

export default function ScorecardPage() {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<ScorecardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // If viewing a shared scorecard
    useEffect(() => {
        if (token) {
            api.scorecardGet(token)
                .then((res) => { setData(res.scorecard); setShareUrl(window.location.href); })
                .catch((err) => setError(err.message ?? 'Scorecard not found'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const generateShareLink = async () => {
        setGenerating(true);
        try {
            const res = await api.scorecardCreate();
            setShareUrl(res.share_url);
            // Load the scorecard data
            const sc = await api.scorecardGet(res.share_token);
            setData(sc.scorecard);
        } catch (err) {
            setError((err as Error).message ?? 'Failed to generate scorecard');
        }
        setGenerating(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 size={40} className="animate-spin text-mint" /></div>;
    if (error) return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <Trophy size={48} className="text-muted" />
            <p className="text-lg font-semibold text-text">Scorecard Not Found</p>
            <p className="text-sm text-muted">{error}</p>
        </div>
    );

    // Generate page — no token in URL
    if (!token && !data) {
        return (
            <div className="space-y-8">
                <SectionHeading title="Shareable Score Card" subtitle="Generate a public link to share your resume score with employers or peers." />
                <Card hover={false} className="flex flex-col items-center text-center py-12">
                    <Share2 size={48} className="text-mint mb-4" />
                    <h2 className="text-xl font-bold text-text">Create Your Score Card</h2>
                    <p className="mt-2 max-w-md text-sm text-muted">Generate a shareable link for your latest resume analysis. Anyone with the link can view your score, skills, and career predictions.</p>
                    <Button onClick={generateShareLink} disabled={generating} className="mt-6">
                        {generating ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Award size={16} /> Generate Score Card</>}
                    </Button>
                    {shareUrl && (
                        <div className="mt-6 w-full max-w-lg">
                            <div className="flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/5 p-3">
                                <input readOnly value={shareUrl} className="flex-1 bg-transparent text-sm text-text outline-none" />
                                <Button size="sm" variant="secondary" onClick={copyLink}>
                                    <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-8">
            <SectionHeading title="Resume Score Card" subtitle="Public resume performance overview" badge={<Badge tone="success" icon={<Trophy size={12} />}>Score {data.overall_score}</Badge>} />

            {/* Share URL */}
            {shareUrl && (
                <div className="flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/5 p-3">
                    <Share2 size={16} className="text-mint shrink-0" />
                    <input readOnly value={shareUrl} className="flex-1 bg-transparent text-sm text-text outline-none" />
                    <Button size="sm" variant="secondary" onClick={copyLink}><Copy size={14} /> {copied ? 'Copied!' : 'Copy'}</Button>
                </div>
            )}

            {/* Score */}
            <Card hover={false} className="flex flex-col items-center text-center">
                <CircularProgress value={data.overall_score} size={160} strokeWidth={14} color="#34d399" label="Overall Score" />
                <p className="mt-3 text-lg font-bold text-text">{data.predicted_career}</p>
                <p className="text-sm text-muted">{data.career_confidence.toFixed(1)}% confidence</p>
            </Card>

            {/* Sub-scores */}
            <Card>
                <h3 className="mb-4 text-lg font-bold text-text">Score Breakdown</h3>
                <div className="space-y-3">
                    <ProgressBar label="ATS Score" value={data.ats_score} showValue animated colorClass="from-emerald-400 to-mint" />
                    <ProgressBar label="Keyword Match" value={data.keyword_score} showValue animated colorClass="from-emerald-400 to-mint" />
                    <ProgressBar label="Format" value={data.format_score} showValue animated colorClass="from-amber-400 to-mint" />
                    <ProgressBar label="Sections" value={data.section_score} showValue animated colorClass="from-amber-400 to-mint" />
                </div>
            </Card>

            {/* Careers */}
            {data.top_careers.length > 0 && (
                <Card>
                    <h3 className="mb-3 text-lg font-bold text-text">Top Career Matches</h3>
                    <div className="space-y-2">
                        {data.top_careers.map((c, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-slate-50/50 px-4 py-3">
                                <span className="font-medium text-text">{typeof c === 'string' ? c : c.career}</span>
                                {typeof c !== 'string' && <Badge tone="success" size="sm">{c.confidence.toFixed(1)}%</Badge>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Skills */}
            {data.skills_detected.length > 0 && (
                <Card>
                    <h3 className="mb-3 text-lg font-bold text-text">Skills ({data.skill_count})</h3>
                    <div className="flex flex-wrap gap-2">{data.skills_detected.map((s) => <Badge key={s} tone="info">{s}</Badge>)}</div>
                </Card>
            )}

            {/* Salary */}
            {data.predicted_salary_min > 0 && (
                <Card hover={false} className="text-center">
                    <p className="text-sm text-muted">Estimated Salary Range</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{(data.predicted_salary_min / 100000).toFixed(1)}L – ₹{(data.predicted_salary_max / 100000).toFixed(1)}L</p>
                </Card>
            )}
        </div>
    );
}
