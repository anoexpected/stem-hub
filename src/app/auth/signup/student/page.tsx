'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function StudentSignupPage() {
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Password strength indicators
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Update password strength if password field
        if (name === 'password') {
            setPasswordStrength({
                hasMinLength: value.length >= 8,
                hasUpperCase: /[A-Z]/.test(value),
                hasLowerCase: /[a-z]/.test(value),
                hasNumber: /[0-9]/.test(value),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    const isPasswordStrong = Object.values(passwordStrength).every(val => val);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.fullName || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isPasswordStrong) {
            setError('Password does not meet security requirements');
            return;
        }

        setLoading(true);

        try {
            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        role: 'student'
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // Wait for the session to be established
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Create user record in public.users table
                const { error: userError } = await supabase
                    .from('users')
                    .insert({
                        id: authData.user.id,
                        email: formData.email,
                        full_name: formData.fullName,
                        role: 'student',
                        onboarding_completed: false,
                        onboarding_step: 1
                    });

                if (userError && userError.code !== '23505') { // Ignore duplicate key error
                    console.error('Error creating user record:', userError);
                    // If user record creation fails, show error instead of proceeding
                    throw new Error('Failed to create user profile. Please try again.');
                }

                // Create initial student profile
                const { error: profileError } = await supabase
                    .from('student_profiles')
                    .insert({
                        user_id: authData.user.id
                    });

                if (profileError && profileError.code !== '23505') {
                    console.error('Error creating student profile:', profileError);
                }

                // Award "Welcome Aboard!" achievement (5 points)
                try {
                    await supabase.rpc('award_achievement', {
                        p_user_id: authData.user.id,
                        p_achievement_name: 'Welcome Aboard!'
                    });
                } catch (err) {
                    console.error('Achievement error:', err);
                }

                // Track onboarding analytics
                try {
                    await supabase.from('onboarding_analytics').insert({
                        user_id: authData.user.id,
                        step: 1,
                        step_name: 'signup',
                        completed_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.error('Analytics error:', err);
                }

                // Redirect to location selection (Step 2)
                router.push('/auth/onboarding/location');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    skipBrowserRedirect: false,
                }
            });

            if (error) {
                console.error('OAuth initiation error:', error);
                throw error;
            }

            // OAuth redirect will happen automatically
            console.log('OAuth initiated successfully');
        } catch (err: any) {
            console.error('Google signup error:', err);
            setError(err.message || 'An error occurred with Google signup');
            setLoading(false);
        }
    };

    const StrengthIndicator = ({ label, met }: { label: string; met: boolean }) => (
        <div className="flex items-center gap-2 text-sm">
            {met ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
                <XCircle className="w-4 h-4 text-gray-300" />
            )}
            <span className={met ? 'text-green-600' : 'text-gray-400'}>{label}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-md relative">
                {/* Progress indicator */}
                <div className="mb-6 text-center">
                    <p className="text-sm text-gray-600 font-medium">Step 1 of 6</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500" style={{ width: '16.67%' }}></div>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            Create Your Account
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Join thousands of African students excelling in STEM
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* OAuth buttons */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full mb-4 flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
                        </div>
                    </div>

                    {/* Signup form */}
                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password strength indicators */}
                            {formData.password && (
                                <div className="mt-3 space-y-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs font-medium text-gray-600 mb-2">Password must contain:</p>
                                    <StrengthIndicator label="At least 8 characters" met={passwordStrength.hasMinLength} />
                                    <StrengthIndicator label="One uppercase letter" met={passwordStrength.hasUpperCase} />
                                    <StrengthIndicator label="One lowercase letter" met={passwordStrength.hasLowerCase} />
                                    <StrengthIndicator label="One number" met={passwordStrength.hasNumber} />
                                    <StrengthIndicator label="One special character" met={passwordStrength.hasSpecialChar} />
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {confirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <XCircle className="w-4 h-4" />
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading || !isPasswordStrong}
                            className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span className="text-xl">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-green-600 font-medium hover:text-green-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back link */}
                <div className="mt-6 text-center">
                    <Link href="/auth/select-role" className="text-sm text-gray-600 hover:text-gray-900">
                        ← Choose a different role
                    </Link>
                </div>
            </div>
        </div>
    );
}
