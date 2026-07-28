import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award, Brain, CheckCircle, ChevronRight, Clock,
    Loader2, MessageSquare, Mic, MicOff, Pause, Play,
    Send, Square, Trophy, Volume2, VolumeX, Keyboard,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Input } from '../components/ui/Input';
import { SectionHeading } from '../components/ui/SectionHeading';
import { api } from '../lib/api';
import type { InterviewEvaluation, InterviewQuestion, InterviewSession } from '../types/api';

type View = 'setup' | 'session' | 'results' | 'history';
type RecordState = 'idle' | 'recording' | 'recorded' | 'processing';

export default function VoiceInterviewPage() {
    // ── Setup state ──
    const [view, setView] = useState<View>('setup');
    const [career, setCareer] = useState('Software Developer');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    // ── Session state ──
    const [session, setSession] = useState<InterviewSession | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [lastEval, setLastEval] = useState<InterviewEvaluation | null>(null);
    const [transcript, setTranscript] = useState('');
    const [history, setHistory] = useState<InterviewSession[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // ── Voice recording state ──
    const [recordState, setRecordState] = useState<RecordState>('idle');
    const [recordSeconds, setRecordSeconds] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
    const [fallbackToText, setFallbackToText] = useState(false);
    const [textAnswer, setTextAnswer] = useState('');
    const [error, setError] = useState('');

    // ── Refs ──
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animFrameRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const questionAudioRef = useRef<HTMLAudioElement | null>(null);

    // ── Check voice availability on mount ──
    useEffect(() => {
        api.interviewVoiceEnabled()
            .then(r => setVoiceEnabled(r.voice_enabled))
            .catch(() => setVoiceEnabled(false));
    }, []);

    // ── Cleanup on unmount ──
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            if (audioContextRef.current) audioContextRef.current.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Start interview session ──
    const startSession = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.interviewStart({ career, difficulty, count });
            setSession(res.session);
            setCurrentQ(0);
            resetRecording();
            setLastEval(null);
            setTranscript('');
            setFallbackToText(false);
            setTextAnswer('');
            setView('session');
        } catch { setError('Failed to start interview. Try again.'); }
        setLoading(false);
    };

    // ── Recording controls ──
    const startRecording = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Set up audio context for waveform
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            // Configure MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setRecordState('recorded');
                stream.getTracks().forEach(t => t.stop());
                if (timerRef.current) clearInterval(timerRef.current);
                cancelAnimationFrame(animFrameRef.current);
            };

            recorder.start(250); // collect data every 250ms
            setRecordState('recording');
            setRecordSeconds(0);

            // Timer
            timerRef.current = setInterval(() => {
                setRecordSeconds(s => s + 1);
            }, 1000);

            // Waveform visualization
            drawWaveform();
        } catch (err) {
            console.error('Microphone access denied:', err);
            setError('Microphone access denied. Please allow microphone permissions or switch to text input.');
            setFallbackToText(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const resetRecording = () => {
        setRecordState('idle');
        setRecordSeconds(0);
        setAudioBlob(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setTranscript('');
    };

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height;
                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, '#34d399');
                gradient.addColorStop(1, '#7c3aed');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }
        };
        draw();
    };

    // ── Submit voice answer ──
    const submitVoiceAnswer = async () => {
        if (!session || !audioBlob) return;
        setRecordState('processing');
        setError('');
        try {
            const res = await api.interviewVoiceAnswer(session.id, currentQ, audioBlob);
            setTranscript(res.transcript);
            setLastEval(res.evaluation);
            if (res.is_complete) {
                const updated = await api.interviewGet(session.id);
                setSession(updated.session);
                setView('results');
            }
        } catch {
            setError('Failed to process your answer. Try again or switch to text.');
            setRecordState('recorded');
        }
    };

    // ── Submit text answer (fallback) ──
    const submitTextAnswer = async () => {
        if (!session || !textAnswer.trim()) return;
        setRecordState('processing');
        setError('');
        try {
            const res = await api.interviewAnswer({
                session_id: session.id,
                question_index: currentQ,
                answer: textAnswer,
            });
            setLastEval(res.evaluation);
            if (res.is_complete) {
                const updated = await api.interviewGet(session.id);
                setSession(updated.session);
                setView('results');
            }
        } catch {
            setError('Failed to evaluate your answer.');
            setRecordState('idle');
        }
    };

    // ── Play question TTS ──
    const playQuestion = () => {
        if (!session) return;
        if (questionAudioRef.current) {
            questionAudioRef.current.pause();
            questionAudioRef.current = null;
            setIsPlayingQuestion(false);
            return;
        }
        const url = api.interviewQuestionAudioUrl(session.id, currentQ);
        const audio = new Audio(url);
        questionAudioRef.current = audio;
        setIsPlayingQuestion(true);
        audio.onended = () => { setIsPlayingQuestion(false); questionAudioRef.current = null; };
        audio.onerror = () => { setIsPlayingQuestion(false); questionAudioRef.current = null; };
        audio.play().catch(() => setIsPlayingQuestion(false));
    };

    // ── Next question ──
    const nextQuestion = () => {
        setCurrentQ(p => p + 1);
        resetRecording();
        setLastEval(null);
        setTranscript('');
        setTextAnswer('');
        setFallbackToText(false);
        setError('');
    };

    // ── History ──
    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try { const res = await api.interviewHistory(); setHistory(res.sessions); } catch { /* */ }
        setHistoryLoading(false);
    }, []);

    useEffect(() => { if (view === 'history') loadHistory(); }, [view, loadHistory]);

    const questions: InterviewQuestion[] = session?.questions_json ?? [];
    const q = questions[currentQ];

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="space-y-8">
            <SectionHeading
                title="Voice Interview"
                subtitle="Practice interview questions with voice recording and AI-powered feedback."
            />

            {/* Tab bar */}
            <div className="flex gap-2">
                {(['setup', 'history'] as View[]).map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${view === v ? 'bg-mint text-white' : 'bg-white text-muted hover:text-text border border-border'}`}
                    >
                        {v === 'setup' ? 'New Session' : 'History'}
                    </button>
                ))}
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </motion.div>
            )}

            {/* ═══ SETUP ═══ */}
            {view === 'setup' && (
                <Card>
                    <h2 className="mb-4 text-lg font-bold text-text flex items-center gap-2">
                        <Mic size={20} className="text-mint" /> Configure Voice Interview
                    </h2>
                    <div className="space-y-4 max-w-lg">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Target Career</label>
                            <Input value={career} onChange={e => setCareer(e.target.value)} placeholder="e.g. Data Scientist" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Difficulty</label>
                            <div className="flex gap-2">
                                {(['easy', 'medium', 'hard'] as const).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${difficulty === d ? 'bg-mint text-white' : 'border border-border bg-white text-muted hover:text-text'}`}
                                    >{d}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-text">Number of Questions</label>
                            <Input type="number" min={1} max={15} value={count} onChange={e => setCount(Number(e.target.value))} />
                        </div>

                        {/* Voice mode info */}
                        <div className="rounded-xl border border-mint/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-start gap-3">
                            <Mic size={18} className="mt-0.5 shrink-0 text-mint" />
                            <div>
                                <p className="font-semibold">Voice Mode</p>
                                <p className="mt-0.5 text-xs text-emerald-600">
                                    Record your answers using your microphone. Your speech will be transcribed and evaluated by AI.
                                    {!voiceEnabled && ' (Voice engine is in mock mode — transcription will return a sample answer.)'}
                                </p>
                            </div>
                        </div>

                        <Button onClick={startSession} disabled={loading || !career.trim()}>
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Starting…</> : <><Mic size={16} /> Start Voice Interview</>}
                        </Button>
                    </div>
                </Card>
            )}

            {/* ═══ SESSION — voice question by question ═══ */}
            {view === 'session' && q && (
                <AnimatePresence mode="wait">
                    <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

                        {/* Question Card */}
                        <Card>
                            <div className="mb-3 flex items-center justify-between">
                                <Badge tone="info">Question {currentQ + 1} of {questions.length}</Badge>
                                <div className="flex items-center gap-2">
                                    {q.category && <Badge tone="neutral">{q.category}</Badge>}
                                    <button
                                        onClick={playQuestion}
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${isPlayingQuestion
                                            ? 'bg-mint/10 text-mint border border-mint/30 animate-pulse'
                                            : 'bg-white text-muted hover:text-mint border border-border hover:border-mint/30'}`}
                                    >
                                        {isPlayingQuestion ? <><VolumeX size={14} /> Stop</> : <><Volume2 size={14} /> Listen</>}
                                    </button>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-text">{q.question}</p>
                        </Card>

                        {/* Answer Area */}
                        {!lastEval ? (
                            <Card>
                                {!fallbackToText ? (
                                    <div className="space-y-4">
                                        {/* Recording Controls */}
                                        <div className="flex flex-col items-center py-4">
                                            {recordState === 'idle' && (
                                                <motion.button
                                                    onClick={startRecording}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="group flex h-24 w-24 items-center justify-center rounded-full border-4 border-mint/30 bg-gradient-to-br from-mint to-emerald-500 text-white shadow-lg shadow-mint/20 transition-all hover:shadow-xl hover:shadow-mint/30"
                                                >
                                                    <Mic size={36} className="drop-shadow" />
                                                </motion.button>
                                            )}

                                            {recordState === 'recording' && (
                                                <div className="flex flex-col items-center gap-4">
                                                    {/* Waveform */}
                                                    <div className="relative">
                                                        <canvas
                                                            ref={canvasRef}
                                                            width={280}
                                                            height={80}
                                                            className="rounded-xl border border-border bg-white/50"
                                                        />
                                                        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                                                    </div>

                                                    {/* Timer */}
                                                    <div className="flex items-center gap-2 text-lg font-mono font-semibold text-text">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                                                        {formatTime(recordSeconds)}
                                                    </div>

                                                    {/* Stop button */}
                                                    <motion.button
                                                        onClick={stopRecording}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-600"
                                                    >
                                                        <Square size={24} fill="white" />
                                                    </motion.button>
                                                </div>
                                            )}

                                            {recordState === 'recorded' && audioUrl && (
                                                <div className="w-full space-y-4">
                                                    {/* Playback */}
                                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint/10 text-mint">
                                                            <Play size={18} />
                                                        </div>
                                                        <audio src={audioUrl} controls className="flex-1 h-10" />
                                                        <span className="text-xs font-mono text-muted">{formatTime(recordSeconds)}</span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={resetRecording}
                                                            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
                                                        >
                                                            <MicOff size={14} /> Re-record
                                                        </button>
                                                        <Button onClick={submitVoiceAnswer}>
                                                            <Send size={16} /> Submit Answer
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {recordState === 'processing' && (
                                                <div className="flex flex-col items-center gap-3 py-4">
                                                    <div className="relative">
                                                        <Loader2 size={48} className="animate-spin text-mint" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Mic size={20} className="text-mint/50" />
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-muted">Transcribing & evaluating…</p>
                                                    <p className="text-xs text-muted/60">This may take a few seconds</p>
                                                </div>
                                            )}

                                            {recordState === 'idle' && (
                                                <p className="mt-3 text-center text-xs text-muted">
                                                    Click the microphone to start recording your answer
                                                </p>
                                            )}
                                        </div>

                                        {/* Text fallback toggle */}
                                        <div className="flex justify-center border-t border-border pt-3">
                                            <button
                                                onClick={() => setFallbackToText(true)}
                                                className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
                                            >
                                                <Keyboard size={14} /> Switch to text input
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Text fallback input */
                                    <div className="space-y-3">
                                        <label className="mb-2 flex items-center justify-between text-sm font-medium text-text">
                                            <span>Your Answer (text)</span>
                                            <button
                                                onClick={() => setFallbackToText(false)}
                                                className="flex items-center gap-1 text-xs text-mint hover:text-mint-dark transition-colors"
                                            >
                                                <Mic size={12} /> Switch to voice
                                            </button>
                                        </label>
                                        <textarea
                                            className="w-full rounded-xl border border-border bg-white p-4 text-sm text-text placeholder:text-muted focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30"
                                            rows={6}
                                            value={textAnswer}
                                            onChange={e => setTextAnswer(e.target.value)}
                                            placeholder="Type your answer here..."
                                        />
                                        <div className="flex justify-end">
                                            <Button
                                                onClick={submitTextAnswer}
                                                disabled={recordState === 'processing' || !textAnswer.trim()}
                                            >
                                                {recordState === 'processing'
                                                    ? <><Loader2 size={16} className="animate-spin" /> Evaluating…</>
                                                    : <><Send size={16} /> Submit Answer</>}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ) : (
                            /* Evaluation Card */
                            <Card className="border-mint/30">
                                <h3 className="mb-2 text-lg font-bold text-text flex items-center gap-2">
                                    <MessageSquare size={18} className="text-mint" /> AI Feedback
                                </h3>

                                {/* Transcript */}
                                {transcript && (
                                    <div className="mb-3 rounded-lg border border-border bg-slate-50 p-3">
                                        <p className="text-xs font-semibold uppercase text-muted mb-1">Your answer (transcribed)</p>
                                        <p className="text-sm text-text">{transcript}</p>
                                    </div>
                                )}

                                {/* Score */}
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
                </AnimatePresence>
            )}

            {/* ═══ RESULTS ═══ */}
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

            {/* ═══ HISTORY ═══ */}
            {view === 'history' && (
                <div className="space-y-4">
                    {historyLoading && <div className="flex justify-center py-8"><Loader2 size={32} className="animate-spin text-mint" /></div>}
                    {!historyLoading && history.length === 0 && <Card><p className="text-center text-muted py-8">No interview sessions yet. Start your first one!</p></Card>}
                    {history.map(s => (
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
