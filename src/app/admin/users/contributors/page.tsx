import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UserCheck, Calendar, Mail, Award } from 'lucide-react';
import Link from 'next/link';

export default async function ContributorsPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/users/contributors');
    }

    const supabase = await createClient();

    // Fetch all contributors
    const { data: contributors, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'contributor')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching contributors:', error);
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Contributors
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {contributors?.length || 0} active contributors on the platform
                    </p>
                </div>

                <Link
                    href="/admin/users"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                    View All Users
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Contributors</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {contributors?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Active This Month</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {/* This would require additional query */}
                                -
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Top Contributor</p>
                            <p className="text-sm font-bold text-gray-900">
                                {contributors?.[0]?.full_name || contributors?.[0]?.email || 'N/A'}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Award className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contributors List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contributor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {contributors && contributors.length > 0 ? (
                                contributors.map((contributor: any) => (
                                    <tr key={contributor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#8E44AD] to-[#9B59B6] rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                    {contributor.full_name?.substring(0, 2).toUpperCase() || contributor.email?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{contributor.full_name || contributor.email}</div>
                                                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{contributor.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(contributor.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <Link
                                                href={`/admin/users/${contributor.id}`}
                                                className="text-[#2ECC71] hover:text-[#27AE60] transition font-medium"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No contributors found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
