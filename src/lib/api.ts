/* ──────────────────────────────────────────────────────────────
   Applyce API Service
   Typed fetch wrapper for the Flask backend.
   ────────────────────────────────────────────────────────────── */

import type {
    AnalyzeResumeResponse,
    CoverLetterGenerateRequest,
    CoverLetterListResponse,
    CoverLetterResponse,
    DashboardStatsResponse,
    ExplainableScoreRequest,
    ExplainableScoreResponse,
    FeedbackRequest,
    FeedbackResponse,
    HealthResponse,
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewHistoryResponse,
    InterviewSessionResponse,
    InterviewStartRequest,
    JobInsightsResponse,
    JobMatchRequest,
    JobMatchResponse,
    JobSearchParams,
    JobSearchResponse,
    PredictRequest,
    PredictResponse,
    ProgressResponse,
    QuizAnswer,
    QuizHistoryResponse,
    QuizStartResponse,
    QuizSubmitResponse,
    ResumeBuilderCreateRequest,
    ResumeBuilderListResponse,
    ResumeBuilderResponse,
    RoadmapResponse,
    ScorecardCreateResponse,
    ScorecardGetResponse,
    ScoreTrendsResponse,
    SkillGapRequest,
    SkillGapResponse,
    TrackerAddRequest,
    TrackerApplicationResponse,
    TrackerListResponse,
    TrackerStatus,
} from '../types/api';

// ── Base URL ─────────────────────────────────────────────────
const BASE = (import.meta as any).env?.VITE_API_URL ?? '';

// ── Helpers ──────────────────────────────────────────────────
class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new ApiError(res.status, body.error ?? res.statusText);
    }
    return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '') sp.set(k, String(v));
    }
    const qs = sp.toString();
    return qs ? `?${qs}` : '';
}

const headers = { 'Content-Type': 'application/json' };
const creds: RequestCredentials = 'include';

// ── Generic verbs ────────────────────────────────────────────
async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = `${BASE}${path}${params ? buildQuery(params) : ''}`;
    return handleResponse<T>(await fetch(url, { credentials: creds }));
}

async function post<T>(path: string, body: unknown): Promise<T> {
    return handleResponse<T>(
        await fetch(`${BASE}${path}`, {
            method: 'POST',
            headers,
            credentials: creds,
            body: JSON.stringify(body),
        }),
    );
}

async function put<T>(path: string, body: unknown): Promise<T> {
    return handleResponse<T>(
        await fetch(`${BASE}${path}`, {
            method: 'PUT',
            headers,
            credentials: creds,
            body: JSON.stringify(body),
        }),
    );
}

async function postForm<T>(path: string, formData: FormData): Promise<T> {
    return handleResponse<T>(
        await fetch(`${BASE}${path}`, {
            method: 'POST',
            credentials: creds,
            body: formData,
        }),
    );
}

async function fetchBlob(path: string): Promise<Blob> {
    const res = await fetch(`${BASE}${path}`, { method: 'POST', credentials: creds });
    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: res.statusText }));
        throw new ApiError(res.status, body.error ?? res.statusText);
    }
    return res.blob();
}

