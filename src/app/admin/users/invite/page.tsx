'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, Mail, User, Shield, CheckCircle, Copy } from 'lucide-react';
import Link from 'next/link';

export default function InviteUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<{
        email: string;
        password: string;
        role: string;
        loginUrl: string;
        isRoleChange?: boolean;
    } | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        role: 'contributor'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/admin/invite-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important: Include cookies for authentication
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to invite user');
            }

            // Show success message with credentials
            const loginUrl = `${window.location.origin}/auth/login?intended_role=${data.user.role}`;
            setSuccess({
                email: data.user.email,
                password: data.user.temporary_password,
                role: data.user.role,
                loginUrl,
                isRoleChange: data.isRoleChange
            });

            // Reset form
            setFormData({
                email: '',
                full_name: '',
                role: 'contributor'
            });

        } catch (err: any) {
            console.error('Error inviting user:', err);
            setError(err.message || 'Failed to invite user');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const copyAllCredentials = () => {
        if (!success) return;

        const credentials = `STEM Hub Login Credentials

Role: ${success.role.charAt(0).toUpperCase() + success.role.slice(1)}
Email: ${success.email}
Temporary Password: ${success.password}
Login URL: ${success.loginUrl}

Please log in and change your password immediately.`;

        navigator.clipboard.writeText(credentials);
    };

    if (success) {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                            {success.isRoleChange ? 'User Role Updated! 🔄' : 'User Invited Successfully! 🎉'}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {success.isRoleChange
                                ? 'The user role has been changed. Share the new credentials below securely.'
                                : 'The user has been created. Share the credentials below securely.'
                            }
                        </p>
                    </div>
                </div>

                {/* Success Card */}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                {success.isRoleChange ? `Role Updated for ${success.email}` : `Invitation Sent to ${success.email}`}
                            </h3>
                            <p className="text-green-800 mb-4">
                                {success.isRoleChange
                                    ? 'A new password has been generated. The user must log in with these new credentials and change their password.'
                                    : 'Share the credentials below directly via a secure channel (WhatsApp, Signal, email, etc.).'
                                }
                            </p>

                            {/* Credentials */}
                            <div className="bg-white rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-mono font-semibold text-gray-900">
                                            {success.role.charAt(0).toUpperCase() + success.role.slice(1)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-mono text-gray-900">{success.email}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(success.email)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                        title="Copy email"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Temporary Password</p>
                                        <p className="font-mono text-gray-900 break-all">{success.password}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(success.password)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                        title="Copy password"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600">Login URL</p>
                                        <p className="font-mono text-sm text-gray-900 break-all">{success.loginUrl}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(success.loginUrl)}
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={copyAllCredentials}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span>Copy All Credentials</span>
                                </button>
                                <button
                                    onClick={() => setSuccess(null)}
                                    className="px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                                >
                                    Invite Another User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Make sure to securely share these credentials with the user.
                        They should change their password immediately after first login.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                    <Link href="/admin/users">
                        <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Users</span>
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link href="/admin/users">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Users</span>
                    </button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                    Invite New User
                </h1>
                <p className="text-gray-600 mt-2">
                    Add a new contributor or admin to the platform. They'll receive login credentials via email.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                {/* Full Name */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Email Address *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                        Role *
                    </label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent appearance-none"
                            required
                        >
                            <option value="contributor">Contributor</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {formData.role === 'contributor'
                            ? 'Contributors can create and manage educational content.'
                            : 'Administrators have full access to manage the platform.'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-[#2ECC71] text-white font-semibold rounded-lg hover:bg-[#27AE60] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <UserPlus className="w-5 h-5" />
                        <span>{loading ? 'Inviting...' : 'Invite User'}</span>
                    </button>
                    <Link href="/admin/users">
                        <button
                            type="button"
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>A secure account will be created with a temporary password</li>
                    <li>An invitation email will be sent with login credentials</li>
                    <li>You'll see the credentials on screen to share manually if needed</li>
                    <li>The user should change their password after first login</li>
                </ul>
            </div>
        </div>
    );
}
