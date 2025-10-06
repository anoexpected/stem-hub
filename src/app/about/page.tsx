import Link from "next/link";
import { ChevronRight, Target, Users, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="flex items-center space-x-2 mb-4 text-white/80">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span>About Us</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] mb-4">
                        About STEM Hub
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl">
                        Empowering Africa's next generation of innovators with quality STEM education
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6 text-center">
                        Our Mission
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed text-center mb-8">
                        We believe every African student deserves access to quality STEM education, regardless of their location or economic background.
                        STEM Hub is on a mission to <strong className="text-[#2ECC71]">end educational inequality</strong> by providing free,
                        high-quality learning resources aligned with African exam boards.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#1B2A4C] mb-12 text-center">
                        Our Core Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Target className="w-8 h-8" />,
                                title: 'Africa-First',
                                desc: 'Built specifically for African exam boards and curricula',
                                color: '#2ECC71'
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: 'Always Free',
                                desc: 'Quality education should never be behind a paywall',
                                color: '#E74C3C'
                            },
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: 'Community-Driven',
                                desc: 'Created by students, reviewed by educators, for everyone',
                                color: '#8E44AD'
                            },
                            {
                                icon: <Zap className="w-8 h-8" />,
                                title: 'Excellence',
                                desc: 'Rigorous quality standards and continuous improvement',
                                color: '#F1C40F'
                            }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-8 shadow-sm text-center">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                                    style={{ backgroundColor: `${value.color}15`, color: value.color }}
                                >
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                        Our Story
                    </h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            STEM Hub was born out of a simple observation: while there are countless educational resources online,
                            very few cater specifically to the African context and exam boards like ZIMSEC, WAEC, IGCSE, and others.
                        </p>
                        <p>
                            We recognized that African students were spending hours searching for relevant materials,
                            often finding resources that didn&apos;t align with their syllabus or learning needs.
                            This gap inspired us to create a platform that would be <strong>Africa-first</strong> in its approach.
                        </p>
                        <p>
                            Today, STEM Hub serves thousands of students across the continent, offering free notes, interactive quizzes,
                            past papers, and AI-powered learning tools. Our content is created by top-performing students and
                            rigorously reviewed by experienced educators to ensure accuracy and relevance.
                        </p>
                        <p className="text-[#2ECC71] font-semibold">
                            We&apos;re just getting started on our journey to democratize quality STEM education across Africa.
                        </p>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="bg-gradient-to-r from-[#2ECC71] to-[#16A085] text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-12 text-center">
                        Our Impact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold mb-2">1,000+</div>
                            <div className="text-lg text-white/90">Active Students</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="text-lg text-white/90">Study Resources</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">6</div>
                            <div className="text-lg text-white/90">Exam Boards Supported</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">100%</div>
                            <div className="text-lg text-white/90">Free Forever</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-gradient-to-br from-[#1B2A4C] to-[#2C3E50] rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-6">
                        Join Our Community
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Whether you&apos;re a student looking to excel or a contributor wanting to help others,
                        there&apos;s a place for you at STEM Hub.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <button className="px-8 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors">
                                Sign Up as Student
                            </button>
                        </Link>
                        <Link href="/contribute">
                            <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-[#1B2A4C] text-white font-semibold rounded-lg transition-all duration-200">
                                Become a Contributor
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
