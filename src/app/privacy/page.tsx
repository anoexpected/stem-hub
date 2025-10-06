import Link from "next/link";
import { ChevronRight, Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Privacy Policy</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Your privacy is important to us. Learn how we protect your data.
                    </p>
                </div>
            </div>

            {/* Key Points */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Shield className="w-6 h-6" />, title: 'Data Protection', color: '#2ECC71' },
                            { icon: <Lock className="w-6 h-6" />, title: 'Secure Storage', color: '#8E44AD' },
                            { icon: <Eye className="w-6 h-6" />, title: 'Transparency', color: '#F1C40F' },
                            { icon: <Database className="w-6 h-6" />, title: 'Your Control', color: '#E74C3C' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-6 text-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-[#1B2A4C]">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Privacy Content */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 mb-8">
                        Last updated: October 5, 2025
                    </p>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            1. Information We Collect
                        </h2>
                        <p className="text-gray-700 mb-4">
                            When you use STEM Hub, we collect the following information:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Account Information:</strong> Name, email address, and password (encrypted)</li>
                            <li><strong>Learning Data:</strong> Quiz scores, progress tracking, study streaks</li>
                            <li><strong>Usage Data:</strong> Pages viewed, time spent, features used</li>
                            <li><strong>Device Information:</strong> Browser type, device type, IP address</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We use your information to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Provide and improve our educational services</li>
                            <li>Personalize your learning experience</li>
                            <li>Track your progress and achievements</li>
                            <li>Send important updates about STEM Hub</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            3. Data Security
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We take data security seriously:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>All data is encrypted in transit and at rest</li>
                            <li>We use industry-standard security practices</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal data by staff</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            4. Sharing Your Information
                        </h2>
                        <p className="text-gray-700 mb-4">
                            We <strong>never sell</strong> your personal information. We only share data:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>With your explicit consent</li>
                            <li>To comply with legal requirements</li>
                            <li>With service providers who help us operate (under strict agreements)</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            5. Your Rights
                        </h2>
                        <p className="text-gray-700 mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data</li>
                            <li>Opt-out of non-essential communications</li>
                        </ul>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            6. Cookies
                        </h2>
                        <p className="text-gray-700">
                            We use cookies to improve your experience, remember your preferences, and analyze usage.
                            You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            7. Children's Privacy
                        </h2>
                        <p className="text-gray-700">
                            STEM Hub is designed for students of all ages. For users under 13, we recommend parental supervision
                            and consent before creating an account.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            8. Changes to This Policy
                        </h2>
                        <p className="text-gray-700">
                            We may update this privacy policy from time to time. We'll notify you of significant changes
                            via email or through our platform.
                        </p>
                    </section>

                    <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl p-6 mt-12">
                        <h3 className="text-xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                            Questions about Privacy?
                        </h3>
                        <p className="text-gray-700 mb-4">
                            If you have any questions about our privacy practices, please contact us:
                        </p>
                        <Link href="/contact">
                            <button className="px-6 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
