'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from '@/components/features/GlobalSearch';
import { BookOpen, Home, FileText, HelpCircle, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function StudentHeader() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path);
    };

    const navLinks = [
        { href: '/learn/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
        { href: '/subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
        { href: '/notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
        { href: '/quizzes', label: 'Quizzes', icon: <HelpCircle className="w-4 h-4" /> },
        { href: '/past-papers', label: 'Past Papers', icon: <FileText className="w-4 h-4" /> },
    ];

    return (
        <header className="bg-gradient-to-r from-[#1B2A4C] to-[#2C3E50] text-white shadow-lg sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="text-2xl font-bold font-['Poppins']">
                            <span className="text-white">STEM</span>
                            <span className="text-[#2ECC71]"> Hub</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                  ${isActive(link.href)
                                        ? 'bg-[#2ECC71] text-white'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }
                `}
                            >
                                {link.icon}
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Search & Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <GlobalSearch />
                        </div>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                <span>Profile</span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="mb-4">
                            <GlobalSearch />
                        </div>
                        <nav className="space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                    flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors
                    ${isActive(link.href)
                                            ? 'bg-[#2ECC71] text-white'
                                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                        }
                  `}
                                >
                                    {link.icon}
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            ))}
                            <Link
                                href="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center space-x-2 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Profile</span>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export function StudentFooter() {
    return (
        <footer className="bg-[#1B2A4C] text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold font-['Poppins'] mb-4">
                            <span className="text-white">STEM</span>
                            <span className="text-[#2ECC71]"> Hub</span>
                        </h3>
                        <p className="text-sm">
                            Empowering Africa&apos;s next generation of innovators with quality STEM education.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4 font-['Poppins']">Learn</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/subjects" className="hover:text-[#2ECC71] transition-colors">Browse Subjects</Link></li>
                            <li><Link href="/notes" className="hover:text-[#2ECC71] transition-colors">Study Notes</Link></li>
                            <li><Link href="/quizzes" className="hover:text-[#2ECC71] transition-colors">Practice Quizzes</Link></li>
                            <li><Link href="/past-papers" className="hover:text-[#2ECC71] transition-colors">Past Papers</Link></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="font-bold text-white mb-4 font-['Poppins']">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contribute" className="hover:text-[#2ECC71] transition-colors">Become a Contributor</Link></li>
                            <li><Link href="/forums" className="hover:text-[#2ECC71] transition-colors">Forums</Link></li>
                            <li><Link href="/study-groups" className="hover:text-[#2ECC71] transition-colors">Study Groups</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-white mb-4 font-['Poppins']">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="hover:text-[#2ECC71] transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="hover:text-[#2ECC71] transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-[#2ECC71] transition-colors">About Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p>&copy; 2025 STEM Hub. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-[#2ECC71] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#2ECC71] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
