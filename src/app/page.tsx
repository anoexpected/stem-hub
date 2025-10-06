import Link from "next/link";
import { createClient } from '@/lib/supabase/server';
import { NotePreviewCard } from '@/components/features/StudentComponents';
import { ArrowRight, BookOpen, Sparkles, Award, TrendingUp, CheckCircle } from 'lucide-react';

export default async function HomePage() {
    const supabase = await createClient();

    // Fetch popular notes (top 6 by views)
    const { data: popularNotes } = await supabase
        .from('notes')
        .select(`
            id,
            title,
            content,
            views_count,
            created_at,
            users!notes_created_by_fkey(id, full_name),
            topics(id, name, subjects(id, name))
        `)
        .eq('status', 'published')
        .order('views_count', { ascending: false })
        .limit(6);

    // Fetch subjects with counts
    const { data: subjects } = await supabase
        .from('subjects')
        .select('id, name, description, icon, color')
        .order('name')
        .limit(6);

    // Get total counts for stats
    const { count: totalNotes } = await supabase
        .from('notes')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published');

    const { count: totalQuizzes } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published');

    const { count: totalUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true });

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold font-['Poppins']">
                                <span className="text-[#1B2A4C]">STEM</span>
                                <span className="text-[#2ECC71]"> Hub</span>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/subjects" className="text-gray-700 hover:text-[#2ECC71] font-medium transition-colors">Subjects</Link>
                            <Link href="/notes" className="text-gray-700 hover:text-[#2ECC71] font-medium transition-colors">Notes</Link>
                            <Link href="/quizzes" className="text-gray-700 hover:text-[#2ECC71] font-medium transition-colors">Quizzes</Link>
                            <Link href="/past-papers" className="text-gray-700 hover:text-[#2ECC71] font-medium transition-colors">Past Papers</Link>
                            <Link href="/about" className="text-gray-700 hover:text-[#2ECC71] font-medium transition-colors">About</Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link href="/auth/login">
                                <button className="hidden md:block px-4 py-2 text-[#1B2A4C] font-medium hover:text-[#2ECC71] transition-colors">
                                    Log In
                                </button>
                            </Link>
                            <Link href="/auth/select-role">
                                <button className="px-6 py-2 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors shadow-sm">
                                    Sign Up Free
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#1B2A4C] via-[#2C3E50] to-[#1B2A4C] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] mb-6 leading-tight">
                            Trusted by <span className="text-[#F1C40F]">thousands</span> of African students,
                            <span className="text-[#2ECC71]"> supercharge</span> your learning!
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
                            Free notes, interactive quizzes & AI-powered learning built for African exam boards,
                            <br className="hidden md:block" />
                            reviewed by educators.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link href="/auth/select-role">
                                <button className="w-full sm:w-auto px-8 py-4 bg-[#E74C3C] hover:bg-[#C0392B] text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2">
                                    <span>Sign up for Free</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="/subjects">
                                <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-[#1B2A4C] text-white text-lg font-bold rounded-lg transition-all duration-200">
                                    Explore the Subjects
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">Supporting:</span>
                            {['ZIMSEC', 'WAEC', 'IGCSE', 'A-levels', 'KCSE', 'NECTA'].map((board) => (
                                <span key={board} className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
                                    {board}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-gradient-to-r from-[#2ECC71] to-[#16A085] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold font-['Poppins'] mb-2">{totalUsers || '1,000+'}</div>
                            <div className="text-white/90">Active Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-['Poppins'] mb-2">{totalNotes || '500+'}</div>
                            <div className="text-white/90">Study Notes & Resources</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold font-['Poppins'] mb-2">{totalQuizzes || '200+'}</div>
                            <div className="text-white/90">Interactive Quizzes</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Resources Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            <span className="text-[#F1C40F]">Thousands</span> of <span className="text-[#2ECC71]">free</span> notes, videos & quizzes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Built by top students, reviewed by educators, aligned with your exam syllabus
                        </p>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {subjects?.slice(0, 6).map((subject: any) => (
                            <Link key={subject.id} href={`/subjects/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                <div className="bg-white border-2 border-gray-200 hover:border-[#2ECC71] rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg group cursor-pointer h-full">
                                    <div className="text-4xl mb-3">{subject.icon || '📖'}</div>
                                    <h3 className="font-bold text-[#1B2A4C] group-hover:text-[#2ECC71] transition-colors text-sm">
                                        {subject.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/subjects">
                            <button className="px-8 py-3 border-2 border-gray-300 hover:border-[#2ECC71] text-gray-700 hover:text-[#2ECC71] font-semibold rounded-lg transition-all duration-200">
                                Explore all subjects
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Notes */}
            {popularNotes && popularNotes.length > 0 && (
                <section className="py-20 px-4 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A4C] font-['Poppins'] mb-2 flex items-center space-x-3">
                                    <TrendingUp className="w-8 h-8 text-[#F1C40F]" />
                                    <span>🔥 Popular This Week</span>
                                </h2>
                                <p className="text-gray-600">Most viewed by students</p>
                            </div>
                            <Link href="/notes" className="hidden md:flex items-center space-x-2 text-[#2ECC71] hover:text-[#27AE60] font-semibold">
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularNotes.slice(0, 6).map((note: any) => (
                                <NotePreviewCard
                                    key={note.id}
                                    id={note.id}
                                    title={note.title}
                                    excerpt={note.content?.substring(0, 150)}
                                    author={note.users?.full_name || 'Anonymous'}
                                    viewCount={note.view_count || 0}
                                    topicName={note.topics?.name}
                                    subjectName={note.topics?.subjects?.name}
                                    createdAt={note.created_at}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Quality Process */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                            Our content is always <span className="text-[#8E44AD]">accurate</span> and <span className="text-[#2ECC71]">up to date</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { num: '1', title: 'Application', desc: 'Top students apply to contribute', color: '#2ECC71' },
                            { num: '2', title: 'Training', desc: 'Contributors learn best practices', color: '#8E44AD' },
                            { num: '3', title: 'Review', desc: 'Content reviewed by educators', color: '#F1C40F' },
                            { num: '4', title: 'Publication', desc: 'Approved content goes live', color: '#16A085' }
                        ].map((step) => (
                            <div key={step.num} className="text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 mx-auto" style={{ backgroundColor: step.color }}>
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold font-['Poppins'] text-[#1B2A4C] mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">
                            <span className="text-[#2ECC71]">Maximize</span> your learning experience
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <BookOpen className="w-8 h-8" />, title: 'Comprehensive Notes', desc: 'Access well-structured notes with LaTeX equations', link: '/notes', color: '#2ECC71' },
                            { icon: <Sparkles className="w-8 h-8" />, title: 'Interactive Quizzes', desc: 'Test your knowledge and track progress', link: '/quizzes', color: '#8E44AD' },
                            { icon: <Award className="w-8 h-8" />, title: 'Track Progress', desc: 'Monitor learning journey and earn achievements', link: '/auth/select-role', color: '#F1C40F' }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-['Poppins'] text-[#1B2A4C] mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6">{feature.desc}</p>
                                <Link href={feature.link} className="font-semibold hover:underline inline-flex items-center space-x-2" style={{ color: feature.color }}>
                                    <span>Learn More</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-4 bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] mb-6">
                        On a mission to end <span className="text-[#2ECC71]">educational inequality</span> for African students
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                        We believe every African student deserves quality STEM education.
                        That's why STEM Hub is <strong>free</strong>, <strong>community-driven</strong>, and <strong>Africa-first</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/about">
                            <button className="px-8 py-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold rounded-lg transition-colors">
                                Our Story
                            </button>
                        </Link>
                        <Link href="/auth/login?intended_role=contributor">
                            <button className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-[#1B2A4C] text-white font-semibold rounded-lg transition-all duration-200">
                                Become a Contributor
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#1B2A4C] mb-6">
                        Supercharge your <span className="text-[#F1C40F]">learning</span>.
                    </h2>
                    <p className="text-xl text-gray-600 mb-10">
                        Join thousands of African students already excelling with STEM Hub
                    </p>
                    <Link href="/auth/select-role">
                        <button className="px-10 py-4 bg-[#E74C3C] hover:bg-[#C0392B] text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2">
                            <span>Join Now!</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1B2A4C] text-gray-300">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <div className="text-2xl font-bold font-['Poppins'] mb-4">
                                <span className="text-white">STEM</span>
                                <span className="text-[#2ECC71]"> Hub</span>
                            </div>
                            <p className="text-sm mb-6 text-gray-400">
                                Empowering Africa's next generation of innovators with quality STEM education.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold font-['Poppins'] mb-4">Explore</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/subjects" className="hover:text-[#2ECC71] transition-colors">Subjects</Link></li>
                                <li><Link href="/notes" className="hover:text-[#2ECC71] transition-colors">Study Notes</Link></li>
                                <li><Link href="/quizzes" className="hover:text-[#2ECC71] transition-colors">Quizzes</Link></li>
                                <li><Link href="/past-papers" className="hover:text-[#2ECC71] transition-colors">Past Papers</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold font-['Poppins'] mb-4">Community</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/contribute" className="hover:text-[#2ECC71] transition-colors">Become a Contributor</Link></li>
                                <li><Link href="/forums" className="hover:text-[#2ECC71] transition-colors">Forums</Link></li>
                                <li><Link href="/about" className="hover:text-[#2ECC71] transition-colors">About Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold font-['Poppins'] mb-4">Support</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/help" className="hover:text-[#2ECC71] transition-colors">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-[#2ECC71] transition-colors">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:text-[#2ECC71] transition-colors">Privacy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; 2025 STEM Hub. All rights reserved. Built with ❤️ for Africa 🌍</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
