import { requireRole } from '@/middleware/requireRole';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    BookOpen,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    Target,
    Shield,
    Award,
    ArrowRight,
} from 'lucide-react';

export default async function GuidelinesPage() {
    try {
        await requireRole('contributor');

        return (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50] rounded-2xl mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 font-['Poppins'] mb-3">
                        Contributor Guidelines
                    </h1>
                    <p className="text-xl text-gray-600">
                        Everything you need to know to create high-quality content
                    </p>
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-3 font-['Poppins']">Our Mission</h2>
                    <p className="text-lg leading-relaxed">
                        STEM Hub aims to democratize access to quality STEM education across Africa.
                        As a contributor, you play a crucial role in making this vision a reality by
                        creating accurate, engaging, and curriculum-aligned content.
                    </p>
                </div>

                {/* Content Quality Standards */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                            Content Quality Standards
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                Accuracy & Reliability
                            </h3>
                            <ul className="space-y-2 text-gray-700 ml-7">
                                <li>• Ensure all information is factually correct and up-to-date</li>
                                <li>• Cite credible sources when necessary</li>
                                <li>• Double-check formulas, equations, and calculations</li>
                                <li>• Verify alignment with official exam board syllabi</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                Clarity & Accessibility
                            </h3>
                            <ul className="space-y-2 text-gray-700 ml-7">
                                <li>• Use clear, simple language appropriate for students</li>
                                <li>• Break down complex concepts into manageable steps</li>
                                <li>• Include relevant examples and practical applications</li>
                                <li>• Use visuals, diagrams, and illustrations where helpful</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                Structure & Organization
                            </h3>
                            <ul className="space-y-2 text-gray-700 ml-7">
                                <li>• Use clear headings and subheadings</li>
                                <li>• Present information in logical order</li>
                                <li>• Include summaries and key takeaways</li>
                                <li>• Add practice questions or activities when appropriate</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Content Types Guide */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                            Content Type Guidelines
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="border-l-4 border-[#2ECC71] pl-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Notes</h3>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Comprehensive coverage of the topic</li>
                                <li>• Use LaTeX for mathematical equations</li>
                                <li>• Include diagrams and images where helpful</li>
                                <li>• Add worked examples and solutions</li>
                                <li>• Link to related topics and past papers</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-[#8E44AD] pl-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quizzes</h3>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Minimum 5 questions per quiz</li>
                                <li>• Mix different question types (MCQ, True/False, Short Answer)</li>
                                <li>• Provide clear, concise questions</li>
                                <li>• Include detailed explanations for answers</li>
                                <li>• Set appropriate difficulty levels</li>
                            </ul>
                        </div>

                        <div className="border-l-4 border-[#1B2A4C] pl-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Past Papers</h3>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Upload both question paper and marking scheme</li>
                                <li>• Ensure PDFs are clear and readable</li>
                                <li>• Tag with correct year, session, and paper number</li>
                                <li>• Link to relevant topics from the syllabus</li>
                                <li>• Verify the paper is from an official source</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* What to Avoid */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-900 font-['Poppins']">
                            What to Avoid
                        </h2>
                    </div>

                    <ul className="space-y-3 text-red-900">
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Plagiarism - All content must be original or properly cited</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Inaccurate information or unverified claims</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Poorly formatted or hard-to-read content</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Inappropriate or offensive language</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Content not aligned with exam board syllabi</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-semibold mr-2">❌</span>
                            <span>Copyright violations (unauthorized use of materials)</span>
                        </li>
                    </ul>
                </div>

                {/* Review Process */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                            Review Process
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Submit for Review</h4>
                                <p className="text-gray-600 text-sm">
                                    Once you submit your content, it enters the admin review queue
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Admin Review</h4>
                                <p className="text-gray-600 text-sm">
                                    Our team reviews for accuracy, quality, and syllabus alignment (24-48 hours)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Feedback & Approval</h4>
                                <p className="text-gray-600 text-sm">
                                    You'll receive approval or constructive feedback for improvements
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-[#2ECC71] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Publication</h4>
                                <p className="text-gray-600 text-sm">
                                    Approved content is published and becomes available to all students
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rewards & Recognition */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">
                            Rewards & Recognition
                        </h2>
                    </div>

                    <div className="space-y-3 text-gray-800">
                        <p className="flex items-start">
                            <span className="font-semibold mr-2">🏆</span>
                            <span>Top contributors featured on our platform</span>
                        </p>
                        <p className="flex items-start">
                            <span className="font-semibold mr-2">⭐</span>
                            <span>Achievement badges for milestones</span>
                        </p>
                        <p className="flex items-start">
                            <span className="font-semibold mr-2">📊</span>
                            <span>Track your impact with detailed statistics</span>
                        </p>
                        <p className="flex items-start">
                            <span className="font-semibold mr-2">🎓</span>
                            <span>Certificate of contribution for your portfolio</span>
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white rounded-xl p-8">
                    <h2 className="text-2xl font-bold mb-4 font-['Poppins']">
                        Ready to Make an Impact?
                    </h2>
                    <p className="text-lg mb-6 text-white/90">
                        Start creating quality content and help shape Africa's future
                    </p>
                    <Link
                        href="/contribute/create"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition font-semibold text-lg"
                    >
                        <span>Start Creating</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Support Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
                    <p className="text-blue-800 text-sm mb-4">
                        If you have questions about these guidelines or need assistance, please contact our support team.
                    </p>
                    <a
                        href="mailto:support@stemhub.africa"
                        className="text-[#2ECC71] font-semibold hover:underline"
                    >
                        support@stemhub.africa
                    </a>
                </div>
            </div>
        );
    } catch {
        redirect('/auth/login?redirect=/contribute/guidelines');
    }
}
