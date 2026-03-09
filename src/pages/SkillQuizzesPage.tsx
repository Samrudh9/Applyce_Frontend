import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, CheckCircle, Clock, GraduationCap, Loader2, Play, X, XCircle } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { QuizHistoryEntry, QuizQuestion, QuizResult } from '../types/api';

// Available skills — matches backend dataset/skill_quizzes.py AVAILABLE_SKILLS
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

    const startQuiz = async (skill: string) => {
        setLoading(true);
        setSelectedSkill(skill);
        try {
            const res = await api.quizStart(skill);
            setQuestions(res.questions);
            setAnswers({});
            setResults([]);
            setView('quiz');
        } catch { /* */ }
        setLoading(false);
    };

    const selectAnswer = (qIndex: number, optIndex: number) => {
        setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
    };

    const submitQuiz = async () => {
        setLoading(true);
        try {
            const answerList = Object.entries(answers).map(([idx, sel]) => ({ index: Number(idx), selected: sel }));
            const res = await api.quizSubmit(selectedSkill, answerList);
            setResults(res.results);
            setScore({ score: res.score, total: res.total, percentage: res.percentage });
            setView('results');
        } catch { /* */ }
        setLoading(false);
    };

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await api.quizHistory();
            setHistory(res.quizzes);
            const bests: Record<string, number> = {};
            for (const q of res.quizzes) {
                if (!bests[q.skill] || q.score > bests[q.skill]) bests[q.skill] = q.score;
            }
            setBestScores(bests);
        } catch { /* */ }
        setHistoryLoading(false);
    }, []);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    return (
        <div className="space-y-8">
            <SectionHeading title="Skill Quizzes" subtitle="Test your knowledge and validate your skills with interactive quizzes." />

            <div className="flex gap-2">
                {(['select', 'history'] as View[]).map((v) => (
                    <button key={v} onClick={() => setView(v)} className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${view === v || (view === 'quiz' && v === 'select') || (view === 'results' && v === 'select') ? 'bg-mint text-white' : 'bg-white text-muted hover:text-text border border-border'}`}>
                        {v === 'select' ? 'Take Quiz' : 'History'}
                    </button>
                ))}
            </div>

            {/* SKILL SELECTION */}
            {view === 'select' && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {SKILL_OPTIONS.map((skill) => (
                        <Card key={skill} hover className="cursor-pointer" onClick={() => startQuiz(skill)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <GraduationCap size={18} className="text-mint" />
                                    <span className="font-semibold text-text">{skill}</span>
                                </div>
                                {bestScores[skill] !== undefined && <Badge tone="success" size="sm">Best: {bestScores[skill]}</Badge>}
                            </div>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted"><Play size={12} /> Start Quiz</div>
                        </Card>
                    ))}
                    {loading && <div className="col-span-full flex justify-center py-8"><Loader2 size={32} className="animate-spin text-mint" /></div>}
                </div>
            )}

            {/* QUIZ */}
            {view === 'quiz' && (
                <div className="space-y-4">
                    <Card hover={false}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-text">{selectedSkill} Quiz</h2>
                            <Badge tone="info">{Object.keys(answers).length}/{questions.length} answered</Badge>
                        </div>
                    </Card>
                    {questions.map((q) => (
                        <motion.div key={q.index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            <Card>
                                <p className="mb-3 font-semibold text-text">Q{q.index + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt, oi) => (
                                        <button key={oi} onClick={() => selectAnswer(q.index, oi)} className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${answers[q.index] === oi ? 'border-mint bg-mint/10 font-medium text-text' : 'border-border bg-white text-muted hover:border-mint/40 hover:bg-mint/5'}`}>
                                            <span className="mr-2 font-semibold text-muted">{String.fromCharCode(65 + oi)}.</span>{opt}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                    <div className="flex justify-end">
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
                        <CircularProgress value={score.percentage} size={120} strokeWidth={10} color={score.percentage >= 70 ? '#34d399' : '#f59e0b'} label="Score" />
                        <p className="mt-3 text-xl font-bold text-text">{score.score} / {score.total}</p>
                        <Badge tone={score.percentage >= 80 ? 'success' : score.percentage >= 50 ? 'warning' : 'danger'} className="mt-2">
                            {score.percentage >= 80 ? 'Excellent!' : score.percentage >= 50 ? 'Good effort' : 'Keep practicing'}
                        </Badge>
                    </Card>
                    <AnimatePresence>
                        {results.map((r) => (
                            <motion.div key={r.index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className={r.is_correct ? 'border-emerald-200' : 'border-red-200'}>
                                    <div className="flex items-start gap-2">
                                        {r.is_correct ? <CheckCircle size={18} className="mt-0.5 shrink-0 text-emerald-500" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />}
                                        <div className="flex-1">
                                            <p className="font-semibold text-text">{r.question}</p>
                                            <p className="mt-1 text-sm text-muted">Your answer: <strong>{r.options[r.selected]}</strong></p>
                                            {!r.is_correct && <p className="text-sm text-emerald-600">Correct: <strong>{r.options[r.correct]}</strong></p>}
                                            <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-muted">{r.explanation}</p>
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
                    {historyLoading && <div className="flex justify-center py-8"><Loader2 size={32} className="animate-spin text-mint" /></div>}
                    {!historyLoading && history.length === 0 && <Card><p className="text-center text-muted py-8">No quiz history yet.</p></Card>}
                    {history.map((h) => (
                        <Card key={h.id} hover>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text flex items-center gap-2"><BookOpen size={16} className="text-mint" /> {h.skill}</h3>
                                    <p className="text-xs text-muted flex items-center gap-1"><Clock size={12} />{new Date(h.completed_at).toLocaleDateString()}</p>
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
