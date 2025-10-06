import Link from "next/link";
import { ArrowRight } from 'lucide-react';

export default function SelectRolePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#2ECC71]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8E44AD]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-5xl w-full">
                {/* Logo */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-block mb-6">
                        <div className="text-4xl font-bold font-['Poppins']">
                            <span className="text-[#1B2A4C]">STEM</span>
                            <span className="text-[#2ECC71]"> Hub</span>
                        </div>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                        Choose <span className="text-[#F1C40F]">your</span> role
                    </h1>
                    <p className="text-xl text-gray-600">
                        Select what you want to sign up as to customize STEM Hub for your needs
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Student */}
                    <Link href="/auth/signup/student">
                        <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#2ECC71] cursor-pointer h-full">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#2ECC71]/20 to-[#16A085]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-5xl">🎓</span>
                                </div>
                                <h3 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                                    Student
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Access notes, quizzes, and track your learning progress
                                </p>
                                <div className="flex items-center justify-center text-[#2ECC71] font-semibold group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Teacher */}
                    <Link href="/auth/signup/teacher">
                        <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#8E44AD] cursor-pointer h-full">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#8E44AD]/20 to-[#7D3C98]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-5xl">👨‍🏫</span>
                                </div>
                                <h3 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                                    Teacher
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Manage classes, track student progress, and create content
                                </p>
                                <div className="flex items-center justify-center text-[#8E44AD] font-semibold group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Contributor */}
                    <Link href="/auth/signup/contributor">
                        <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#F1C40F] cursor-pointer h-full">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#F1C40F]/20 to-[#F39C12]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-5xl">✍️</span>
                                </div>
                                <h3 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                                    Contributor
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Create and share quality notes, quizzes, and resources
                                </p>
                                <div className="flex items-center justify-center text-[#F1C40F] font-semibold group-hover:gap-2 transition-all">
                                    <span>Apply Now</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Parent/Guardian */}
                    <Link href="/auth/signup/parent">
                        <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#E74C3C] cursor-pointer h-full">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#E74C3C]/20 to-[#C0392B]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-5xl">👨‍👩‍👧</span>
                                </div>
                                <h3 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">
                                    Parent/Guardian
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Monitor your child&apos;s progress and support their learning
                                </p>
                                <div className="flex items-center justify-center text-[#E74C3C] font-semibold group-hover:gap-2 transition-all">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Login Link */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-[#2ECC71] hover:text-[#27AE60] font-semibold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>

                {/* Features Banner */}
                <div className="mt-16 bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] rounded-2xl p-8 text-white">
                    <h2 className="text-2xl font-bold font-['Poppins'] text-center mb-6">
                        Join <span className="text-[#2ECC71]">thousands</span> of African students 🌍
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-[#2ECC71] mb-2">100% Free</div>
                            <div className="text-white/80">Always and forever</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#F1C40F] mb-2">African First</div>
                            <div className="text-white/80">Built for your curriculum</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-[#8E44AD] mb-2">Community</div>
                            <div className="text-white/80">Learn with peers</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
