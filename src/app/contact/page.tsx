import Link from "next/link";
import { ChevronRight, Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>Contact</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Have questions or feedback? We&apos;d love to hear from you!
                    </p>
                </div>
            </div>

            {/* Contact Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                            Contact Information
                        </h2>
                        <p className="text-gray-700 mb-8">
                            We&apos;re here to help! Whether you have a question about our platform, need technical support,
                            or want to provide feedback, feel free to reach out.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-[#2ECC71]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-[#2ECC71]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1B2A4C] mb-1">Email Us</h3>
                                    <p className="text-gray-600">support@stemhub.africa</p>
                                    <p className="text-sm text-gray-500 mt-1">We&apos;ll respond within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-[#8E44AD]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-[#8E44AD]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1B2A4C] mb-1">Community Forums</h3>
                                    <p className="text-gray-600">Join our forums (coming soon!)</p>
                                    <p className="text-sm text-gray-500 mt-1">Connect with other students and contributors</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-gradient-to-br from-[#2ECC71]/10 to-[#16A085]/10 rounded-xl border border-[#2ECC71]/20">
                            <h3 className="font-bold text-[#1B2A4C] mb-2">Quick Links</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/help" className="text-[#2ECC71] hover:underline">
                                        Help Center & FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contribute" className="text-[#2ECC71] hover:underline">
                                        Become a Contributor
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-[#2ECC71] hover:underline">
                                        About STEM Hub
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                            Send us a message
                        </h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <Send className="w-5 h-5" />
                                <span>Send Message</span>
                            </button>
                        </form>

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            This form is coming soon. For now, please email us directly at support@stemhub.africa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
