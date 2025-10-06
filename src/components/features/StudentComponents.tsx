// Student-specific UI components for content discovery and navigation

import Link from 'next/link';
import { Eye, Clock, Star, User, BookOpen, FileText, HelpCircle } from 'lucide-react';

// Subject Card Component
interface SubjectCardProps {
    slug: string;
    name: string;
    icon: string;
    description?: string;
    notesCount: number;
    quizzesCount: number;
    color: string;
}

export function SubjectCard({
    slug,
    name,
    icon,
    description,
    notesCount,
    quizzesCount,
    color
}: SubjectCardProps) {
    return (
        <Link href={`/subjects/${slug}`}>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6 h-full group cursor-pointer">
                <div className="flex items-start space-x-4">
                    <div
                        className="text-4xl flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${color}15` }}
                    >
                        {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-[#1B2A4C] mb-2 font-['Poppins'] group-hover:text-[#2ECC71] transition-colors">
                            {name}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {description}
                            </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{notesCount} notes</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <HelpCircle className="w-4 h-4" />
                                <span>{quizzesCount} quizzes</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Note Preview Card Component
interface NotePreviewCardProps {
    id: string;
    title: string;
    excerpt?: string;
    author: string;
    viewCount?: number;
    rating?: number;
    readTime?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    topicName?: string;
    subjectName?: string;
    createdAt: string;
}

export function NotePreviewCard({
    id,
    title,
    excerpt,
    author,
    viewCount = 0,
    rating,
    readTime,
    difficulty,
    topicName,
    subjectName,
    createdAt,
}: NotePreviewCardProps) {
    const difficultyColors = {
        beginner: 'bg-green-100 text-green-800',
        intermediate: 'bg-yellow-100 text-yellow-800',
        advanced: 'bg-red-100 text-red-800',
    };

    return (
        <Link href={`/notes/${id}`}>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6 h-full group cursor-pointer">
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-[#1B2A4C] mb-2 font-['Poppins'] group-hover:text-[#2ECC71] transition-colors line-clamp-2">
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {excerpt}
                        </p>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    {subjectName && (
                        <span className="px-2 py-1 bg-[#1B2A4C]/10 text-[#1B2A4C] rounded-full">
                            {subjectName}
                        </span>
                    )}
                    {topicName && (
                        <span className="px-2 py-1 bg-[#2ECC71]/10 text-[#2ECC71] rounded-full">
                            {topicName}
                        </span>
                    )}
                    {difficulty && (
                        <span className={`px-2 py-1 rounded-full ${difficultyColors[difficulty]}`}>
                            {difficulty}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span className="truncate max-w-[100px]">{author}</span>
                        </span>
                        {readTime && (
                            <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{readTime}</span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        {rating && (
                            <span className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-[#F1C40F] text-[#F1C40F]" />
                                <span>{rating.toFixed(1)}</span>
                            </span>
                        )}
                        <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{viewCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Quick Action Card Component
interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string;
}

export function QuickActionCard({ title, description, icon, href, color }: QuickActionCardProps) {
    return (
        <Link href={href}>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-6 h-full group cursor-pointer">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <div style={{ color }}>{icon}</div>
                </div>
                <h3 className="text-lg font-bold text-[#1B2A4C] mb-2 font-['Poppins'] group-hover:text-[#2ECC71] transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>
        </Link>
    );
}

// Topic List Item Component
interface TopicListItemProps {
    id: string;
    name: string;
    description?: string;
    notesCount: number;
    quizzesCount: number;
    pastPapersCount?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    progress?: number;
}

export function TopicListItem({
    id,
    name,
    description,
    notesCount,
    quizzesCount,
    pastPapersCount = 0,
    difficulty,
    progress,
}: TopicListItemProps) {
    const difficultyColors = {
        beginner: 'text-green-600',
        intermediate: 'text-yellow-600',
        advanced: 'text-red-600',
    };

    return (
        <Link href={`/topics/${id}`}>
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-[#1B2A4C] font-['Poppins'] group-hover:text-[#2ECC71] transition-colors flex-1">
                        {name}
                    </h4>
                    {difficulty && (
                        <span className={`text-xs font-medium ${difficultyColors[difficulty]} capitalize`}>
                            {difficulty}
                        </span>
                    )}
                </div>

                {description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{notesCount} notes</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>{quizzesCount} quizzes</span>
                    </span>
                    {pastPapersCount > 0 && (
                        <span className="flex items-center space-x-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{pastPapersCount} papers</span>
                        </span>
                    )}
                </div>

                {progress !== undefined && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#2ECC71] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

// Streak Display Component
interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
    return (
        <div className="bg-gradient-to-r from-[#F1C40F] to-[#E67E22] rounded-lg p-6 text-white">
            <div className="flex items-center space-x-4">
                <div className="text-5xl">🔥</div>
                <div>
                    <div className="text-3xl font-bold font-['Poppins']">{currentStreak} Days</div>
                    <p className="text-sm opacity-90">Current Streak</p>
                    <p className="text-xs opacity-75 mt-1">Longest: {longestStreak} days</p>
                </div>
            </div>
        </div>
    );
}

// Breadcrumb Component
interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    {index > 0 && <span>/</span>}
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#2ECC71] transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-[#1B2A4C] font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
