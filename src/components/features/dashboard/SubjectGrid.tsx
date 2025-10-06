'use client';

import { Beaker, Calculator, Microscope, Cpu, Atom } from 'lucide-react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface SubjectGridProps {
    subjects: any[];
    progressData: any[];
}

// Icon mapping for STEM subjects
const subjectIcons: Record<string, LucideIcon> = {
    Mathematics: Calculator,
    Physics: Atom,
    Chemistry: Beaker,
    Biology: Microscope,
    'Computer Science': Cpu,
};

// Color mapping for STEM subjects (using brand colors)
const subjectColors: Record<string, { gradient: string; icon: string; border: string }> = {
    Mathematics: {
        gradient: 'from-blue-500 to-blue-600',
        icon: 'text-blue-600',
        border: 'border-blue-200',
    },
    Physics: {
        gradient: 'from-purple-500 to-purple-600',
        icon: 'text-purple-600',
        border: 'border-purple-200',
    },
    Chemistry: {
        gradient: 'from-green-500 to-green-600',
        icon: 'text-green-600',
        border: 'border-green-200',
    },
    Biology: {
        gradient: 'from-emerald-500 to-emerald-600',
        icon: 'text-emerald-600',
        border: 'border-emerald-200',
    },
    'Computer Science': {
        gradient: 'from-indigo-500 to-indigo-600',
        icon: 'text-indigo-600',
        border: 'border-indigo-200',
    },
};

export default function SubjectGrid({ subjects, progressData }: SubjectGridProps) {
    if (!subjects || subjects.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calculator className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Add subjects to your profile to start your learning journey!
                    </p>
                    <Link
                        href="/learn/subjects"
                        className="inline-flex items-center px-6 py-3 bg-[#2ECC71] text-white font-medium rounded-lg hover:bg-[#27AE60] transition-colors"
                    >
                        Add Subjects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => {
                const Icon = subjectIcons[subject.name] || Calculator;
                const colors = subjectColors[subject.name] || subjectColors.Mathematics;

                // Calculate progress for this subject
                const subjectTopicIds = subject.topics?.map((t: any) => t.id) || [];
                const subjectProgress = progressData.filter((p) =>
                    subjectTopicIds.includes(p.topic_id)
                );

                const totalQuestions = subjectProgress.reduce(
                    (sum, p) => sum + (p.questions_attempted || 0),
                    0
                );

                const correctQuestions = subjectProgress.reduce(
                    (sum, p) => sum + (p.questions_correct || 0),
                    0
                );

                const accuracy =
                    totalQuestions > 0
                        ? Math.round((correctQuestions / totalQuestions) * 100)
                        : 0;

                const topicsCount = subject.topics?.filter((t: any) => t.is_active)?.length || 0;
                const topicsStudied = subjectProgress.length;
                const progressPercent =
                    topicsCount > 0 ? Math.round((topicsStudied / topicsCount) * 100) : 0;

                return (
                    <Link
                        key={subject.id}
                        href={`/learn/subjects/${subject.code}`}
                        className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
                    >
                        {/* Header with Icon */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.gradient}`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#2ECC71] transition-colors">
                                            {subject.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {subject.exam_board?.name} • {topicsCount} topics
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-gray-600 font-medium">Progress</span>
                                        <span className="text-gray-900 font-semibold">{progressPercent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${colors.gradient} transition-all rounded-full`}
                                            style={{ width: `${progressPercent}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs text-gray-600">Topics</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {topicsStudied}/{topicsCount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Questions</p>
                                        <p className="text-lg font-bold text-gray-900">{totalQuestions}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Accuracy</p>
                                        <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
