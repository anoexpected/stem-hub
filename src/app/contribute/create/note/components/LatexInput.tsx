'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import toast from 'react-hot-toast';

interface LatexInputProps {
    onInsert: (latex: string, isBlock: boolean) => void;
    onClose: () => void;
}

export default function LatexInput({ onInsert, onClose }: LatexInputProps) {
    const [input, setInput] = useState('');
    const [isBlock, setIsBlock] = useState(false);
    const [copied, setCopied] = useState(false);

    // Common LaTeX templates
    const templates = [
        { label: 'Fraction', latex: '\\frac{a}{b}' },
        { label: 'Square Root', latex: '\\sqrt{x}' },
        { label: 'Power', latex: 'x^{n}' },
        { label: 'Subscript', latex: 'x_{i}' },
        { label: 'Sum', latex: '\\sum_{i=1}^{n}' },
        { label: 'Integral', latex: '\\int_{a}^{b}' },
        { label: 'Limit', latex: '\\lim_{x \\to \\infty}' },
        { label: 'Greek α', latex: '\\alpha' },
        { label: 'Greek β', latex: '\\beta' },
        { label: 'Greek θ', latex: '\\theta' },
        { label: 'Greek π', latex: '\\pi' },
        { label: 'Greek Σ', latex: '\\Sigma' },
        { label: 'Matrix', latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
        { label: 'Binomial', latex: '\\binom{n}{k}' },
        { label: 'Not Equal', latex: '\\neq' },
        { label: 'Less/Greater', latex: '\\leq, \\geq' },
        { label: 'Infinity', latex: '\\infty' },
        { label: 'Plus/Minus', latex: '\\pm' },
    ];

    const commonEquations = [
        { label: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
        { label: 'Pythagorean', latex: 'a^2 + b^2 = c^2' },
        { label: 'Area of Circle', latex: 'A = \\pi r^2' },
        { label: 'Slope', latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}' },
        { label: 'Distance', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}' },
    ];

    const handleInsert = () => {
        if (!input.trim()) {
            toast.error('Please enter a LaTeX equation');
            return;
        }
        onInsert(input, isBlock);
        setInput('');
        toast.success('LaTeX inserted!');
    };

    const handleTemplateClick = (latex: string) => {
        setInput((prev) => prev + latex);
    };

    const handleCopy = () => {
        const formatted = isBlock ? `$$${input}$$` : `$${input}$`;
        navigator.clipboard.writeText(formatted);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold font-['Poppins']">LaTeX Math Editor</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Type Selector */}
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={!isBlock}
                                onChange={() => setIsBlock(false)}
                                className="w-4 h-4 text-[#2ECC71]"
                            />
                            <span className="text-sm font-medium">Inline Math ($...$)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={isBlock}
                                onChange={() => setIsBlock(true)}
                                className="w-4 h-4 text-[#2ECC71]"
                            />
                            <span className="text-sm font-medium">Block Math ($$...$$)</span>
                        </label>
                    </div>

                    {/* Input Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            LaTeX Code
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter LaTeX code... (e.g., x^2 + y^2 = z^2)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent resize-none font-mono text-sm"
                            rows={4}
                        />
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                            {input ? (
                                <div className="text-lg">
                                    {isBlock ? (
                                        <BlockMath math={input} errorColor="#ef4444" />
                                    ) : (
                                        <InlineMath math={input} errorColor="#ef4444" />
                                    )}
                                </div>
                            ) : (
                                <span className="text-gray-400 text-sm">Preview appears here...</span>
                            )}
                        </div>
                    </div>

                    {/* Common Symbols */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Common Symbols
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {templates.map((template) => (
                                <button
                                    key={template.label}
                                    onClick={() => handleTemplateClick(template.latex)}
                                    className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-[#2ECC71] hover:text-white hover:border-[#2ECC71] transition font-mono"
                                    title={template.latex}
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Common Equations */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Common Equations
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {commonEquations.map((eq) => (
                                <button
                                    key={eq.label}
                                    onClick={() => setInput(eq.latex)}
                                    className="px-4 py-3 text-left border border-gray-300 rounded-lg hover:border-[#2ECC71] hover:bg-green-50 transition group"
                                >
                                    <div className="text-xs font-medium text-gray-600 mb-1">
                                        {eq.label}
                                    </div>
                                    <div className="text-sm">
                                        <InlineMath math={eq.latex} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Reference */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">Quick Reference</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800">
                            <div><code className="bg-blue-100 px-1 rounded">^</code> Superscript</div>
                            <div><code className="bg-blue-100 px-1 rounded">_</code> Subscript</div>
                            <div><code className="bg-blue-100 px-1 rounded">\frac{'{a}{b}'}</code> Fraction</div>
                            <div><code className="bg-blue-100 px-1 rounded">\sqrt{'{x}'}</code> Square root</div>
                            <div><code className="bg-blue-100 px-1 rounded">{'{'}</code> and <code className="bg-blue-100 px-1 rounded">{'}'}</code> Group items</div>
                            <div><code className="bg-blue-100 px-1 rounded">\</code> Start command</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInsert}
                            className="flex-1 px-6 py-2 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg hover:from-[#27AE60] hover:to-[#229954] transition font-semibold"
                        >
                            Insert LaTeX
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
