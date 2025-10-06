import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Bell, Check } from 'lucide-react';

export const metadata = {
    title: 'Notifications | STEM Hub',
    description: 'Your notifications',
};

export default async function NotificationsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Mock notifications - you can implement a real notifications table later
    const notifications = [
        {
            id: '1',
            type: 'achievement',
            title: 'Congratulations! 🎉',
            message: 'You completed 10 quizzes this week',
            time: '2 hours ago',
            read: false,
        },
        {
            id: '2',
            type: 'reminder',
            title: 'Study Reminder',
            message: 'Time to review Mathematics - Algebra',
            time: '1 day ago',
            read: true,
        },
        {
            id: '3',
            type: 'update',
            title: 'New Content Available',
            message: 'New notes added for Physics - Mechanics',
            time: '2 days ago',
            read: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/learn/dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {notifications.filter(n => !n.read).length} unread
                                </p>
                            </div>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Mark all as read
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {notifications.length > 0 ? (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl border p-4 transition-all ${notification.read
                                        ? 'border-gray-200'
                                        : 'border-blue-200 bg-blue-50/50'
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${notification.type === 'achievement' ? 'bg-yellow-100' :
                                            notification.type === 'reminder' ? 'bg-blue-100' :
                                                'bg-green-100'
                                        }`}>
                                        <Bell className={`w-5 h-5 ${notification.type === 'achievement' ? 'text-yellow-600' :
                                                notification.type === 'reminder' ? 'text-blue-600' :
                                                    'text-green-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900">
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                            <Check className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-600">
                            We'll notify you when there's something new
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
