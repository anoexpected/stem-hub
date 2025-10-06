import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DashboardHeader from '@/components/features/dashboard/DashboardHeader';
import StatsOverview from '@/components/features/dashboard/StatsOverview';
import SubjectGrid from '@/components/features/dashboard/SubjectGrid';
import QuickActions from '@/components/features/dashboard/QuickActions';
import StudyStreak from '@/components/features/dashboard/StudyStreak';
import RecentActivity from '@/components/features/dashboard/RecentActivity';

export const metadata = {
    title: 'Dashboard | STEM Hub',
    description: 'Your personalized STEM learning dashboard',
};

export default async function StudentDashboard() {
    const supabase = await createClient();

    // Get authenticated user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Get user details from public.users
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // Redirect to onboarding if not completed
    if (!userData?.onboarding_completed) {
        redirect('/auth/onboarding/location');
    }

    // Get student profile with school details
    const { data: profile } = await supabase
        .from('student_profiles')
        .select(`
      *,
      school:schools(name, country, region)
    `)
        .eq('user_id', user.id)
        .single();

    if (!profile) {
        redirect('/auth/onboarding/location');
    }

    // Get subjects for student's exam boards
    // First get exam board IDs from codes
    const { data: examBoardData } = await supabase
        .from('exam_boards')
        .select('id, code, name')
        .in('code', profile.exam_boards || []);

    const examBoardIds = examBoardData?.map(eb => eb.id) || [];

    // Get user's selected subjects only
    const { data: userSubjects } = await supabase
        .from('user_subjects')
        .select(`
            subject_id,
            subjects(
                *,
                exam_boards(code, name),
                topics(id, name, difficulty_level, is_active)
            )
        `)
        .eq('user_id', user.id);

    // Extract subjects from user_subjects
    const subjects = userSubjects?.map(us => us.subjects).filter(Boolean) || [];

    // Get user progress across all topics
    const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

    // Get learning streak
    const { data: streak } = await supabase
        .from('user_learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Get recent quiz attempts
    const { data: recentQuizzes } = await supabase
        .from('quiz_attempts')
        .select(`
      *,
      quiz:quizzes(
        title,
        topic:topics(
          name,
          subject:subjects(name)
        )
      )
    `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(5);

    // Get recent practice sessions
    const { data: recentSessions } = await supabase
        .from('practice_sessions')
        .select(`
      *,
      topic:topics(
        name,
        subject:subjects(name)
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

    // Calculate overall stats
    const totalQuestionsAttempted = progressData?.reduce(
        (sum, p) => sum + (p.questions_attempted || 0),
        0
    ) || 0;

    const totalQuestionsCorrect = progressData?.reduce(
        (sum, p) => sum + (p.questions_correct || 0),
        0
    ) || 0;

    const averageAccuracy =
        totalQuestionsAttempted > 0
            ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100)
            : 0;

    const totalTopicsStudied = progressData?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <DashboardHeader
                user={userData}
                profile={profile}
                streak={streak}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                <StatsOverview
                    totalQuestionsAttempted={totalQuestionsAttempted}
                    averageAccuracy={averageAccuracy}
                    totalTopicsStudied={totalTopicsStudied}
                    currentStreak={streak?.current_streak || 0}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <QuickActions examBoards={profile.exam_boards} />

                        {/* Subjects Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Your Subjects</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {profile.exam_boards?.join(', ')} • {profile.current_level}
                                    </p>
                                </div>
                                <Link
                                    href="/learn/subjects"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                                >
                                    <span>Manage Subjects</span>
                                    <span>→</span>
                                </Link>
                            </div>

                            <SubjectGrid
                                subjects={subjects || []}
                                progressData={progressData || []}
                            />
                        </section>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Study Streak */}
                        <StudyStreak streak={streak} />

                        {/* Recent Activity */}
                        <RecentActivity
                            recentQuizzes={recentQuizzes || []}
                            recentSessions={recentSessions || []}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
