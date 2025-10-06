'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Code,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Link as LinkIcon,
    Undo,
    Redo,
    Calculator as MathIcon,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadImage, STORAGE_BUCKETS } from '@/lib/storage';
import LatexInput from './LatexInput';
import ImageUploader from './ImageUploader';

const lowlight = createLowlight(common);

interface EnhancedRichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    userId: string;
    useEnhancedModals?: boolean; // Toggle to use new modal components
}

export default function EnhancedRichTextEditor({
    content,
    onChange,
    userId,
    useEnhancedModals = true,
}: EnhancedRichTextEditorProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [showLatexModal, setShowLatexModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#2ECC71] underline hover:text-[#27AE60]',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm',
                },
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
            },
        },
    });

    if (!editor) {
        return null;
    }

    // Legacy image upload (simple inline method)
    const handleSimpleImageUpload = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

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
        };

        input.click();
    };

    const handleImageUpload = () => {
        if (useEnhancedModals) {
            setShowImageModal(true);
        } else {
            handleSimpleImageUpload();
        }
    };

    const handleImageInsert = (url: string, altText: string) => {
        editor.chain().focus().setImage({ src: url, alt: altText }).run();
        setShowImageModal(false);
    };

    const handleAddLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleLatexInsert = (latex: string, isBlock: boolean) => {
        const formatted = isBlock ? `$$${latex}$$` : `$${latex}$`;
        editor.chain().focus().insertContent(formatted).run();
        setShowLatexModal(false);
    };

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children,
        title,
    }: any) => (
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

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2 items-center">
                {/* Text Formatting */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Inline Code"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Headings */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                {/* Lists & Quotes */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
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
                </div>

                {/* Media & Links */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                    <ToolbarButton
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        title={useEnhancedModals ? "Upload Image (Enhanced)" : "Upload Image"}
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={handleAddLink}
                        isActive={editor.isActive('link')}
                        title="Add Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>

                    {useEnhancedModals && (
                        <ToolbarButton
                            onClick={() => setShowLatexModal(true)}
                            title="LaTeX Math Editor (Enhanced)"
                        >
                            <MathIcon className="w-4 h-4" />
                        </ToolbarButton>
                    )}
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center space-x-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>

                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white">
                <EditorContent editor={editor} />
            </div>

            {/* LaTeX Helper (shown only if not using enhanced modals) */}
            {!useEnhancedModals && (
                <div className="bg-blue-50 border-t border-blue-200 p-3">
                    <p className="text-xs text-blue-800">
                        <strong>💡 LaTeX Tip:</strong> Use <code className="bg-blue-100 px-1 rounded">$equation$</code> for inline math or <code className="bg-blue-100 px-1 rounded">$$equation$$</code> for block equations.
                        Example: <code className="bg-blue-100 px-1 rounded">$x^2 + y^2 = z^2$</code>
                    </p>
                </div>
            )}

            {/* Enhanced Modals */}
            {useEnhancedModals && showLatexModal && (
                <LatexInput
                    onInsert={handleLatexInsert}
                    onClose={() => setShowLatexModal(false)}
                />
            )}

            {useEnhancedModals && showImageModal && (
                <ImageUploader
                    onInsert={handleImageInsert}
                    onClose={() => setShowImageModal(false)}
                    userId={userId}
                />
            )}
        </div>
    );
}
