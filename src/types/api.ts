/* ──────────────────────────────────────────────────────────────
   Applyce API – TypeScript type definitions
   Matches the Flask backend API reference exactly.
   ────────────────────────────────────────────────────────────── */

// ── Generic wrapper ──────────────────────────────────────────
export interface ApiError {
    success: false;
    error: string;
}

// ── 1. Career Prediction ─────────────────────────────────────
export interface PredictRequest {
    skills: string;
    interests: string;
}

export interface CareerPrediction {
    career: string;
    confidence: number;
}

export interface PredictResponse {
    success: true;
    predictions: CareerPrediction[];
}

// ── 2. Resume Analysis ───────────────────────────────────────
export interface SkillsAnalysis {
    missing_required: string[];
    total_required: number;
    total_matching: number;
}

export interface SkillGap {
    matching_skills: string[];
    missing_skills: string[];
    match_percentage: number;
    skills_analysis: SkillsAnalysis;
}

export interface EstimatedSalary {
    min: number;
    max: number;
    mid: number;
    currency: string;
}

export interface AtsData {
    overall_score?: number;
    keyword_score?: number;
    format_score?: number;
    section_score?: number;
    [key: string]: unknown;
}

export interface AnalyzeResumeResponse {
    success: true;
    name: string;
    skills: string[];
    predictions: CareerPrediction[];
    skill_gap: SkillGap;
    estimated_salary: EstimatedSalary;
    overall_score?: number;
    ats_data?: AtsData;
    quality_tips?: string[];
    improvements?: string[];
    education?: string[];
    experience?: string[];
    projects?: string[];
    certifications?: string[];
}

// ── 3. Skill Gap Analysis ────────────────────────────────────
export interface SkillGapRequest {
    skills: string[];
    career: string;
}

export interface SkillGapResponse {
    success: true;
    analysis: SkillGap;
}

// ── 4. Career Roadmap ────────────────────────────────────────
export interface RoadmapResource {
    name: string;
    platform: string;
    type: 'free' | 'paid' | 'general';
    url: string;
}

export interface RoadmapPhase {
    name: string;
    duration: string;
    skills: string[];
    resources?: RoadmapResource[];
}

export interface Roadmap {
    title: string;
    phases: RoadmapPhase[];
}

export interface RoadmapResponse {
    success: true;
    career: string;
    roadmap: Roadmap;
}

// ── 5. Explainable Resume Scoring ────────────────────────────
export interface ExplainableScoreRequest {
    resume_text: string;
    target_role: string;
    detected_skills: string[];
}

export interface ExplainableScoreResponse {
    success: true;
    overall_score: number;
    categories: Record<string, unknown>;
}

// ── 6. Dashboard & Score Trends ──────────────────────────────
export interface ScoreHistoryEntry {
    date: string;
    score: number;
}

export interface SkillsOverTimeEntry {
    date: string;
    count: number;
}

export interface DashboardStatsResponse {
    success: true;
    score_history: ScoreHistoryEntry[];
    total_resumes: number;
    skills_over_time: SkillsOverTimeEntry[];
}

export interface ScoreTrendsSummary {
    total_scans: number;
    first_score: number;
    latest_score: number;
    best_score: number;
    total_improvement: number;
    average_score: number;
}

export interface ScoreTrends {
    dates: string[];
    overall_scores: number[];
    ats_scores: number[];
    skill_counts: number[];
}

export interface ScoreTrendsResponse {
    success: true;
    has_data: boolean;
    trends: ScoreTrends;
    summary: ScoreTrendsSummary;
}

// ── 7. Job Market ────────────────────────────────────────────
export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    salary_min: number;
    salary_max: number;
    salary_currency: string;
    skills_required: string[];
    job_type: string;
    experience_level: string;
    posted_date: string;
    source: string;
    is_remote: boolean;
    match_score: number;
    matching_skills: string[];
    missing_skills: string[];
}

export interface JobSearchParams {
    career: string;
    location?: string;
    skills?: string;
    limit?: number;
    remote?: string;
}

export interface JobSearchResponse {
    success: true;
    count: number;
    career: string;
    location: string;
    jobs: Job[];
}

export interface JobInsights {
    total_jobs: number;
    jobs_fetched: number;
    avg_salary_min: number;
    avg_salary_max: number;
    top_companies: string[];
    hot_skills: string[];
    growth_rate: string;
    demand_level: string;
    remote_percentage: number;
}

export interface JobInsightsResponse {
    success: true;
    career: string;
    location: string;
    insights: JobInsights;
}

export interface JobMatchRequest {
    resume_text?: string;
    resume_id?: number;
    job_description: string;
    required_skills: string[];
    preferred_skills?: string[];
}

export interface JobMatchResponse {
    success: true;
    match_percentage: number;
    semantic_similarity: number;
    required_matched: string[];
    preferred_matched: string[];
    missing_required: string[];
    missing_preferred: string[];
    total_resume_skills: number;
    total_required_skills: number;
    total_preferred_skills: number;
    recommendation: string;
}

// ── 8. Resume Builder ────────────────────────────────────────
export interface ResumeProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
}

