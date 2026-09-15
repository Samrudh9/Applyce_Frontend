import { useCallback, useEffect, useState } from 'react';
import { Award, Brain, CheckCircle, ChevronRight, Clock, MessageSquare, Play, RotateCcw, Send, Trophy } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import type { InterviewEvaluation, InterviewQuestion, InterviewSession } from '../types/api';

type View = 'setup' | 'session' | 'results' | 'history';

export default function InterviewPrepPage() {
    const [view, setView] = useState<View>('setup');
    const [career, setCareer] = useState('');
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
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [answerError, setAnswerError] = useState<string | null>(null);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const startSession = async () => {
        setLoading(true);
        setSessionError(null);
        try {
            const res = await api.interviewStart({ career, difficulty, count });
            setSession(res.session);
            setCurrentQ(0);
            setAnswer('');
            setLastEval(null);
            setView('session');
        } catch {
            setSessionError('We couldn\'t start that session. Check your connection and try again.');
        }
        setLoading(false);
    };

    const submitAnswer = async () => {
        if (!session || !answer.trim()) return;
        setEvaluating(true);
        setAnswerError(null);
        try {
            const res = await api.interviewAnswer({ session_id: session.id, question_index: currentQ, answer });
            setLastEval(res.evaluation);
            if (res.is_complete) {
                const updated = await api.interviewGet(session.id);
                setSession(updated.session);
                setView('results');
            }
        } catch {
            setAnswerError('We couldn\'t score that answer. Try again.');
        }
        setEvaluating(false);
    };

    const nextQuestion = () => {
        setCurrentQ((p) => p + 1);
        setAnswer('');
        setLastEval(null);
        setAnswerError(null);
    };

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const res = await api.interviewHistory();
            setHistory(res.sessions);
        } catch {
            setHistoryError('We couldn\'t load your interview history.');
        }
        setHistoryLoading(false);
    }, []);

    useEffect(() => { if (view === 'history') loadHistory(); }, [view, loadHistory]);

    const questions: InterviewQuestion[] = session?.questions_json ?? [];
    const q = questions[currentQ];

    return (
        <div className="space-y-6 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <SectionHeading title="Interview Prep" subtitle="Practice with realistic questions and get instant feedback — before the real interview." />

                {/* Tab bar */}
                <div className="flex gap-1.5">
                    {(['setup', 'history'] as View[]).map((v) => (
                        <button key={v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === v ? 'bg-ink text-canvas' : 'bg-surface text-ink-sec hover:text-ink border border-line'}`}>
                            {v === 'setup' ? 'New Session' : 'History'}
                        </button>
                    ))}
                </div>

                {/* SETUP */}
                {view === 'setup' && (
                    <Card hover={false}>
                        <h2 className="mb-4 text-base font-bold text-ink flex items-center gap-2"><Brain size={18} className="text-accent-strong" /> Set up your practice session</h2>
                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-ink">Target Career</label>
                                <Input value={career} onChange={(e) => setCareer(e.target.value)} placeholder="e.g. Data Scientist" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-ink">Difficulty</label>
                                <div className="flex gap-2">
                                    {(['easy', 'medium', 'hard'] as const).map((d) => (
                                        <button key={d} onClick={() => setDifficulty(d)} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${difficulty === d ? 'bg-ink text-canvas' : 'border border-line bg-surface text-ink-sec hover:text-ink'}`}>{d}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Input label="Number of Questions" type="number" min={1} max={15} value={count} onChange={(e) => setCount(Number(e.target.value))} />
                            </div>
                            <Button onClick={startSession} disabled={loading || !career.trim()} size="sm">
                                {loading ? 'Starting…' : <><Play size={16} /> Start Interview</>}
                            </Button>
                            {sessionError && (
                                <p className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                                    {sessionError}
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* SESSION — question by question */}
                {view === 'session' && q && (
                    <div key={currentQ} className="space-y-4">
                        <Card hover={false}>
                            <div className="mb-3 flex items-center justify-between">
                                <Badge tone="info" size="sm">Question {currentQ + 1} of {questions.length}</Badge>
                                {q.category && <Badge tone="neutral" size="sm">{q.category}</Badge>}
                            </div>
                            <p className="text-base font-semibold text-ink">{q.question}</p>
                        </Card>

                        {!lastEval ? (
                            <Card hover={false}>
                                <label className="mb-2 block text-sm font-medium text-ink">Your Answer</label>
                                <textarea className="w-full rounded-xl border border-line bg-surface p-4 text-sm text-ink placeholder:text-ink-sec focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here — a few sentences is fine." />
                                <div className="mt-3 flex justify-end">
                                    <Button onClick={submitAnswer} disabled={evaluating || !answer.trim()} size="sm">
                                        {evaluating ? 'Evaluating…' : <><Send size={14} /> Submit Answer</>}
                                    </Button>
                                </div>
                                {answerError && (
                                    <p className="mt-3 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                                        {answerError}
                                    </p>
                                )}
                            </Card>
                        ) : (
                            <Card hover={false} className="border-accent/30">
                                <h3 className="mb-2 text-base font-bold text-ink flex items-center gap-2"><MessageSquare size={16} className="text-accent-strong" /> AI Feedback</h3>
                                <div className="mb-3 flex items-center gap-3">
                                    <CircularProgress value={lastEval.score * 10} size={56} strokeWidth={6} />
                                    <span className="text-xl font-bold text-ink">{lastEval.score}/10</span>
                                </div>
                                <p className="text-sm text-ink-sec">{lastEval.feedback}</p>
                                {lastEval.strengths && lastEval.strengths.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold uppercase text-success">Strengths</p>
                                        <ul className="mt-1 space-y-1">{lastEval.strengths.map((s, i) => <li key={i} className="flex items-start gap-1 text-sm text-ink-sec"><CheckCircle size={14} className="mt-0.5 shrink-0 text-success" />{s}</li>)}</ul>
                                    </div>
                                )}
                                {lastEval.improvements && lastEval.improvements.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold uppercase text-warning">Improvements</p>
                                        <ul className="mt-1 space-y-1">{lastEval.improvements.map((s, i) => <li key={i} className="flex items-start gap-1 text-sm text-ink-sec"><ChevronRight size={14} className="mt-0.5 shrink-0 text-warning" />{s}</li>)}</ul>
                                    </div>
                                )}
                                {currentQ < questions.length - 1 && (
                                    <div className="mt-4 flex justify-end">
                                        <Button onClick={nextQuestion} size="sm"><ChevronRight size={14} /> Next Question</Button>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                )}

                {/* RESULTS */}
                {view === 'results' && session && (
                    <div className="space-y-4">
                        <Card hover={false} className="flex flex-col items-center text-center">
                            <Trophy size={36} className="text-accent-strong mb-2" />
                            <h2 className="text-xl font-bold text-ink">Session Complete!</h2>
                            <CircularProgress value={session.overall_score ?? 0} size={110} strokeWidth={9} label="Overall" className="mt-4" />
                            <p className="mt-2 text-sm text-ink-sec">{session.career} · {session.difficulty}</p>
                        </Card>
                        {session.questions_json.map((qq, i) => {
                            const eval_ = session.scores_json[i];
                            return (
                                <Card key={i} hover={false}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-ink">Q{i + 1}: {qq.question}</p>
                                            {session.answers_json[i] && <p className="mt-1 text-xs text-ink-sec">Your answer: {session.answers_json[i]!.answer.slice(0, 150)}…</p>}
                                        </div>
                                        {eval_ && <Badge tone={eval_.score >= 7 ? 'success' : eval_.score >= 5 ? 'warning' : 'danger'} size="sm">{eval_.score}/10</Badge>}
                                    </div>
                                    {eval_ && <p className="mt-2 text-xs text-ink-sec">{eval_.feedback}</p>}
                                </Card>
                            );
                        })}
                        <Button onClick={() => setView('setup')} size="sm">Start New Session</Button>
                    </div>
                )}

                {/* HISTORY */}
                {view === 'history' && (
                    <div className="space-y-3">
                        {historyLoading && (
                            <div className="space-y-3" aria-busy="true" aria-label="Loading interview history">
                                {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={2} />)}
                            </div>
                        )}
                        {!historyLoading && historyError && (
                            <Card hover={false}>
                                <div className="flex flex-col items-center gap-3 py-8 text-center">
                                    <p className="text-sm text-danger">{historyError}</p>
                                    <Button variant="outline" size="sm" onClick={loadHistory}>
                                        <RotateCcw size={14} /> Try again
                                    </Button>
                                </div>
                            </Card>
                        )}
                        {!historyLoading && !historyError && history.length === 0 && (
                            <Card hover={false}>
                                <p className="text-center text-sm text-ink-sec py-8">No sessions yet — start a practice interview above.</p>
                            </Card>
                        )}
                        {!historyLoading && !historyError && history.map((s) => (
                            <Card key={s.id} hover className="cursor-pointer" onClick={() => { setSession(s); setView('results'); }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-ink">{s.career}</h3>
                                        <p className="text-xs text-ink-sec flex items-center gap-2">
                                            <Clock size={12} />{new Date(s.created_at).toLocaleDateString()} · {s.difficulty} · {s.total_questions} questions
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {s.is_complete ? <Badge tone="success" size="sm"><Award size={12} /> {s.overall_score}/100</Badge> : <Badge tone="warning" size="sm">In Progress</Badge>}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