// ── Typed API Methods ────────────────────────────────────────
export const api = {
    // 1. Career Prediction
    predict: (data: PredictRequest) => post<PredictResponse>('/api/predict', data),

    // 2. Resume Analysis
    analyzeResume: (file: File) => {
        const fd = new FormData();
        fd.append('resume', file);
        return postForm<AnalyzeResumeResponse>('/api/analyze-resume', fd);
    },

    // 3. Skill Gap Analysis
    skillGap: (data: SkillGapRequest) => post<SkillGapResponse>('/api/skill-gap', data),

    // 4. Career Roadmap
    roadmap: (career: string) => get<RoadmapResponse>(`/api/roadmap/${encodeURIComponent(career)}`),

    // 5. Explainable Score
    explainableScore: (data: ExplainableScoreRequest) =>
        post<ExplainableScoreResponse>('/api/explainable-score', data),

    // 6. Dashboard
    dashboardStats: () => get<DashboardStatsResponse>('/api/dashboard/stats'),
    scoreTrends: () => get<ScoreTrendsResponse>('/api/score-trends'),

    // 7. Jobs
    jobSearch: (params: JobSearchParams) => get<JobSearchResponse>('/api/jobs/search', params as unknown as Record<string, string | number | boolean | undefined>),
    jobInsights: (career: string, location?: string) =>
        get<JobInsightsResponse>('/api/jobs/insights', { career, location }),
    jobMatch: (data: JobMatchRequest) => post<JobMatchResponse>('/api/job-match', data),

    // 8. Resume Builder
    resumeCreate: (data: ResumeBuilderCreateRequest) =>
        post<ResumeBuilderResponse>('/api/resume/builder', data),
    resumeGet: (id: number) => get<ResumeBuilderResponse>(`/api/resume/builder/${id}`),
    resumeUpdate: (id: number, data: Partial<ResumeBuilderCreateRequest>) =>
        put<ResumeBuilderResponse>(`/api/resume/builder/${id}`, data),
    resumeList: () => get<ResumeBuilderListResponse>('/api/resume/builder/list'),
    resumeExportPdf: (id: number) => fetchBlob(`/api/resume/builder/${id}/export/pdf`),

    // 9. Cover Letter
    coverLetterGenerate: (data: CoverLetterGenerateRequest) =>
        post<CoverLetterResponse>('/api/cover-letter/generate', data),
    coverLetterGet: (id: number) => get<CoverLetterResponse>(`/api/cover-letter/${id}`),
    coverLetterList: () => get<CoverLetterListResponse>('/api/cover-letter/list'),
    coverLetterExportPdf: (id: number) => fetchBlob(`/api/cover-letter/${id}/export/pdf`),

    // 10. Feedback
    submitFeedback: (data: FeedbackRequest) => post<FeedbackResponse>('/feedback', data),

    // 11. Health
    health: () => get<HealthResponse>('/health'),

    // 12. Interview Prep
    interviewStart: (data: InterviewStartRequest) => post<InterviewSessionResponse>('/api/interview/start', data),
    interviewGet: (id: number) => get<InterviewSessionResponse>(`/api/interview/session/${id}`),
    interviewAnswer: (data: InterviewAnswerRequest) => post<InterviewAnswerResponse>('/api/interview/answer', data),
    interviewHistory: () => get<InterviewHistoryResponse>('/api/interview/history'),

    // 13. Skill Quizzes
    quizStart: (skill: string) => post<QuizStartResponse>('/quizzes/start', { skill }),
    quizSubmit: (skill: string, answers: QuizAnswer[]) => post<QuizSubmitResponse>('/quizzes/submit', { skill, answers }),
    quizHistory: () => get<QuizHistoryResponse>('/api/quizzes/history'),

    // 14. Application Tracker
    trackerList: () => get<TrackerListResponse>('/api/tracker/list'),
    trackerAdd: (data: TrackerAddRequest) => post<TrackerApplicationResponse>('/tracker/add', data),
    trackerUpdateStatus: (id: number, status: TrackerStatus) => post<TrackerApplicationResponse>(`/tracker/${id}/status`, { status }),
    trackerEdit: (id: number, data: Partial<TrackerAddRequest>) => post<TrackerApplicationResponse>(`/tracker/${id}/edit`, data),
    trackerDelete: (id: number) => post<{ success: true }>(`/tracker/${id}/delete`, {}),

    // 15. Scorecard
    scorecardCreate: (resumeId?: number) => post<ScorecardCreateResponse>('/api/scorecard/create', { resume_id: resumeId }),
    scorecardGet: (token: string) => get<ScorecardGetResponse>(`/api/scorecard/${token}`),

    // 16. Progress
    progress: () => get<ProgressResponse>('/api/progress'),
} as const;

export { ApiError };
export default api;

