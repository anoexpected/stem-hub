'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { uploadImage, STORAGE_BUCKETS } from '@/lib/storage';
import { Button as ButtonExtension } from '../extensions/Button';
import { Footnote } from '../extensions/Footnote';
import { Poll } from '../extensions/Poll';
import { Poetry } from '../extensions/Poetry';
import { FinancialChart } from '../extensions/FinancialChart';
import FullEditorToolbar from './FullEditorToolbar';
import '../editor-styles.css';
import '../full-editor-styles.css';

const lowlight = createLowlight(common);

interface FullFeaturedEditorProps {
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

export default function FullFeaturedEditor({
    title,
    subtitle,
    content,
    onTitleChange,
    onSubtitleChange,
    onContentChange,
    userId,
    autoSave = false,
    onAutoSave,
}: FullFeaturedEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
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
                placeholder: 'Start writing your masterpiece...',
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Highlight.configure({
                multicolor: true,
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'video-embed',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm my-4',
                },
            }),
            ButtonExtension,
            Footnote,
            Poll,
            Poetry,
            FinancialChart,
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onContentChange(html);

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

    useEffect(() => {
        if (!autoSave || !onAutoSave) return;

        const timer = setTimeout(() => {
            if (title || content) {
                onAutoSave();
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [title, subtitle, content, autoSave, onAutoSave]);

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

            {/* Full-Featured Toolbar */}
            <FullEditorToolbar
                editor={editor}
                isUploading={isUploading}
                userId={userId}
                onImageUpload={onDrop}
            />

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
                            <span className="text-4xl mb-2">📁</span>
                            <p className="text-gray-700 font-medium">Drop image here</p>
                        </div>
                    </div>
                )}

                <EditorContent editor={editor} />

                {isUploading && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        Uploading...
                    </div>
                )}
            </div>

            {/* Word Count Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                <div>
                    {wordCount} words · {charCount} characters
                </div>
                <div className="text-xs text-gray-400">
                    💡 Tip: Use LaTeX for math: $x^2$ or $$equation$$
                </div>
            </div>
        </div>
    );
}
