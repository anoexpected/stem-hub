import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    FileText,
    HelpCircle,
    FileCheck,
    ArrowRight,
    Sparkles,
    CheckCircle,
} from 'lucide-react';

export default async function CreateContentPage() {
    try {
        await requireRole('contributor');

        return (
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 font-['Poppins'] mb-3">
                        Create Content
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the type of content you want to create to help students across Africa succeed
                    </p>
                </div>

                {/* Content Type Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {/* Notes Card */}
                    <Link
                        href="/contribute/create/note"
                        className="group bg-white rounded-xl border-2 border-gray-200 p-8 hover:border-[#2ECC71] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <FileText className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                Study Notes
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                Write comprehensive study notes with LaTeX equations, code snippets, and images
                            </p>

                            <ul className="text-left text-sm text-gray-600 space-y-2 w-full">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#2ECC71] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Rich text formatting</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#2ECC71] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>LaTeX math equations</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#2ECC71] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Image uploads</span>
                                </li>
                            </ul>

                            <div className="flex items-center text-[#2ECC71] font-semibold group-hover:translate-x-2 transition-transform">
                                Start Writing
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Quiz Card */}
                    <Link
                        href="/contribute/create/quiz"
                        className="group bg-white rounded-xl border-2 border-gray-200 p-8 hover:border-[#8E44AD] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#8E44AD] to-[#9B59B6] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <HelpCircle className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                Quizzes
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                Build interactive quizzes with multiple choice, true/false, and short answer questions
                            </p>

                            <ul className="text-left text-sm text-gray-600 space-y-2 w-full">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#8E44AD] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Multiple question types</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#8E44AD] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Add explanations</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#8E44AD] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Set difficulty levels</span>
                                </li>
                            </ul>

                            <div className="flex items-center text-[#8E44AD] font-semibold group-hover:translate-x-2 transition-transform">
                                Create Quiz
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </Link>

                    {/* Past Paper Card */}
                    <Link
                        href="/contribute/create/past-paper"
                        className="group bg-white rounded-xl border-2 border-gray-200 p-8 hover:border-[#1B2A4C] hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50] rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <FileCheck className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                                Past Papers
                            </h3>

                            <p className="text-gray-600 text-sm leading-relaxed">
                                Upload past exam papers with marking schemes to help students prepare effectively
                            </p>

                            <ul className="text-left text-sm text-gray-600 space-y-2 w-full">
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#1B2A4C] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Question papers (PDF)</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#1B2A4C] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Marking schemes</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="w-4 h-4 text-[#1B2A4C] mt-0.5 mr-2 flex-shrink-0" />
                                    <span>Topic tagging</span>
                                </li>
                            </ul>

                            <div className="flex items-center text-[#1B2A4C] font-semibold group-hover:translate-x-2 transition-transform">
                                Upload Paper
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Tips Section */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4 font-['Poppins']">
                        💡 Content Creation Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Quality Guidelines</h3>
                            <ul className="space-y-2 text-blue-800 text-sm">
                                <li>• Ensure content is accurate and well-researched</li>
                                <li>• Use clear, simple language for students</li>
                                <li>• Include examples and practice problems</li>
                                <li>• Cite sources when necessary</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Best Practices</h3>
                            <ul className="space-y-2 text-blue-800 text-sm">
                                <li>• Align content with exam board syllabi</li>
                                <li>• Save drafts regularly while working</li>
                                <li>• Preview content before submitting</li>
                                <li>• Respond to admin feedback promptly</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Poppins']">
                        📊 Your Impact
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Every piece of content you create helps thousands of students prepare for their exams.
                        Start creating today and make a difference!
                    </p>
                </div>
            </div>
        );
    } catch {
        redirect('/auth/login?redirect=/contribute/create');
    }
}
