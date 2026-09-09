import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, CheckCircle, Clock, GraduationCap, Loader2, Play, RotateCcw, X, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../lib/api';
import type { QuizHistoryEntry, QuizQuestion, QuizResult } from '../types/api';

// Available skills — matches the backend's quiz catalogue
const SKILL_OPTIONS = [
    'Python', 'JavaScript', 'Java', 'SQL', 'React', 'Machine Learning',
    'Data Science', 'HTML/CSS', 'Git', 'Docker', 'AWS', 'Node.js',
    'TypeScript', 'C++', 'MongoDB', 'PostgreSQL',
];

type View = 'select' | 'quiz' | 'results' | 'history';

export default function SkillQuizzesPage() {
    const [view, setView] = useState<View>('select');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<QuizResult[]>([]);
    const [score, setScore] = useState({ score: 0, total: 0, percentage: 0 });
    const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [bestScores, setBestScores] = useState<Record<string, number>>({});
    const [quizError, setQuizError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const startQuiz = async (skill: string) => {
        setLoading(true);
        setQuizError(null);
        setSelectedSkill(skill);
        try {
            const res = await api.quizStart(skill);
            setQuestions(res.questions);
            setAnswers({});
            setResults([]);
            setSubmitError(null);
            setView('quiz');
        } catch {
            setQuizError('Could not load the quiz. Please try again.');
        }
        setLoading(false);
    };

    const selectAnswer = (qIndex: number, optIndex: number) => {
        setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    };

    const submitQuiz = async () => {
        setLoading(true);
        setSubmitError(null);
        try {
            const answerList = Object.entries(answers).map(([idx, sel]) => ({ index: Number(idx), selected: sel }));
            const res = await api.quizSubmit(selectedSkill, answerList);
            setResults(res.results);
            setScore({ score: res.score, total: res.total, percentage: res.percentage });
            setView('results');
        } catch {
            setSubmitError('We couldn\'t grade your quiz. Check your connection and try again.');
        }
        setLoading(false);
    };

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const res = await api.quizHistory();
            setHistory(res.quizzes);
            const bests: Record<string, number> = {};
            for (const q of res.quizzes) {
                if (!bests[q.skill] || q.score > bests[q.skill]) bests[q.skill] = q.score;
            }
            setBestScores(bests);
        } catch {
            setHistoryError('Could not load quiz history.');
        }
        setHistoryLoading(false);
    }, []);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    return (
        <div className="space-y-8">
            <SectionHeading title="Skill Quizzes" subtitle="Quick quizzes to check your skills and see where to level up." />

            <div className="flex gap-2">
                {(['select', 'history'] as View[]).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${view === v || (view === 'quiz' && v === 'select') || (view === 'results' && v === 'select') ? 'bg-ink text-canvas' : 'bg-surface text-ink-sec hover:text-ink border border-line'}`}>
                        {v === 'select' ? 'Take Quiz' : 'History'}
                    </button>
                ))}
            </div>

            {/* SKILL SELECTION */}
            {view === 'select' && (
                <div className="space-y-4">
                    {quizError && (
                        <p className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                            <XCircle size={14} className="shrink-0" /> {quizError}
                        </p>
                    )}
                    {loading ? (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading quiz">
                            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {SKILL_OPTIONS.map((skill) => (
                                <Card key={skill} hover className="cursor-pointer" onClick={() => startQuiz(skill)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap size={18} className="text-accent" />
                                            <span className="font-semibold text-ink">{skill}</span>
                                        </div>
                                        {bestScores[skill] !== undefined && <Badge tone="success" size="sm">Best: {bestScores[skill]}</Badge>}
                                    </div>
                                    <div className="mt-2 flex items-center gap-1 text-xs text-ink-sec"><Play size={12} /> Start Quiz</div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* QUIZ */}
            {view === 'quiz' && (
                <div className="space-y-4">
                    <Card hover={false}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-ink">{selectedSkill} Quiz</h2>
                            <Badge tone="info">{Object.keys(answers).length}/{questions.length} answered</Badge>
                        </div>
                    </Card>
                    {questions.map((q) => (
                        <motion.div key={q.index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <p className="mb-3 font-semibold text-ink">Q{q.index + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt, oi) => (
                                        <button key={oi} onClick={() => selectAnswer(q.index, oi)} className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${answers[q.index] === oi ? 'border-accent bg-accent/10 font-medium text-ink' : 'border-line bg-surface text-ink-sec hover:border-accent/40 hover:bg-accent/5'}`}>
                                            <span className="mr-2 font-semibold text-ink-sec">{String.fromCharCode(65 + oi)}.</span>{opt}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    <div className="flex justify-end">
                        {submitError && (
                            <p className="mr-4 flex items-center gap-2 text-sm text-danger">
                                <XCircle size={14} className="shrink-0" /> {submitError}
                            </p>
                        )}
                        <Button onClick={submitQuiz} disabled={loading || Object.keys(answers).length < questions.length}>
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <><Award size={16} /> Submit Quiz</>}
                        </Button>
                    </div>
                </div>
            )}

            {/* RESULTS */}
            {view === 'results' && (
                <div className="space-y-4">
                    <Card hover={false} className="flex flex-col items-center text-center">
                        <CircularProgress value={score.percentage} size={120} strokeWidth={10} label="Score" />
                        <p className="mt-3 text-xl font-bold text-ink">{score.score} / {score.total}</p>
                        <Badge tone={score.percentage >= 80 ? 'success' : score.percentage >= 50 ? 'warning' : 'danger'} className="mt-2">
                            {score.percentage >= 80 ? 'Excellent!' : score.percentage >= 50 ? 'Good effort' : 'Keep practicing'}
                        </Badge>
                    </Card>
                    <AnimatePresence>
                        {results.map((r) => (
                            <motion.div key={r.index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className={r.is_correct ? 'border-success/30' : 'border-danger/30'}>
                                    <div className="flex items-start gap-2">
                                        {r.is_correct ? <CheckCircle size={18} className="mt-0.5 shrink-0 text-success" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-danger" />}
                                        <div className="flex-1">
                                            <p className="font-semibold text-ink">{r.question}</p>
                                            <p className="mt-1 text-sm text-ink-sec">Your answer: <strong>{r.options[r.selected]}</strong></p>
                                            {!r.is_correct && <p className="text-sm text-success">Correct: <strong>{r.options[r.correct]}</strong></p>}
                                            <p className="mt-2 rounded-lg bg-elevated p-2 text-xs text-ink-sec">{r.explanation}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="flex gap-3">
                        <Button onClick={() => startQuiz(selectedSkill)}>Retake Quiz</Button>
                        <Button variant="outline" onClick={() => setView('select')}>Try Another Skill</Button>
                    </div>
                </div>
            )}

            {/* HISTORY */}
            {view === 'history' && (
                <div className="space-y-3">
                    {historyLoading && (
                        <div className="space-y-3" aria-busy="true" aria-label="Loading quiz history">
                            {[0, 1, 2].map((i) => <SkeletonCard key={i} lines={1} />)}
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
                    {!historyLoading && !historyError && history.length === 0 && <Card><p className="text-center text-ink-sec py-8">No quiz history yet.</p></Card>}
                    {!historyLoading && !historyError && history.map((h) => (
                        <Card key={h.id} hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-ink flex items-center gap-2"><BookOpen size={16} className="text-accent" /> {h.skill}</h3>
                                    <p className="text-xs text-ink-sec flex items-center gap-1"><Clock size={12} />{new Date(h.completed_at).toLocaleDateString()}</p>
                                </div>
                                <Badge tone={h.score / h.total >= 0.8 ? 'success' : h.score / h.total >= 0.5 ? 'warning' : 'danger'}>{h.score}/{h.total}</Badge>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
