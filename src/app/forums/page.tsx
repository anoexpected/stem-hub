import Link from "next/link";
import { ChevronRight, MessageSquare, Users, TrendingUp } from 'lucide-react';

export default function ForumsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Forums</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        Community Forums
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Connect with fellow students, ask questions, and share knowledge
                    </p>
                </div>
            </div>

            {/* Coming Soon Content */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <div className="text-6xl mb-6">💬</div>
                    <h2 className="text-3xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                        Forums Coming Soon!
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        We're building an amazing community space where you can discuss topics,
                        ask questions, and collaborate with fellow students. Stay tuned!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <MessageSquare className="w-8 h-8 text-[#2ECC71] mx-auto mb-3" />
                            <h3 className="font-bold text-[#1B2A4C] mb-2">Ask Questions</h3>
                            <p className="text-sm text-gray-600">Get help from students and educators</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <Users className="w-8 h-8 text-[#8E44AD] mx-auto mb-3" />
                            <h3 className="font-bold text-[#1B2A4C] mb-2">Study Groups</h3>
                            <p className="text-sm text-gray-600">Form study groups with peers</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <TrendingUp className="w-8 h-8 text-[#F1C40F] mx-auto mb-3" />
                            <h3 className="font-bold text-[#1B2A4C] mb-2">Share Knowledge</h3>
                            <p className="text-sm text-gray-600">Help others and earn reputation</p>
                        </div>
                    </div>

                    <Link href="/">
                        <button className="px-8 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors">
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
