'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('Completing sign in...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log('[Callback] Starting OAuth callback handling...');
                console.log('[Callback] URL:', window.location.href);
                setStatus('Completing sign in...');

                // Check for error in URL params
                const errorParam = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (errorParam) {
                    console.error('[Callback] OAuth error:', errorParam, errorDescription);
                    setError(errorDescription || errorParam);
                    setTimeout(() => {
                        window.location.href = '/auth/login?error=oauth_failed';
                    }, 2000);
                    return;
                }

                // Supabase client automatically handles PKCE code exchange
                // The code_verifier is stored in localStorage, and Supabase will exchange it
                console.log('[Callback] Waiting for PKCE exchange...');

                // Wait for automatic exchange (reduced from 2500ms to 1500ms)
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Get the session after exchange
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                console.log('[Callback] Session check:', session ? 'Session exists' : 'No session', sessionError);

                if (sessionError) {
                    console.error('[Callback] Session error:', sessionError);
                    setError(sessionError.message);
                    setTimeout(() => {
                        window.location.href = '/auth/login?error=session_failed';
                    }, 2000);
                    return;
                }

                if (!session || !session.user) {
                    console.error('[Callback] No session after PKCE exchange');
                    setError('Failed to complete authentication. Please try again.');
                    setTimeout(() => {
                        window.location.href = '/auth/login?error=no_session';
                    }, 2000);
                    return;
                }

                const user = session.user;
                console.log('[Callback] ✓ Session established for:', user.email);
                setStatus('Checking your account...');

                // Check if user exists in database
                console.log('[Callback] Querying users table for user:', user.id);

                // Try multiple times with exponential backoff
                let userData = null;
                let userError = null;
                let attempts = 0;
                const maxAttempts = 3;

                while (attempts < maxAttempts && !userData) {
                    attempts++;
                    console.log(`[Callback] Query attempt ${attempts}/${maxAttempts}`);

                    const result = await supabase
                        .from('users')
                        .select('role, onboarding_completed, onboarding_step')
                        .eq('id', user.id)
                        .single();

                    userData = result.data;
                    userError = result.error;

                    console.log('[Callback] Query result:', { userData, userError });

                    // If we got data or it's a "not found" error, break
                    if (userData || (userError && userError.code === 'PGRST116')) {
                        break;
                    }

                    // Wait before retrying (exponential backoff)
                    if (attempts < maxAttempts) {
                        console.log(`[Callback] Retrying in ${attempts * 500}ms...`);
                        await new Promise(resolve => setTimeout(resolve, attempts * 500));
                    }
                }

                console.log('[Callback] Final user query result:', { userData, userError });

                // If user doesn't exist, create them (first-time OAuth user)
                if (userError && userError.code === 'PGRST116') {
                    console.log('[Callback] Creating new user record...');
                    setStatus('Setting up your account...');

                    // Determine role based on email (for known admin/contributor emails)
                    let initialRole: 'student' | 'contributor' | 'admin' = 'student';
                    const email = user.email?.toLowerCase() || '';

                    // Check if this is a known admin/contributor email
                    // You can add more emails here as needed
                    const knownAdmins = ['anomsiiwa2001@gmail.com'];
                    const knownContributors = ['anoexpected@gmail.com', '22p31a05g9@acet.ac.in'];

                    if (knownAdmins.includes(email)) {
                        initialRole = 'admin';
                        console.log('[Callback] Creating ADMIN user for:', email);
                    } else if (knownContributors.includes(email)) {
                        initialRole = 'contributor';
                        console.log('[Callback] Creating CONTRIBUTOR user for:', email);
                    } else {
                        console.log('[Callback] Creating STUDENT user for:', email);
                    }

                    const { error: insertError } = await supabase
                        .from('users')
                        .insert({
                            id: user.id,
                            email: user.email,
                            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
                            avatar_url: user.user_metadata?.avatar_url,
                            role: initialRole,
                            onboarding_completed: initialRole !== 'student', // Skip onboarding for admin/contributor
                            onboarding_step: initialRole !== 'student' ? 5 : 1
                        });

                    if (insertError) {
                        console.error('[Callback] Error creating user:', insertError);
                        setError(`Failed to create user account: ${insertError.message}`);
                        setTimeout(() => {
                            window.location.href = '/auth/login?error=user_creation_failed';
                        }, 3000);
                        return;
                    }

                    // Create appropriate profile
                    if (initialRole === 'student') {
                        const { error: profileError } = await supabase
                            .from('student_profiles')
                            .insert({ user_id: user.id });

                        if (profileError) {
                            console.error('[Callback] Profile creation error:', profileError);
                        }

                        // Award welcome achievement
                        try {
                            await supabase.rpc('award_achievement', {
                                p_user_id: user.id,
                                p_achievement_name: 'Welcome Aboard!'
                            });
                        } catch (err) {
                            console.error('[Callback] Achievement error:', err);
                        }

                        console.log('[Callback] ✓ New student created, redirecting to onboarding...');
                        setStatus('Welcome! Setting up your profile...');

                        // Redirect to onboarding
                        setTimeout(() => {
                            window.location.href = '/auth/onboarding/location';
                        }, 500);
                        return;
                    } else if (initialRole === 'contributor') {
                        // Create contributor profile
                        const { error: profileError } = await supabase
                            .from('contributor_profiles')
                            .insert({
                                user_id: user.id,
                                application_status: 'approved'
                            });

                        if (profileError) {
                            console.error('[Callback] Contributor profile creation error:', profileError);
                        }

                        console.log('[Callback] ✓ New contributor created, redirecting...');
                        setStatus('Welcome! Redirecting to contributor dashboard...');

                        setTimeout(() => {
                            window.location.href = '/contribute';
                        }, 500);
                        return;
                    } else {
                        // Admin - no special profile needed
                        console.log('[Callback] ✓ New admin created, redirecting...');
                        setStatus('Welcome! Redirecting to admin dashboard...');

                        setTimeout(() => {
                            window.location.href = '/admin';
                        }, 500);
                        return;
                    }
                }

                // Existing user - redirect based on onboarding status
                if (userData) {
                    const { role, onboarding_completed, onboarding_step } = userData;

                    console.log('[Callback] Existing user - Role:', role, 'Completed:', onboarding_completed, 'Step:', onboarding_step);

                    // Clear any intended role - we accept whatever role the user has
                    sessionStorage.removeItem('intended_role');

                    setStatus(`Welcome back! Redirecting to your ${role} dashboard...`);

                    // Only students need to complete onboarding
                    // Contributors, admins, teachers, and parents skip onboarding
                    if (role === 'student' && !onboarding_completed) {
                        const stepRoutes: Record<number, string> = {
                            0: '/auth/onboarding/location',
                            1: '/auth/onboarding/location',
                            2: '/auth/onboarding/school',
                            3: '/auth/onboarding/exam-board',
                            4: '/auth/onboarding/subjects',
                            5: '/auth/onboarding/goals',
                        };

                        const redirectTo = stepRoutes[onboarding_step] || '/auth/onboarding/location';
                        console.log('[Callback] ✓ Redirecting to onboarding:', redirectTo);
                        setStatus('Continuing your setup...');

                        setTimeout(() => {
                            window.location.href = redirectTo;
                        }, 500);
                        return;
                    }

                    // Completed onboarding - redirect based on role
                    const roleRoutes: Record<string, string> = {
                        admin: '/admin',
                        contributor: '/contribute',
                        teacher: '/dashboard',
                        parent: '/dashboard',
                        student: '/learn/dashboard',
                    };

                    const redirectTo = roleRoutes[role] || '/learn/dashboard';
                    console.log('[Callback] ✓ Redirecting to:', redirectTo);
                    setStatus('Welcome back!');

                    setTimeout(() => {
                        window.location.href = redirectTo;
                    }, 500);
                    return;
                }

                // If we have a user error that's not "not found", show it
                if (userError) {
                    console.error('[Callback] User query error:', userError);
                    setError(`Failed to fetch user data: ${userError.message}. Please try logging in again.`);
                    setTimeout(() => {
                        window.location.href = '/auth/login?error=user_query_failed';
                    }, 3000);
                    return;
                }

                // If we reach here, something unexpected happened
                console.error('[Callback] Unexpected state - no userData and no error');
                setError('Unable to fetch your account details. Please try logging in again.');
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 2000);

            } catch (err: any) {
                console.error('[Callback] Error:', err);
                setError(err.message || 'An unexpected error occurred');
                setTimeout(() => {
                    window.location.href = '/auth/login?error=callback_failed';
                }, 2000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-whisper px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-default p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-h4 font-display font-semibold text-charcoal mb-2">
                        Authentication Error
                    </h1>
                    <p className="text-body text-red-600 mb-6">{error}</p>
                    <a
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                        Back to login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-whisper px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-default p-8 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <h2 className="text-h4 font-display font-semibold text-charcoal mb-2">
                    {status}
                </h2>
                <p className="text-body text-muted-foreground">
                    Please wait while we complete your sign in...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}
