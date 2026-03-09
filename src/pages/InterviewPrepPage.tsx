import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Brain, CheckCircle, ChevronRight, Clock, Loader2, MessageSquare, Play, Send, Trophy } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { InterviewEvaluation, InterviewQuestion, InterviewSession } from '../types/api';

type View = 'setup' | 'session' | 'results' | 'history';

export default function InterviewPrepPage() {
    const [view, setView] = useState<View>('setup');
    const [career, setCareer] = useState('Software Developer');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<InterviewSession | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answer, setAnswer] = useState('');
    const [evaluating, setEvaluating] = useState(false);
    const [lastEval, setLastEval] = useState<InterviewEvaluation | null>(null);
    const [history, setHistory] = useState<InterviewSession[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const startSession = async () => {
        setLoading(true);
        try {
            const res = await api.interviewStart({ career, difficulty, count });
            setSession(res.session);
            setCurrentQ(0);
            setAnswer('');
            setLastEval(null);
            setView('session');
        } catch { /* ignore */ }
        setLoading(false);
    };

    const submitAnswer = async () => {
        if (!session || !answer.trim()) return;
        setEvaluating(true);
        try {
            const res = await api.interviewAnswer({ session_id: session.id, question_index: currentQ, answer });
            setLastEval(res.evaluation);
            if (res.is_complete) {
                const updated = await api.interviewGet(session.id);
                setSession(updated.session);
                setView('results');
            }
        } catch { /* ignore */ }
        setEvaluating(false);
    };

    const nextQuestion = () => {
        setCurrentQ((p) => p + 1);
        setAnswer('');
        setLastEval(null);
    };

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try { const res = await api.interviewHistory(); setHistory(res.sessions); } catch { /* */ }
        setHistoryLoading(false);
    }, []);

    useEffect(() => { if (view === 'history') loadHistory(); }, [view, loadHistory]);

    const questions: InterviewQuestion[] = session?.questions_json ?? [];
    const q = questions[currentQ];

    return (
        <div className="space-y-8">
            <SectionHeading title="Interview Prep" subtitle="Practice with AI-powered interview questions and get instant feedback." />

            {/* Tab bar */}
            <div className="flex gap-2">
                {(['setup', 'history'] as View[]).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${view === v ? 'bg-mint text-white' : 'bg-white text-muted hover:text-text border border-border'}`}>
                        {v === 'setup' ? 'New Session' : 'History'}
                    </button>
                ))}
            </div>

            {/* SETUP */}
            {view === 'setup' && (
                <Card>
                    <h2 className="mb-4 text-lg font-bold text-text flex items-center gap-2"><Brain size={20} className="text-mint" /> Configure Interview</h2>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Target Career</label>
                            <Input value={career} onChange={(e) => setCareer(e.target.value)} placeholder="e.g. Data Scientist" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Difficulty</label>
                            <div className="flex gap-2">
                                {(['easy', 'medium', 'hard'] as const).map((d) => (
                                    <button key={d} onClick={() => setDifficulty(d)} className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${difficulty === d ? 'bg-mint text-white' : 'border border-border bg-white text-muted hover:text-text'}`}>{d}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Number of Questions</label>
                            <Input type="number" min={1} max={15} value={count} onChange={(e) => setCount(Number(e.target.value))} />
                        </div>
                        <Button onClick={startSession} disabled={loading || !career.trim()}>
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Starting…</> : <><Play size={16} /> Start Interview</>}
                        </Button>
                    </div>
                </Card>
            )}

            {/* SESSION — question by question */}
            {view === 'session' && q && (
                <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <Card>
                        <div className="mb-3 flex items-center justify-between">
                            <Badge tone="info">Question {currentQ + 1} of {questions.length}</Badge>
                            {q.category && <Badge tone="default">{q.category}</Badge>}
                        </div>
                        <p className="text-lg font-semibold text-text">{q.question}</p>
                    </Card>

                    {!lastEval ? (
                        <Card>
                            <label className="mb-2 block text-sm font-medium text-text">Your Answer</label>
                            <textarea className="w-full rounded-xl border border-border bg-white p-4 text-sm text-text placeholder:text-muted focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." />
                            <div className="mt-3 flex justify-end">
                                <Button onClick={submitAnswer} disabled={evaluating || !answer.trim()}>
                                    {evaluating ? <><Loader2 size={16} className="animate-spin" /> Evaluating…</> : <><Send size={16} /> Submit Answer</>}
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="border-mint/30">
                            <h3 className="mb-2 text-lg font-bold text-text flex items-center gap-2"><MessageSquare size={18} className="text-mint" /> AI Feedback</h3>
                            <div className="mb-3 flex items-center gap-3">
                                <CircularProgress value={lastEval.score * 10} size={56} strokeWidth={6} color="#34d399" />
                                <span className="text-2xl font-bold text-text">{lastEval.score}/10</span>
                            </div>
                            <p className="text-sm text-muted">{lastEval.feedback}</p>
                            {lastEval.strengths && lastEval.strengths.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold uppercase text-emerald-600">Strengths</p>
                                    <ul className="mt-1 space-y-1">{lastEval.strengths.map((s, i) => <li key={i} className="flex items-start gap-1 text-sm text-muted"><CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-500" />{s}</li>)}</ul>
                                </div>
                            )}
                            {lastEval.improvements && lastEval.improvements.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold uppercase text-amber-600">Improvements</p>
                                    <ul className="mt-1 space-y-1">{lastEval.improvements.map((s, i) => <li key={i} className="flex items-start gap-1 text-sm text-muted"><ChevronRight size={14} className="mt-0.5 shrink-0 text-amber-500" />{s}</li>)}</ul>
                                </div>
                            )}
                            {currentQ < questions.length - 1 && (
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={nextQuestion}><ChevronRight size={16} /> Next Question</Button>
                                </div>
                            )}
                        </Card>
                    )}
                </motion.div>
            )}

            {/* RESULTS */}
            {view === 'results' && session && (
                <div className="space-y-6">
                    <Card hover={false} className="flex flex-col items-center text-center">
                        <Trophy size={40} className="text-mint mb-2" />
                        <h2 className="text-2xl font-bold text-text">Session Complete!</h2>
                        <CircularProgress value={session.overall_score ?? 0} size={120} strokeWidth={10} color="#34d399" label="Overall" className="mt-4" />
                        <p className="mt-2 text-sm text-muted">{session.career} · {session.difficulty}</p>
                    </Card>
                    {session.questions_json.map((qq, i) => {
                        const eval_ = session.scores_json[i];
                        return (
                            <Card key={i}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-text">Q{i + 1}: {qq.question}</p>
                                        {session.answers_json[i] && <p className="mt-1 text-xs text-muted">Your answer: {session.answers_json[i]!.answer.slice(0, 150)}…</p>}
                                    </div>
                                    {eval_ && <Badge tone={eval_.score >= 7 ? 'success' : eval_.score >= 5 ? 'warning' : 'danger'}>{eval_.score}/10</Badge>}
                                </div>
                                {eval_ && <p className="mt-2 text-xs text-muted">{eval_.feedback}</p>}
                            </Card>
                        );
                    })}
                    <Button onClick={() => setView('setup')}>Start New Session</Button>
                </div>
            )}

            {/* HISTORY */}
            {view === 'history' && (
                <div className="space-y-4">
                    {historyLoading && <div className="flex justify-center py-8"><Loader2 size={32} className="animate-spin text-mint" /></div>}
                    {!historyLoading && history.length === 0 && <Card><p className="text-center text-muted py-8">No interview sessions yet. Start your first one!</p></Card>}
                    {history.map((s) => (
                        <Card key={s.id} hover className="cursor-pointer" onClick={() => { setSession(s); setView('results'); }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text">{s.career}</h3>
                                    <p className="text-xs text-muted flex items-center gap-2">
                                        <Clock size={12} />{new Date(s.created_at).toLocaleDateString()} · {s.difficulty} · {s.total_questions} questions
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {s.is_complete ? <Badge tone="success"><Award size={12} /> {s.overall_score}/100</Badge> : <Badge tone="warning">In Progress</Badge>}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
