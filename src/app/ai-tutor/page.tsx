import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Sparkles, MessageSquare, BookOpen, Lightbulb } from 'lucide-react';

export const metadata = {
    title: 'AI Tutor | STEM Hub',
    description: 'Get instant help from your AI tutor',
};

export default async function AITutorPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const features = [
        {
            icon: MessageSquare,
            title: 'Ask Questions',
            description: 'Get instant answers to your study questions',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: BookOpen,
            title: 'Explain Concepts',
            description: 'Break down complex topics into simple explanations',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            icon: Lightbulb,
            title: 'Generate Examples',
            description: 'Get practice problems with step-by-step solutions',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8E44AD] to-[#9B59B6] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/learn/dashboard"
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                        <Sparkles className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">AI Tutor</h1>
                    </div>
                    <p className="text-white/90">Your personal AI-powered study assistant</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Coming Soon Banner */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white text-center mb-8">
                    <Sparkles className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
                    <p className="text-white/90 max-w-2xl mx-auto">
                        Our AI Tutor is being fine-tuned to provide you with the best learning experience.
                        Get ready for personalized, intelligent tutoring available 24/7.
                    </p>
                </div>

                {/* Features */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What You Can Do</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="bg-white rounded-xl border border-gray-200 p-6"
                                >
                                    <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                        <Icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Want Early Access?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Join the waitlist to be among the first to try our AI Tutor
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all">
                        Join Waitlist
                    </button>
                </div>
            </main>
        </div>
    );
}
