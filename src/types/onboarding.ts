// STEM Hub Onboarding Types
// Generated: October 5, 2025

import { Database } from './database';

// =====================================================
// User Roles
// =====================================================
export type UserRole = 'student' | 'teacher' | 'contributor' | 'parent';

// =====================================================
// Onboarding Step Types
// =====================================================
export type OnboardingStep =
    | 'role-selection'
    | 'authentication'
    | 'location'
    | 'school'
    | 'exam-board'
    | 'subjects'
    | 'goals'
    | 'complete';

export interface OnboardingProgress {
    currentStep: number;
    totalSteps: number;
    stepName: OnboardingStep;
    completed: boolean;
}

// =====================================================
// Student Profile Types
// =====================================================
export interface StudentProfile {
    id: string;
    user_id: string;

    // Location
    country: string | null;
    region: string | null;
    city: string | null;
    timezone: string;

    // School
    school_id: string | null;
    grade_level: string | null;

    // Academic
    exam_boards: string[];
    current_level: string | null;
    target_year: number | null;
    exam_date: string | null;

    // Personalization
    learning_style: string[];
    daily_study_minutes: number;

    // Notifications
    notifications: {
        study_reminders: boolean;
        content_alerts: boolean;
        community_updates: boolean;
        achievements: boolean;
    };

    // Metadata
    created_at: string;
    updated_at: string;
}

export interface CreateStudentProfileInput {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
    school_id?: string;
    exam_boards?: string[];
    current_level?: string;
    target_year?: number;
    exam_date?: string;
    learning_style?: string[];
    daily_study_minutes?: number;
    notifications?: Partial<StudentProfile['notifications']>;
}

// =====================================================
// Teacher Profile Types
// =====================================================
export interface TeacherProfile {
    id: string;
    user_id: string;
    school_id: string | null;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_document_url: string | null;
    subjects_taught: string[];
    bio: string | null;
    years_experience: number | null;
    created_at: string;
    updated_at: string;
}

// =====================================================
// Contributor Profile Types
// =====================================================
export interface ContributorProfile {
    id: string;
    user_id: string;
    application_status: 'pending' | 'approved' | 'rejected';
    application_text: string | null;
    portfolio_url: string | null;
    subjects_expertise: string[];
    contribution_count: number;
    rating: number;
    verified_badge: boolean;
    created_at: string;
    updated_at: string;
}

// =====================================================
// Parent Profile Types
// =====================================================
export interface ParentProfile {
    id: string;
    user_id: string;
    linked_students: string[];
    notification_preferences: {
        weekly_summary: boolean;
        achievement_alerts: boolean;
        concern_alerts: boolean;
    };
    created_at: string;
    updated_at: string;
}

// =====================================================
// School Types
// =====================================================
export interface School {
    id: string;
    name: string;
    country: string;
    region: string | null;
    city: string | null;
    address: string | null;
    coordinates: string | null;
    type: 'public' | 'private' | 'international' | 'other';
    verified: boolean;
    created_by: string | null;
    student_count: number;
    created_at: string;
    updated_at: string;
}

export interface CreateSchoolInput {
    name: string;
    country: string;
    region?: string;
    city?: string;
    address?: string;
    type: School['type'];
}

export interface SchoolWithStats extends School {
    students_on_platform: number;
}

// =====================================================
// Achievement Types
// =====================================================
export interface Achievement {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    points: number;
    category: string | null;
    requirement_type: string | null;
    requirement_value: number | null;
    created_at: string;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    unlocked_at: string;
    achievement?: Achievement;
}

// =====================================================
// Onboarding Analytics Types
// =====================================================
export interface OnboardingAnalytics {
    id: string;
    user_id: string;
    step: number;
    step_name: string;
    started_at: string;
    completed_at: string | null;
    time_spent_seconds: number | null;
    device_type: string | null;
    browser: string | null;
    created_at: string;
}

// =====================================================
// User Subject Types
// =====================================================
export interface UserSubject {
    id: string;
    user_id: string;
    subject_id: string;
    is_primary: boolean;
    target_grade: string | null;
    added_at: string;
    subject?: {
        id: string;
        name: string;
        icon: string | null;
        color: string | null;
    };
}

// =====================================================
// Exam Boards
// =====================================================
export const EXAM_BOARDS = {
    // Zimbabwe
    ZIMSEC: {
        id: 'zimsec',
        name: 'ZIMSEC',
        fullName: 'Zimbabwe School Examinations Council',
        country: 'Zimbabwe',
        levels: ['O-Level', 'A-Level']
    },

    // West Africa
    WAEC: {
        id: 'waec',
        name: 'WAEC',
        fullName: 'West African Examinations Council',
        country: ['Nigeria', 'Ghana', 'Sierra Leone', 'Liberia', 'Gambia'],
        levels: ['WASSCE']
    },

    // Kenya
    KCSE: {
        id: 'kcse',
        name: 'KCSE',
        fullName: 'Kenya Certificate of Secondary Education',
        country: 'Kenya',
        levels: ['KCSE']
    },

    // Tanzania
    NECTA: {
        id: 'necta',
        name: 'NECTA',
        fullName: 'National Examinations Council of Tanzania',
        country: 'Tanzania',
        levels: ['CSEE', 'ACSEE']
    },

    // International
    IGCSE: {
        id: 'igcse',
        name: 'IGCSE',
        fullName: 'International General Certificate of Secondary Education',
        country: 'International',
        levels: ['IGCSE', 'O-Level']
    },

    CAMBRIDGE_A_LEVEL: {
        id: 'cambridge-a-level',
        name: 'Cambridge A-Level',
        fullName: 'Cambridge International A-Level',
        country: 'International',
        levels: ['AS-Level', 'A-Level']
    },

    IB: {
        id: 'ib',
        name: 'IB',
        fullName: 'International Baccalaureate',
        country: 'International',
        levels: ['IB Diploma']
    }
} as const;

