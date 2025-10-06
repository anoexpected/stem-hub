import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';
import { Settings, Globe, Bell, Shield, Database, Mail } from 'lucide-react';

export default async function AdminSettingsPage() {
    await requireRole('admin');

    const supabase = await createClient();

    // Fetch system statistics
    const [usersResult, contentResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('notes').select('*', { count: 'exact', head: true }),
    ]);

    const totalUsers = usersResult.count || 0;
    const totalContent = contentResult.count || 0;

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">
                    Manage platform settings and configurations
                </p>
            </div>

            <div className="grid gap-6">
                {/* System Overview */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">System Overview</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Total Users</div>
                            <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Total Content</div>
                            <div className="text-2xl font-bold text-gray-900">{totalContent}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Platform Status</div>
                            <div className="text-lg font-semibold text-green-600">Operational</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Database</div>
                            <div className="text-lg font-semibold text-green-600">Connected</div>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">General Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Platform Name</h3>
                                <p className="text-sm text-gray-600">STEM Hub</p>
                            </div>
                            <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                Edit
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Platform Description</h3>
                                <p className="text-sm text-gray-600">A comprehensive STEM learning platform</p>
                            </div>
                            <button className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Moderation */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Content Moderation</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Auto-Approval</h3>
                                <p className="text-sm text-gray-600">Automatically approve content from trusted contributors</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Require Approval for New Users</h3>
                                <p className="text-sm text-gray-600">All content from new contributors must be reviewed</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-gray-600">Send email alerts for important events</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Notify on New Content</h3>
                                <p className="text-sm text-gray-600">Alert admins when new content is submitted</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Email Configuration */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Email Configuration</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                defaultValue="admin@stemhub.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div className="p-4 border rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                defaultValue="support@stemhub.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Regional Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Timezone
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option>UTC</option>
                                <option>GMT</option>
                                <option>EST</option>
                                <option>PST</option>
                            </select>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date Format
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Reset to Defaults
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
