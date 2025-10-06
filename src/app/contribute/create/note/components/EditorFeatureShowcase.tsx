'use client';

import { useState } from 'react';
import {
    FileText,
    Image as ImageIcon,
    Type,
    Save,
    Eye,
    Zap,
    Smartphone,
    Check
} from 'lucide-react';

export default function EditorFeatureShowcase() {
    const [activeTab, setActiveTab] = useState<'features' | 'comparison'>('features');

    const features = [
        {
            icon: <Type className="w-6 h-6" />,
            title: 'Beautiful Typography',
            description: 'Georgia serif for content, Poppins for headings - optimized for reading'
        },
        {
            icon: <ImageIcon className="w-6 h-6" />,
            title: 'Drag & Drop Images',
            description: 'Simply drag images into the editor or click to upload'
        },
        {
            icon: <Save className="w-6 h-6" />,
            title: 'Auto-Save',
            description: 'Never lose your work with automatic draft saving every 3 seconds'
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: 'Live Preview',
            description: 'See exactly how your note will look with one-click preview'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'LaTeX Support',
            description: 'Write mathematical equations with full LaTeX support'
        },
        {
            icon: <Smartphone className="w-6 h-6" />,
            title: 'Mobile Friendly',
            description: 'Fully responsive design that works perfectly on all devices'
        }
    ];

    const comparisons = [
        { feature: 'Full-width editor', old: false, new: true },
        { feature: 'Auto-expanding title', old: false, new: true },
        { feature: 'Drag & drop images', old: false, new: true },
        { feature: 'Auto-save drafts', old: false, new: true },
        { feature: 'Word/character count', old: false, new: true },
        { feature: 'Sticky toolbar', old: false, new: true },
        { feature: 'Professional typography', old: false, new: true },
        { feature: 'One-click preview', old: true, new: true },
        { feature: 'LaTeX math support', old: true, new: true },
        { feature: 'Rich text formatting', old: true, new: true },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 font-['Poppins']">
                    New Substack-Style Editor ✨
                </h1>
                <p className="text-xl text-gray-600">
                    A professional writing experience for creating beautiful study notes
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('features')}
                    className={`px-6 py-3 font-medium transition ${activeTab === 'features'
                            ? 'text-[#2ECC71] border-b-2 border-[#2ECC71]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Features
                </button>
                <button
                    onClick={() => setActiveTab('comparison')}
                    className={`px-6 py-3 font-medium transition ${activeTab === 'comparison'
                            ? 'text-[#2ECC71] border-b-2 border-[#2ECC71]'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Before & After
                </button>
            </div>

            {/* Content */}
            {activeTab === 'features' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-[#2ECC71] mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 font-['Poppins']">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
                        <div className="px-6 py-4 font-medium text-gray-700">Feature</div>
                        <div className="px-6 py-4 font-medium text-gray-700 text-center border-l border-gray-200">
                            Old Editor
                        </div>
                        <div className="px-6 py-4 font-medium text-gray-700 text-center border-l border-gray-200">
                            New Editor
                        </div>
                    </div>
                    {comparisons.map((item, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                        >
                            <div className="px-6 py-4 text-gray-900">{item.feature}</div>
                            <div className="px-6 py-4 flex items-center justify-center border-l border-gray-200">
                                {item.old ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <span className="text-gray-300">—</span>
                                )}
                            </div>
                            <div className="px-6 py-4 flex items-center justify-center border-l border-gray-200">
                                {item.new ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <span className="text-gray-300">—</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-lg p-8 text-center text-white">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 font-['Poppins']">
                    Ready to Create?
                </h2>
                <p className="text-green-50 mb-6">
                    Start writing beautiful study notes with our new editor
                </p>
                <button className="bg-white text-[#2ECC71] px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition">
                    Create Your First Note
                </button>
            </div>
        </div>
    );
}
