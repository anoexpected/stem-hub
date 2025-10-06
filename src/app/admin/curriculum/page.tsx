import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { BookOpen, GraduationCap, FolderTree } from 'lucide-react';
import Link from 'next/link';
import AdminTopicManager from './components/AdminTopicManager';

export default async function CurriculumPage() {
    try {
        await requireRole('admin');
    } catch {
        redirect('/auth/login?redirect=/admin/curriculum');
    }

    return (
        <div className="space-y-8">
            {/* Quick Links Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Poppins']">
                    Quick Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/admin/curriculum/exam-boards"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Exam Boards</div>
                            <div className="text-sm text-gray-500">Manage boards</div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/curriculum/subjects"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
                    >
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Subjects</div>
                            <div className="text-sm text-gray-500">Manage subjects</div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/curriculum/topics"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
                    >
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FolderTree className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">Topics</div>
                            <div className="text-sm text-gray-500">Manage topics</div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Main Topic Manager */}
            <AdminTopicManager />
        </div>
    );
}

