import { requireRole } from '@/middleware/requireRole';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Mail, Calendar, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function UserDetailPage({ params }: { params: { id: string } }) {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/users');
    }

    const supabase = await createClient();

    // Fetch user details
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !user) {
        notFound();
    }

    // Fetch user statistics
    const [
        { count: notesCount },
        { count: quizzesCount },
        { count: papersCount },
    ] = await Promise.all([
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
        supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
        supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('uploaded_by', user.id),
    ]);

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Link
                href="/admin/users"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Users</span>
            </Link>

            {/* User Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || '??'}
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {user.full_name || user.email}
                            </h1>

                            <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>

                                <div className="flex items-center space-x-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <span className={`px-4 py-2 text-sm font-medium rounded-lg ${user.role === 'admin'
                        ? 'bg-yellow-100 text-yellow-800'
                        : user.role === 'contributor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>{user.role}</span>
                        </div>
                    </span>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Notes Created</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {notesCount || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Quizzes Created</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {quizzesCount || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Papers Uploaded</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {papersCount || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* User Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
                    User Information
                </h2>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-mono text-sm text-gray-900">{user.id}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Email</span>
                        <span className="text-gray-900">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Full Name</span>
                        <span className="text-gray-900">{user.full_name || 'Not set'}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Role</span>
                        <span className="text-gray-900 capitalize">{user.role}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Account Created</span>
                        <span className="text-gray-900">{new Date(user.created_at).toLocaleString()}</span>
                    </div>

                    {user.updated_at && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Last Updated</span>
                            <span className="text-gray-900">{new Date(user.updated_at).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-['Poppins']">
                    Actions
                </h2>

                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Change Role
                    </button>

                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Reset Password
                    </button>

                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Suspend Account
                    </button>
                </div>
            </div>
        </div>
    );
}
