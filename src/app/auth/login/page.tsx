'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// We perform email/password login on the client to ensure PKCE/session cookies
// are written in the browser, avoiding redirects back to the login page.

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [intendedRole, setIntendedRole] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is coming from a "Become Contributor" or similar link
        const role = searchParams.get('intended_role');
        if (role) {
            setIntendedRole(role);
            // Store in sessionStorage so it persists through OAuth flow
            sessionStorage.setItem('intended_role', role);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        if (!formData.get('email') || !formData.get('password')) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const email = String(formData.get('email'));
            const password = String(formData.get('password'));

            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            const user = data.user;
            if (!user) throw new Error('No user data returned');

            // Fetch role and onboarding status
            const { data: userData, error: userErr } = await supabase
                .from('users')
                .select('role, onboarding_completed, onboarding_step, must_change_password')
                .eq('id', user.id)
                .single();

            if (userErr && (userErr as any).code === 'PGRST116') {
                // Create minimal record for first-time email/password users
                await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    role: 'student',
                    onboarding_completed: false,
                    onboarding_step: 1,
                });
                // Try to create student profile, ignore if it already exists
                try {
                    await supabase.from('student_profiles').insert({ user_id: user.id });
                } catch (e) {
                    // Profile might already exist, ignore error
                }
                router.push('/auth/onboarding/location');
                return;
            }

            const role = userData?.role || 'student';
            const completed = !!userData?.onboarding_completed;
            const step = userData?.onboarding_step ?? 0;

            console.log('Login success:', { role, completed, step, userId: user.id });

            // Clear any intended role - we accept whatever role the user has
            // (Admin can access everything, so no need to enforce intended role)
            sessionStorage.removeItem('intended_role');

            // Check if user must change password (for invited users)
            if (userData?.must_change_password) {
                window.location.href = '/auth/change-password';
                return;
            }

            // Only students need to complete onboarding
            // Contributors, admins, teachers, and parents skip onboarding
            if (role === 'student' && !completed) {
                const stepRoutes: Record<number, string> = {
                    0: '/auth/onboarding/location',
                    1: '/auth/onboarding/location',
                    2: '/auth/onboarding/school',
                    3: '/auth/onboarding/exam-board',
                    4: '/auth/onboarding/subjects',
                    5: '/auth/onboarding/goals',
                };
                const redirectTo = stepRoutes[step] || '/auth/onboarding/location';
                console.log('Redirecting to onboarding:', redirectTo);
                router.push(redirectTo);
                return;
            }

            // Completed onboarding → role-based redirect
            const roleRoutes: Record<string, string> = {
                admin: '/admin',
                contributor: '/contribute',
                teacher: '/dashboard',
                parent: '/dashboard',
                student: '/learn/dashboard',
            };
            const redirectTo = roleRoutes[role] || '/learn/dashboard';
            console.log('Redirecting to dashboard:', redirectTo);

            // Use window.location for full page reload (needed for server components)
            setLoading(false);
            window.location.href = redirectTo;
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to log in. Please check your credentials.');
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        setGoogleLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            });

            if (error) {
                console.error('OAuth initiation error:', error);
                throw error;
            }

            console.log('OAuth initiated, redirecting to Google...');
            // The browser will redirect automatically, no need to call router.push

            if (error) throw error;
        } catch (err: any) {
            console.error('Google sign in error:', err);
            setError(err.message || 'Failed to sign in with Google');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-whisper px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-h2 font-display font-bold text-primary">
                            STEM Hub
                        </h1>
                    </Link>
                    <h2 className="text-h3 font-display font-semibold text-charcoal mb-2">
                        Welcome Back!
                    </h2>
                    <p className="text-body text-muted-foreground">
                        {intendedRole === 'contributor'
                            ? 'Log in with your contributor account'
                            : intendedRole === 'admin'
                                ? 'Log in with your admin account'
                                : 'Log in to continue your learning journey'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-default p-8">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading || loading}
                        className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 border-2 border-silver rounded-lg hover:border-secondary hover:bg-whisper transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-silver"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-muted-foreground">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-charcoal mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-charcoal"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/auth/reset-password"
                                    className="text-sm text-secondary hover:text-success"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-error/10 border border-error/20 rounded-md">
                                <p className="text-sm text-error">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-secondary hover:bg-success text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/auth/select-role"
                            className="text-secondary hover:text-success font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
