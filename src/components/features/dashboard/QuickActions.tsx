'use client';

import { Zap, Book, Brain, Users } from 'lucide-react';
import Link from 'next/link';

interface QuickActionsProps {
    examBoards: string[];
}

export default function QuickActions({ examBoards }: QuickActionsProps) {
    const actions = [
        {
            icon: Zap,
            label: 'Practice Now',
            description: 'Random questions',
            href: '/practice/quick',
            color: 'from-[#2ECC71] to-[#27AE60]',
            iconColor: 'text-white',
        },
        {
            icon: Book,
            label: 'Browse Notes',
            description: 'Study materials',
            href: '/notes',
            color: 'from-[#3498DB] to-[#2980B9]',
            iconColor: 'text-white',
        },
        {
            icon: Brain,
            label: 'AI Tutor',
            description: 'Get help instantly',
            href: '/ai-tutor',
            color: 'from-[#8E44AD] to-[#9B59B6]',
            iconColor: 'text-white',
        },
        {
            icon: Users,
            label: 'Study Groups',
            description: 'Learn together',
            href: '/study-groups',
            color: 'from-[#D35400] to-[#E67E22]',
            iconColor: 'text-white',
        },
    ];

    return (
        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all overflow-hidden"
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                            {/* Content */}
                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-3`}>
                                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-[#2ECC71] transition-colors">
                                    {action.label}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
