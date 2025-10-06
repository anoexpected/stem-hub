'use client';

import { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    List,
    ListOrdered,
    Quote,
    Minus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Undo,
    Redo,
    Type,
    Video,
    Music,
    MousePointerClick,
    TrendingUp,
    Asterisk,
    Calculator,
    Feather,
    BarChart3,
    ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FullEditorToolbarProps {
    editor: Editor;
    isUploading: boolean;
    userId: string;
    onImageUpload: (files: File[]) => void;
}

export default function FullEditorToolbar({ editor, isUploading, userId, onImageUpload }: FullEditorToolbarProps) {
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showAlignMenu, setShowAlignMenu] = useState(false);

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) onImageUpload([file]);
        };
        input.click();
    };

    const handleAddLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl);

        if (url === null) return;

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const handleAddVideo = () => {
        const url = window.prompt('Enter YouTube URL:');
        if (url) {
            (editor.chain().focus() as any).setYoutubeVideo({ src: url }).run();
        }
    };

    const handleAddButton = () => {
        const text = window.prompt('Button text:', 'Click here');
        if (!text) return;
        const url = window.prompt('Button URL:', 'https://');
        if (!url) return;

        (editor.chain().focus() as any).setButton({ text, url }).run();
        toast.success('Button added!');
    };

    const handleAddPoll = () => {
        const question = window.prompt('Poll question:');
        if (!question) return;

        const options: string[] = [];
        for (let i = 1; i <= 4; i++) {
            const option = window.prompt(`Option ${i} (leave empty to stop):`);
            if (!option) break;
            options.push(option);
        }

        if (options.length < 2) {
            toast.error('Please add at least 2 options');
            return;
        }

        (editor.chain().focus() as any).setPoll({ question, options }).run();
        toast.success('Poll added!');
    };

    const handleAddFootnote = () => {
        const text = window.prompt('Footnote text:');
        if (!text) return;

        const number = 1; // You'd track this properly in a real app
        (editor.chain().focus() as any).setFootnote({ number, text }).run();
        toast.success('Footnote added!');
    };

    const handleAddFinancialChart = () => {
        const symbol = window.prompt('Stock symbol (e.g., AAPL):', 'AAPL');
        if (!symbol) return;

        (editor.chain().focus() as any).setFinancialChart({ symbol, type: 'candlestick' }).run();
        toast.success('Financial chart added!');
    };

    const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 transition ${isActive ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    const ToolbarDivider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

    return (
        <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm py-2 px-3 mb-6">
            <div className="flex items-center gap-1 flex-wrap">
                {/* Style Dropdown */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowStyleMenu(!showStyleMenu)}
                        className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 transition text-gray-700"
                    >
                        <Type className="w-4 h-4" />
                        <span className="text-sm">Style</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {showStyleMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] z-20">
                            <button
                                onClick={() => {
                                    editor.chain().focus().setParagraph().run();
                                    setShowStyleMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                Normal text
                            </button>
                            {[1, 2, 3, 4, 5, 6].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => {
                                        editor.chain().focus().toggleHeading({ level: level as any }).run();
                                        setShowStyleMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${editor.isActive('heading', { level }) ? 'bg-gray-100' : ''
                                        }`}
                                >
                                    Heading {level}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <ToolbarDivider />

                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold (⌘B)"
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic (⌘I)"
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Alignment */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowAlignMenu(!showAlignMenu)}
                        className="p-2 rounded hover:bg-gray-100 transition text-gray-700"
                        title="Text alignment"
                    >
                        {editor.isActive({ textAlign: 'center' }) ? <AlignCenter className="w-4 h-4" /> :
                            editor.isActive({ textAlign: 'right' }) ? <AlignRight className="w-4 h-4" /> :
                                editor.isActive({ textAlign: 'justify' }) ? <AlignJustify className="w-4 h-4" /> :
                                    <AlignLeft className="w-4 h-4" />}
                    </button>

                    {showAlignMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                            <button
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('left').run();
                                    setShowAlignMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            >
                                <AlignLeft className="w-4 h-4" /> Left
                            </button>
                            <button
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('center').run();
                                    setShowAlignMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            >
                                <AlignCenter className="w-4 h-4" /> Center
                            </button>
                            <button
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('right').run();
                                    setShowAlignMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            >
                                <AlignRight className="w-4 h-4" /> Right
                            </button>
                            <button
                                onClick={() => {
                                    editor.chain().focus().setTextAlign('justify').run();
                                    setShowAlignMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                            >
                                <AlignJustify className="w-4 h-4" /> Justify
                            </button>
                        </div>
                    )}
                </div>

                <ToolbarDivider />

                {/* Links & Media */}
                <ToolbarButton
                    onClick={handleAddLink}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={handleImageClick}
                    disabled={isUploading}
                    title="Upload Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={handleAddVideo}
                    title="Embed YouTube Video"
                >
                    <Video className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists & Blocks */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    title="Code Block"
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Divider"
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarDivider />

                {/* More Menu */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 transition text-gray-700"
                    >
                        <span className="text-sm">More</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {showMoreMenu && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] z-20">
                            <button
                                onClick={() => {
                                    handleAddButton();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <MousePointerClick className="w-4 h-4" /> Button
                            </button>
                            <button
                                onClick={() => {
                                    handleAddPoll();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <BarChart3 className="w-4 h-4" /> Poll
                            </button>
                            <button
                                onClick={() => {
                                    handleAddFootnote();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <Asterisk className="w-4 h-4" /> Footnote
                            </button>
                            <button
                                onClick={() => {
                                    handleAddFinancialChart();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <TrendingUp className="w-4 h-4" /> Financial Chart
                            </button>
                            <button
                                onClick={() => {
                                    (editor.chain().focus() as any).togglePoetry().run();
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <Feather className="w-4 h-4" /> Poetry
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                                onClick={() => {
                                    const latex = window.prompt('Enter LaTeX formula:');
                                    if (latex) {
                                        editor.commands.insertContent(`$${latex}$`);
                                    }
                                    setShowMoreMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                            >
                                <Calculator className="w-4 h-4" /> LaTeX Formula
                            </button>
                        </div>
                    )}
                </div>

                <ToolbarDivider />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo (⌘Z)"
                >
                    <Undo className="w-4 h-4" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo (⌘Y)"
                >
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </div>
    );
}
