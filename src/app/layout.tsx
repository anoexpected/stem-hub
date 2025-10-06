import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import AuthErrorHandler from '@/components/AuthErrorHandler';
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "STEM Hub - Africa's STEM Education Platform",
    description: "Your exam board. Your syllabus. Your future. Empowering African students with AI-powered STEM education.",
    keywords: ["STEM", "education", "Africa", "learning", "AI tutor", "practice questions"],
    authors: [{ name: "STEM Hub" }],
    openGraph: {
        title: "STEM Hub - Africa's STEM Education Platform",
        description: "Empowering Africa's Next Generation of Innovators",
        type: "website",
        locale: "en_GB",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="antialiased">
                <AuthErrorHandler />
                <Toaster position="top-right" />
                {children}
            </body>
        </html>
    );
}
