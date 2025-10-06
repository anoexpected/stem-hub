import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Users, UserCheck, Shield, Calendar, Mail } from 'lucide-react';
import Link from 'next/link';

export default async function UsersPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/users');
    }

    const supabase = await createClient();

    // Fetch all users with their stats
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
    }

    // Count users by role
    const studentCount = users?.filter((u: any) => u.role === 'student').length || 0;
    const contributorCount = users?.filter((u: any) => u.role === 'contributor').length || 0;
    const adminCount = users?.filter((u: any) => u.role === 'admin').length || 0;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
                        Users
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage platform users and their roles
                    </p>
                </div>

                <div className="flex space-x-3">
                    <Link
                        href="/admin/users/invite"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition"
                    >
                        <UserCheck className="w-5 h-5" />
                        <span>Invite User</span>
                    </Link>
                    <Link
                        href="/admin/users/contributors"
                        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                        <UserCheck className="w-5 h-5" />
                        <span>Manage Contributors</span>
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {users?.length || 0}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Students</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {studentCount}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Contributors</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {contributorCount}
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
                            <p className="text-sm text-gray-600 mb-1">Admins</p>
                            <p className="text-3xl font-bold text-gray-900 font-['Poppins']">
                                {adminCount}
                            </p>
                        </div>
                        <div className="p-3 bg-gold-100 text-gold-600 rounded-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>All Roles</option>
                        <option>Students</option>
                        <option>Contributors</option>
                        <option>Admins</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                    />

                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Oldest</option>
                        <option>Sort by: Name</option>
                    </select>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users && users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white font-bold mr-3">
                                                    {user.full_name?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || '??'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.full_name || user.email}</div>
                                                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${user.role === 'admin'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : user.role === 'contributor'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <Link
                                                href={`/admin/users/${user.id}`}
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
                                        No users found.
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
