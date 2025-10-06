import Link from "next/link";
import { ChevronRight, BookOpen, HelpCircle, FileText, Video } from 'lucide-react';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2ECC71] to-[#16A085] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Help Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        Help Center
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl">
                        Find answers to common questions and learn how to get the most out of STEM Hub
                    </p>
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold font-['Poppins'] text-[#1B2A4C] mb-8 text-center">
                    Popular Topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { icon: <BookOpen className="w-8 h-8" />, title: 'Getting Started', color: '#2ECC71' },
                        { icon: <HelpCircle className="w-8 h-8" />, title: 'Using Quizzes', color: '#8E44AD' },
                        { icon: <FileText className="w-8 h-8" />, title: 'Study Notes', color: '#F1C40F' },
                        { icon: <Video className="w-8 h-8" />, title: 'Video Tutorials', color: '#E74C3C' }
                    ].map((category, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${category.color}15`, color: category.color }}
                            >
                                {category.icon}
                            </div>
                            <h3 className="font-bold text-[#1B2A4C]">{category.title}</h3>
                        </div>
                    ))}
                </div>

                {/* Common Questions */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold font-['Poppins'] text-[#1B2A4C] mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Is STEM Hub really free?',
                                a: 'Yes! STEM Hub is 100% free and always will be. We believe quality education should be accessible to everyone.'
                            },
                            {
                                q: 'Which exam boards do you support?',
                                a: 'We currently support ZIMSEC, WAEC, IGCSE, A-levels, KCSE, and NECTA. We&apos;re constantly adding more content for additional boards.'
                            },
                            {
                                q: 'How can I become a contributor?',
                                a: 'Visit our Contribute page and apply to become a content creator. Top-performing students and educators are welcome to apply!'
                            },
                            {
                                q: 'Can I use STEM Hub on my phone?',
                                a: 'Absolutely! STEM Hub is fully responsive and works great on all devices - phones, tablets, and computers.'
                            },
                            {
                                q: 'How do I track my progress?',
                                a: 'Sign up for a free account to access your personalized dashboard where you can track quiz scores, learning streaks, and achievements.'
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-[#1B2A4C] mb-3">{faq.q}</h3>
                                <p className="text-gray-700">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50] rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold font-['Poppins'] mb-4">
                            Still need help?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Can&apos;t find what you&apos;re looking for? Get in touch with our support team.
                        </p>
                        <Link href="/contact">
                            <button className="px-8 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