export type ExamBoardId = keyof typeof EXAM_BOARDS;

// =====================================================
// African Countries
// =====================================================
export const AFRICAN_COUNTRIES = [
    // Most popular (top 8)
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', popular: true },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', popular: true },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', popular: true },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', popular: true },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', popular: true },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', popular: true },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', popular: true },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', popular: true },

    // Other African countries (alphabetical)
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿', popular: false },
    { code: 'AO', name: 'Angola', flag: '🇦🇴', popular: false },
    { code: 'BJ', name: 'Benin', flag: '🇧🇯', popular: false },
    { code: 'BW', name: 'Botswana', flag: '🇧🇼', popular: false },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', popular: false },
    { code: 'BI', name: 'Burundi', flag: '🇧🇮', popular: false },
    { code: 'CM', name: 'Cameroon', flag: '🇨🇲', popular: false },
    { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', popular: false },
    { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', popular: false },
    { code: 'TD', name: 'Chad', flag: '🇹🇩', popular: false },
    { code: 'KM', name: 'Comoros', flag: '🇰🇲', popular: false },
    { code: 'CG', name: 'Congo', flag: '🇨🇬', popular: false },
    { code: 'CD', name: 'DR Congo', flag: '🇨🇩', popular: false },
    { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', popular: false },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', popular: false },
    { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', popular: false },
    { code: 'ER', name: 'Eritrea', flag: '🇪🇷', popular: false },
    { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', popular: false },
    { code: 'GA', name: 'Gabon', flag: '🇬🇦', popular: false },
    { code: 'GM', name: 'Gambia', flag: '🇬🇲', popular: false },
    { code: 'GN', name: 'Guinea', flag: '🇬🇳', popular: false },
    { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', popular: false },
    { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', popular: false },
    { code: 'LS', name: 'Lesotho', flag: '🇱🇸', popular: false },
    { code: 'LR', name: 'Liberia', flag: '🇱🇷', popular: false },
    { code: 'LY', name: 'Libya', flag: '🇱🇾', popular: false },
    { code: 'MG', name: 'Madagascar', flag: '🇲🇬', popular: false },
    { code: 'MW', name: 'Malawi', flag: '🇲🇼', popular: false },
    { code: 'ML', name: 'Mali', flag: '🇲🇱', popular: false },
    { code: 'MR', name: 'Mauritania', flag: '🇲🇷', popular: false },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺', popular: false },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', popular: false },
    { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', popular: false },
    { code: 'NA', name: 'Namibia', flag: '🇳🇦', popular: false },
    { code: 'NE', name: 'Niger', flag: '🇳🇪', popular: false },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼', popular: false },
    { code: 'ST', name: 'São Tomé and Príncipe', flag: '🇸🇹', popular: false },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳', popular: false },
    { code: 'SC', name: 'Seychelles', flag: '🇸🇨', popular: false },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', popular: false },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴', popular: false },
    { code: 'SS', name: 'South Sudan', flag: '🇸🇸', popular: false },
    { code: 'SD', name: 'Sudan', flag: '🇸🇩', popular: false },
    { code: 'TG', name: 'Togo', flag: '🇹🇬', popular: false },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', popular: false },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲', popular: false },
] as const;

export type CountryCode = typeof AFRICAN_COUNTRIES[number]['code'];

// =====================================================
// Learning Styles
// =====================================================
export const LEARNING_STYLES = [
    { id: 'reading', label: 'I prefer reading notes', icon: '📖' },
    { id: 'videos', label: 'I learn best with videos', icon: '🎥' },
    { id: 'practice', label: 'I like practice questions', icon: '✏️' },
    { id: 'quizzes', label: 'I enjoy interactive quizzes', icon: '🎮' },
    { id: 'groups', label: 'I want to join study groups', icon: '🤝' },
] as const;

export type LearningStyleId = typeof LEARNING_STYLES[number]['id'];

// =====================================================
// Study Time Options
// =====================================================
export const STUDY_TIME_OPTIONS = [
    { minutes: 30, label: '30 min' },
    { minutes: 60, label: '1 hr' },
    { minutes: 120, label: '2 hrs' },
    { minutes: 180, label: '3 hrs' },
    { minutes: 240, label: '4+ hrs' },
] as const;

// =====================================================
// Helper Functions
// =====================================================
export function getExamBoardsByCountry(country: string): typeof EXAM_BOARDS[ExamBoardId][] {
    return Object.values(EXAM_BOARDS).filter(board => {
        if (Array.isArray(board.country)) {
            return board.country.includes(country);
        }
        return board.country === country || board.country === 'International';
    });
}

export function getPopularCountries() {
    return AFRICAN_COUNTRIES.filter(c => c.popular);
}

export function getCountryByCode(code: string) {
    return AFRICAN_COUNTRIES.find(c => c.code === code);
}
