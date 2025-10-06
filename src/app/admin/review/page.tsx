import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, HelpCircle, FileCheck, Clock } from 'lucide-react';

export default async function ReviewQueuePage() {
  try {
    await requireRole('admin');
  } catch {
    redirect('/auth/login?redirect=/admin/review');
  }

  const supabase = await createClient();

  // Fetch pending content counts
  const [
    { count: pendingNotesCount },
    { count: pendingQuizzesCount },
    { count: pendingPapersCount },
  ] = await Promise.all([
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const reviewCategories = [
    {
      title: 'Notes',
      count: pendingNotesCount || 0,
      icon: FileText,
      href: '/admin/review/notes',
      color: 'bg-blue-100 text-blue-600',
      description: 'Review and approve study notes',
    },
    {
      title: 'Quizzes',
      count: pendingQuizzesCount || 0,
      icon: HelpCircle,
      href: '/admin/review/quizzes',
      color: 'bg-purple-100 text-purple-600',
      description: 'Review and approve quiz questions',
    },
    {
      title: 'Past Papers',
      count: pendingPapersCount || 0,
      icon: FileCheck,
      href: '/admin/review/past-papers',
      color: 'bg-green-100 text-green-600',
      description: 'Review and approve past papers',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-['Poppins']">
          Review Queue
        </h1>
        <p className="text-gray-600 mt-2">
          Review and approve content submitted by contributors
        </p>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-[#F1C40F] to-[#F39C12] text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">Total Pending</p>
            <p className="text-4xl font-bold font-['Poppins']">
              {(pendingNotesCount || 0) + (pendingQuizzesCount || 0) + (pendingPapersCount || 0)}
            </p>
          </div>
          <Clock className="w-16 h-16 opacity-80" />
        </div>
      </div>

      {/* Review Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviewCategories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.title}
              href={category.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-[#F1C40F] text-[#1B2A4C] text-sm font-bold rounded-full">
                  {category.count}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Poppins']">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-[#2ECC71] font-medium text-sm hover:underline">
                  Review {category.count} items →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3 font-['Poppins']">
          Review Guidelines
        </h3>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Check content accuracy and alignment with syllabus</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Verify proper formatting and readability</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Ensure appropriate difficulty level for target audience</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Provide constructive feedback when requesting changes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
