'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase/auth';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validation
        if (!formData.email || !formData.password || !formData.fullName) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await signUp(formData.email, formData.password, formData.fullName);
            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-whisper px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-elevated p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-h3 font-display font-bold text-primary mb-4">
                        Account Created!
                    </h2>
                    <p className="text-body text-muted-foreground mb-6">
                        Check your email to verify your account, then you can log in.
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-success transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

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
                        Create Your Account
                    </h2>
                    <p className="text-body text-muted-foreground">
                        Start your STEM learning journey today
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-default p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-charcoal mb-2"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-charcoal mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-charcoal mb-2"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-silver rounded-md focus-ring"
                                placeholder="••••••••"
                                required
                                minLength={6}
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
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/auth/login"
                            className="text-secondary hover:text-success font-medium"
                        >
                            Log in
                        </Link>
                    </p>
                </div>

                {/* Terms */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-secondary hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-secondary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
