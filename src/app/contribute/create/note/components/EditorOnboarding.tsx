'use client';

import { useState, useEffect } from 'react';
import {
    X,
    Sparkles,
    Type,
    Image,
    Calculator,
    Save,
    Eye
} from 'lucide-react';

export default function EditorOnboarding() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen the onboarding
        const hasSeenOnboarding = localStorage.getItem('editor_onboarding_seen');
        if (!hasSeenOnboarding) {
            setIsVisible(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('editor_onboarding_seen', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const tips = [
        {
            icon: <Type className="w-5 h-5" />,
            title: 'Start with a Title',
            description: 'Click on "Note title" to begin. The field auto-expands as you type.',
        },
        {
            icon: <Image className="w-5 h-5" />,
            title: 'Drag & Drop Images',
            description: 'Drag images directly into the editor or use the image button in the toolbar.',
        },
        {
            icon: <Calculator className="w-5 h-5" />,
            title: 'LaTeX Math Support',
            description: 'Use $equation$ for inline or $$equation$$ for display math equations.',
        },
        {
            icon: <Save className="w-5 h-5" />,
            title: 'Auto-Save Enabled',
            description: "Your work saves automatically every 3 seconds. You won't lose your progress!",
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: 'Preview Anytime',
            description: 'Click "Preview" in the top bar to see exactly how your note will look.',
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8" />
                        <h2 className="text-2xl font-bold font-['Poppins']">
                            Welcome to the New Editor!
                        </h2>
                    </div>
                    <p className="text-green-50">
                        Let's quickly walk through the key features
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#2ECC71]">
                                    {tip.icon}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1 font-['Poppins']">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{tip.description}</p>
                            </div>
                        </div>
                    ))}

                    {/* Keyboard Shortcuts */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-bold text-blue-900 mb-3 font-['Poppins']">
                            ⌨️ Keyboard Shortcuts
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-blue-800">
                                <kbd className="bg-blue-100 px-2 py-1 rounded">⌘B</kbd> Bold
                            </div>
                            <div className="text-blue-800">
                                <kbd className="bg-blue-100 px-2 py-1 rounded">⌘I</kbd> Italic
                            </div>
                            <div className="text-blue-800">
                                <kbd className="bg-blue-100 px-2 py-1 rounded">⌘Z</kbd> Undo
                            </div>
                            <div className="text-blue-800">
                                <kbd className="bg-blue-100 px-2 py-1 rounded">⌘Y</kbd> Redo
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 flex justify-between items-center border-t border-gray-200">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                            type="checkbox"
                            onChange={handleClose}
                            className="w-4 h-4 text-[#2ECC71] rounded focus:ring-[#2ECC71]"
                        />
                        Don't show this again
                    </label>
                    <button
                        onClick={handleClose}
                        className="bg-[#2ECC71] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#27AE60] transition"
                    >
                        Got it, let's start!
                    </button>
                </div>
            </div>
        </div>
    );
}