export interface ResumeExperience {
    company: string;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface ResumeEducation {
    institution: string;
    degree: string;
    start_date: string;
    end_date: string;
}

export interface ResumeProject {
    name: string;
    description: string;
    link?: string;
}

export interface ResumeSkills {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
}

export interface ResumeData {
    profile: ResumeProfile;
    summary: string;
    experience: ResumeExperience[];
    education: ResumeEducation[];
    projects: ResumeProject[];
    skills: ResumeSkills;
}

export type TemplateName = 'classic_ats' | 'minimal_ats' | 'modern_ats';

export interface ResumeBuilderCreateRequest {
    title: string;
    template_name: TemplateName;
    data: ResumeData;
}

export interface ResumeRecord {
    id: number;
    title: string;
    template_name: TemplateName;
    data_json: ResumeData;
    created_at: string;
    updated_at: string;
}

export interface ResumeBuilderResponse {
    success: true;
    resume: ResumeRecord;
}

export interface ResumeBuilderListResponse {
    success: true;
    resumes: ResumeRecord[];
}

// ── 9. Cover Letter ──────────────────────────────────────────
export type CoverLetterTone = 'formal' | 'friendly' | 'confident';
export type CoverLetterLength = 'short' | 'normal' | 'long';

export interface CoverLetterGenerateRequest {
    job_title: string;
    company: string;
    job_url?: string;
    job_description: string;
    tone: CoverLetterTone;
    length: CoverLetterLength;
}

export interface CoverLetterRecord {
    id: number;
    job_title: string;
    company: string;
    job_url?: string;
    body_text: string;
    tone: CoverLetterTone;
    length: CoverLetterLength;
    created_at: string;
}

export interface CoverLetterResponse {
    success: true;
    cover_letter: CoverLetterRecord;
}

export interface CoverLetterListResponse {
    success: true;
    cover_letters: CoverLetterRecord[];
}

// ── 10. Feedback ─────────────────────────────────────────────
export interface FeedbackRequest {
    feedback_type: string;
    predicted_career?: string;
    correct_career?: string;
    skills?: string[];
    comments?: string;
}

export interface FeedbackResponse {
    success: true;
    message: string;
}

// ── 11. Health Check ─────────────────────────────────────────
export interface HealthResponse {
    status: string;
    timestamp: string;
}

// ── 12. Interview Prep ───────────────────────────────────────
export interface InterviewStartRequest {
    career: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category?: string;
    count?: number;
}

export interface InterviewQuestion {
    question: string;
    category?: string;
    difficulty?: string;
}

export interface InterviewEvaluation {
    score: number;
    feedback: string;
    strengths?: string[];
    improvements?: string[];
}

export interface InterviewSession {
    id: number;
    career: string;
    difficulty: string;
    category?: string;
    questions_json: InterviewQuestion[];
    answers_json: Array<{ answer: string; submitted_at: string } | null>;
    scores_json: Array<InterviewEvaluation | null>;
    total_questions: number;
    answered_count: number;
    overall_score: number | null;
    is_complete: boolean;
    created_at: string;
    completed_at?: string;
}

export interface InterviewSessionResponse {
    success: true;
    session: InterviewSession;
}

export interface InterviewAnswerRequest {
    session_id: number;
    question_index: number;
    answer: string;
}

export interface InterviewAnswerResponse {
    success: true;
    evaluation: InterviewEvaluation;
    answered_count: number;
    is_complete: boolean;
    overall_score: number | null;
}

export interface InterviewHistoryResponse {
    success: true;
    sessions: InterviewSession[];
}

// ── 13. Skill Quizzes ────────────────────────────────────────
export interface QuizQuestion {
    index: number;
    question: string;
    options: string[];
}

export interface QuizStartResponse {
    success: true;
    skill: string;
    questions: QuizQuestion[];
    total: number;
}

export interface QuizAnswer {
    index: number;
    selected: number;
}

export interface QuizResult {
    index: number;
    question: string;
    options: string[];
    selected: number;
    correct: number;
    is_correct: boolean;
    explanation: string;
}

export interface QuizSubmitResponse {
    success: true;
    quiz_id: number;
    skill: string;
    score: number;
    total: number;
    percentage: number;
    results: QuizResult[];
}

export interface QuizHistoryEntry {
    id: number;
    skill: string;
    score: number;
    total: number;
    completed_at: string;
}

export interface QuizHistoryResponse {
    success: true;
    quizzes: QuizHistoryEntry[];
}

// ── 14. Application Tracker ──────────────────────────────────
export type TrackerStatus = 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';

export interface TrackerApplication {
    id: number;
    job_title: string;
    company: string;
    location?: string;
    job_url?: string;
    salary_range?: string;
    status: TrackerStatus;
    notes?: string;
    contact_name?: string;
    contact_email?: string;
    match_score?: number;
    created_at: string;
    updated_at: string;
}

export interface TrackerStats {
    total: number;
    applied: number;
    interviewing: number;
    offered: number;
    rejected: number;
}

export interface TrackerListResponse {
    success: true;
    applications: TrackerApplication[];
    stats: TrackerStats;
}

export interface TrackerAddRequest {
    job_title: string;
    company: string;
    location?: string;
    job_url?: string;
    salary_range?: string;
    status?: TrackerStatus;
    notes?: string;
    contact_name?: string;
    contact_email?: string;
    match_score?: number;
}

export interface TrackerApplicationResponse {
    success: true;
    application: TrackerApplication;
}

// ── 15. Shareable Scorecard ──────────────────────────────────
export interface ScorecardCreateResponse {
    success: true;
    share_token: string;
    share_url: string;
}

export interface ScorecardData {
    overall_score: number;
    ats_score: number;
    keyword_score: number;
    format_score: number;
    section_score: number;
    predicted_career: string;
    career_confidence: number;
    top_careers: Array<{ career: string; confidence: number }>;
    skills_detected: string[];
    skill_count: number;
    predicted_salary_min: number;
    predicted_salary_max: number;
    upload_date: string;
}

export interface ScorecardGetResponse {
    success: true;
    scorecard: ScorecardData;
}

// ── 16. Progress Report ──────────────────────────────────────
export interface ProgressResponse {
    success: true;
    [key: string]: unknown;
}
