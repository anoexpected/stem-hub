import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export const metadata = {
    title: 'Settings | STEM Hub',
    description: 'Manage your account settings',
};

export default async function SettingsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    const { data: profile } = await supabase
        .from('student_profiles')
        .select('*, school:schools(name)')
        .eq('user_id', user.id)
        .single();

    const settingsSections = [
        {
            icon: User,
            title: 'Profile',
            description: 'Update your personal information',
            href: '/settings/profile',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Manage your notification preferences',
            href: '/settings/notifications',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            icon: Shield,
            title: 'Privacy & Security',
            description: 'Control your privacy and security settings',
            href: '/settings/security',
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            icon: Palette,
            title: 'Appearance',
            description: 'Customize your learning experience',
            href: '/settings/appearance',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            icon: Globe,
            title: 'Language & Region',
            description: 'Set your language and regional preferences',
            href: '/settings/region',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/learn/dashboard"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                            <p className="text-sm text-gray-600 mt-0.5">
                                Manage your account and preferences
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2ECC71] to-[#27AE60] flex items-center justify-center text-white text-2xl font-bold">
                            {userData?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{userData?.full_name}</h2>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {profile?.school?.name} • {profile?.current_level}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settingsSections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <Link
                                key={section.title}
                                href={section.href}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`${section.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-6 h-6 ${section.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                            {section.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{section.description}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Account Actions */}
                <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                            Export my data
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                            Delete my account
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
