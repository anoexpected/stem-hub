'use client';

import { useState } from 'react';
import { Beaker, Calculator, Microscope, Cpu, Atom, Plus, Check, Trash2, BookOpen, FileText, Brain } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SubjectCardProps {
    subject: any;
    userId: string;
    isSelected: boolean;
}

const subjectIcons: Record<string, any> = {
    Mathematics: Calculator,
    Physics: Atom,
    Chemistry: Beaker,
    Biology: Microscope,
    'Computer Science': Cpu,
};

const subjectColors: Record<string, { gradient: string; light: string; icon: string }> = {
    Mathematics: {
        gradient: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        icon: 'text-blue-600',
    },
    Physics: {
        gradient: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50',
        icon: 'text-purple-600',
    },
    Chemistry: {
        gradient: 'from-green-500 to-green-600',
        light: 'bg-green-50',
        icon: 'text-green-600',
    },
    Biology: {
        gradient: 'from-emerald-500 to-emerald-600',
        light: 'bg-emerald-50',
        icon: 'text-emerald-600',
    },
    'Computer Science': {
        gradient: 'from-indigo-500 to-indigo-600',
        light: 'bg-indigo-50',
        icon: 'text-indigo-600',
    },
};

export default function SubjectCard({ subject, userId, isSelected }: SubjectCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const Icon = subjectIcons[subject.name] || BookOpen;
    const colors = subjectColors[subject.name] || subjectColors.Mathematics;
    const topicsCount = subject.topics?.length || 0;

    const handleAddSubject = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_subjects')
                .insert({
                    user_id: userId,
                    subject_id: subject.id,
                });

            if (error) throw error;

            toast.success(`${subject.name} added successfully!`);
            router.refresh();
        } catch (error: any) {
            console.error('Error adding subject:', error);
            toast.error('Failed to add subject');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSubject = async () => {
        if (!confirm(`Are you sure you want to remove ${subject.name}? Your progress will be kept.`)) {
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_subjects')
                .delete()
                .eq('user_id', userId)
                .eq('subject_id', subject.id);

            if (error) throw error;

            toast.success(`${subject.name} removed successfully!`);
            router.refresh();
        } catch (error: any) {
            console.error('Error removing subject:', error);
            toast.error('Failed to remove subject');
        } finally {
            setLoading(false);
        }
    };

    if (isSelected) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-br ${colors.gradient}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-white">
                                    {subject.name}
                                </h3>
                                <p className="text-xs text-white/80 mt-0.5">
                                    {subject.exam_boards?.code || subject.exam_board?.code}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {subject.description || `Study ${subject.name} with comprehensive notes, quizzes, and past papers.`}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className={`${colors.light} rounded-lg p-3 text-center`}>
                            <FileText className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
                            <p className="text-xs text-gray-600 font-medium">{topicsCount}</p>
                            <p className="text-xs text-gray-500">Topics</p>
                        </div>
                        <div className={`${colors.light} rounded-lg p-3 text-center`}>
                            <BookOpen className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
                            <p className="text-xs text-gray-600 font-medium">Notes</p>
                            <p className="text-xs text-gray-500">Available</p>
                        </div>
                        <div className={`${colors.light} rounded-lg p-3 text-center`}>
                            <Brain className={`w-4 h-4 ${colors.icon} mx-auto mb-1`} />
                            <p className="text-xs text-gray-600 font-medium">Quizzes</p>
                            <p className="text-xs text-gray-500">Ready</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                        <Link
                            href={`/learn/subjects/${subject.code}`}
                            className={`flex-1 py-2 px-4 bg-gradient-to-r ${colors.gradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all text-center`}
                        >
                            View Resources
                        </Link>
                        <button
                            onClick={handleRemoveSubject}
                            disabled={loading}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                            title="Remove subject"
                        >
                            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            {/* Header */}
            <div className={`p-6 ${colors.light}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                            <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">
                                {subject.name}
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5">
                                {subject.exam_boards?.code || subject.exam_board?.code}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {subject.description || `Study ${subject.name} with comprehensive notes, quizzes, and past papers.`}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <FileText className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 font-medium">{topicsCount}</p>
                        <p className="text-xs text-gray-500">Topics</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <BookOpen className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 font-medium">Notes</p>
                        <p className="text-xs text-gray-500">Available</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <Brain className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 font-medium">Quizzes</p>
                        <p className="text-xs text-gray-500">Ready</p>
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAddSubject}
                    disabled={loading}
                    className="w-full py-2 px-4 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{loading ? 'Adding...' : 'Add Subject'}</span>
                </button>
            </div>
        </div>
    );
}
