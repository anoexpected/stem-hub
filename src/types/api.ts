// API Response Types

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// API Request Types
export interface GenerateQuestionsRequest {
    topic_id: string;
    count?: number;
    difficulty?: string;
    question_types?: string[];
}

export interface SubmitAnswerRequest {
    question_id: string;
    user_answer: string;
    time_taken_seconds?: number;
}

export interface SaveProgressRequest {
    topic_id: string;
    questions_attempted: number;
    questions_correct: number;
    marks_achieved: number;
    total_marks: number;
}

export interface CreateSessionRequest {
    topic_id: string;
    questions_data: Record<string, any>;
    duration_seconds: number;
}
