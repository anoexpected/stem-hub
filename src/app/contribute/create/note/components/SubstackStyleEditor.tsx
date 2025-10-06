'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import '../editor-styles.css';
import {
    Bold,
    Italic,
    Code,
    Link as LinkIcon,
    Image as ImageIcon,
    Minus,
    Type,
    List,
    ListOrdered,
    Quote,
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { uploadImage, STORAGE_BUCKETS } from '@/lib/storage';

const lowlight = createLowlight(common);

interface SubstackStyleEditorProps {
    title: string;
    subtitle: string;
    content: string;
    onTitleChange: (title: string) => void;
    onSubtitleChange: (subtitle: string) => void;
    onContentChange: (content: string) => void;
    userId: string;
    autoSave?: boolean;
    onAutoSave?: () => void;
}

export default function SubstackStyleEditor({
    title,
    subtitle,
    content,
    onTitleChange,
    onSubtitleChange,
    onContentChange,
    userId,
    autoSave = false,
    onAutoSave,
}: SubstackStyleEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#2ECC71] underline hover:text-[#27AE60] cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing your note... Use $equation$ for inline math or $$equation$$ for display math.',
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-4',
                },
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onContentChange(html);

            // Calculate word and character count
            const text = editor.getText();
            setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
            setCharCount(text.length);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] pt-8',
                style: 'font-family: "Georgia", serif; line-height: 1.8;',
            },
        },
    });

    // Auto-save effect
    useEffect(() => {
        if (!autoSave || !onAutoSave) return;

        const timer = setTimeout(() => {
            if (title || content) {
                onAutoSave();
            }
        }, 3000); // Auto-save after 3 seconds of inactivity

        return () => clearTimeout(timer);
    }, [title, subtitle, content, autoSave, onAutoSave]);

    // Drag and drop for images
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (!editor) return;

            const file = acceptedFiles[0];
            if (!file || !file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setIsUploading(true);
            try {
                const url = await uploadImage(file, STORAGE_BUCKETS.NOTE_IMAGES, userId);
                editor.chain().focus().setImage({ src: url }).run();
                toast.success('Image uploaded successfully!');
            } catch (error: any) {
                toast.error(error.message || 'Failed to upload image');
            } finally {
                setIsUploading(false);
            }
        },
        [editor, userId]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
        noClick: true,
        noKeyboard: true,
    });

    if (!editor) {
        return null;
    }

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            onDrop([file]);
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

    return (
        <div className="max-w-4xl mx-auto">
            {/* Title Input */}
            <div className="mb-4">
                <textarea
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Note title"
                    className="w-full text-5xl font-bold text-gray-900 placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden bg-transparent"
                    style={{
                        fontFamily: '"Poppins", sans-serif',
                        lineHeight: '1.2',
                        minHeight: '120px',
                    }}
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
            </div>

            {/* Subtitle Input */}
            <div className="mb-8">
                <textarea
                    value={subtitle}
                    onChange={(e) => onSubtitleChange(e.target.value)}
                    placeholder="Add a subtitle (optional)"
                    className="w-full text-2xl text-gray-600 placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden bg-transparent"
                    style={{
                        fontFamily: '"Georgia", serif',
                        lineHeight: '1.4',
                    }}
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />
            </div>

            {/* Fixed Toolbar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-3 mb-6 -mx-4 px-4 shadow-sm">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Heading (H2)"
                    >
                        <Type className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('bold') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Bold (⌘B)"
                    >
                        <Bold className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('italic') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Italic (⌘I)"
                    >
                        <Italic className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <button
                        type="button"
                        onClick={handleAddLink}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('link') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Add Link"
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="p-2 rounded hover:bg-gray-100 transition text-gray-700 disabled:opacity-50"
                        title="Upload Image"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('bulletList') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Bullet List"
                    >
                        <List className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('orderedList') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('blockquote') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Quote"
                    >
                        <Quote className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-gray-100 transition ${editor.isActive('codeBlock') ? 'bg-gray-200 text-[#2ECC71]' : 'text-gray-700'
                            }`}
                        title="Code Block"
                    >
                        <Code className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="p-2 rounded hover:bg-gray-100 transition text-gray-700"
                        title="Divider"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    {/* Word Count */}
                    <div className="ml-auto text-sm text-gray-500">
                        {wordCount} words · {charCount} characters
                    </div>
                </div>
            </div>

            {/* Editor with Drag & Drop */}
            <div
                {...getRootProps()}
                className={`relative ${isDragActive ? 'ring-4 ring-[#2ECC71] ring-opacity-50 rounded-lg' : ''
                    }`}
            >
                <input {...getInputProps()} />
                {isDragActive && (
                    <div className="absolute inset-0 bg-[#2ECC71] bg-opacity-10 rounded-lg flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <ImageIcon className="w-12 h-12 text-[#2ECC71] mx-auto mb-2" />
                            <p className="text-gray-700 font-medium">Drop image here</p>
                        </div>
                    </div>
                )}

                <EditorContent editor={editor} />

                {isUploading && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        Uploading image...
                    </div>
                )}
            </div>

            {/* LaTeX Helper */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>💡 LaTeX Support:</strong> Use{' '}
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">$equation$</code> for inline math or{' '}
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs">$$equation$$</code> for display math.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                    Example: <code className="bg-blue-100 px-2 py-1 rounded">$E = mc^2$</code> or{' '}
                    <code className="bg-blue-100 px-2 py-1 rounded">{'$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$'}</code>
                </p>
            </div>
        </div>
    );
}
