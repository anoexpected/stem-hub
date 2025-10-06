'use client';

import { User } from '@supabase/supabase-js';
import { Bell, Settings, LogOut, BookOpen, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface DashboardHeaderProps {
    user: any;
    profile: any;
    streak: any;
}

export default function DashboardHeader({ user, profile, streak }: DashboardHeaderProps) {
    const router = useRouter();
    const greeting = getGreeting();
    const firstName = user.full_name?.split(' ')[0] || 'Student';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <header className="bg-gradient-to-r from-[#1B2A4C] to-[#16A085] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-6">
                    {/* Left: Greeting & Info */}
                    <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="relative">
                            {user.avatar_url ? (
                                <Image
                                    src={user.avatar_url}
                                    alt={user.full_name || 'User'}
                                    width={56}
                                    height={56}
                                    className="rounded-full ring-4 ring-white/20"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-[#2ECC71] flex items-center justify-center text-white font-bold text-xl ring-4 ring-white/20">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {streak && streak.current_streak > 0 && (
                                <div className="absolute -bottom-1 -right-1 bg-[#F1C40F] text-[#1B2A4C] text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
                                    🔥 {streak.current_streak}
                                </div>
                            )}
                        </div>

                        {/* Text */}
                        <div>
                            <h1 className="text-2xl font-bold">
                                {greeting}, {firstName}!
                            </h1>
                            <p className="text-blue-100 text-sm mt-0.5">
                                {profile.school?.name} • {profile.current_level}
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/learn/dashboard"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Dashboard"
                            title="Dashboard"
                        >
                            <Home className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/learn/subjects"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="My Subjects"
                            title="My Subjects"
                        >
                            <BookOpen className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/settings"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/notifications"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E74C3C] rounded-full"></span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-2"
                            aria-label="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}
