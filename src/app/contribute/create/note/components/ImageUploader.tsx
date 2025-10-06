'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, Loader2, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage, STORAGE_BUCKETS } from '@/lib/storage';

interface ImageUploaderProps {
    onInsert: (url: string, altText: string) => void;
    onClose: () => void;
    userId: string;
}

interface UploadedImage {
    url: string;
    name: string;
    size: number;
    altText: string;
}

export default function ImageUploader({ onInsert, onClose, userId }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
    const [altText, setAltText] = useState('');
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
        setIsUploading(true);
        try {
            const url = await uploadImage(file, STORAGE_BUCKETS.NOTE_IMAGES, userId);
            setUploadedImage({
                url,
                name: file.name,
                size: file.size,
                altText: '',
            });
            toast.success('Image uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
            setPreview(null);
        } finally {
            setIsUploading(false);
        }
    }, [userId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
        },
        maxFiles: 1,
        disabled: isUploading || !!uploadedImage,
    });

    const handleInsert = () => {
        if (!uploadedImage) {
            toast.error('Please upload an image first');
            return;
        }
        if (!altText.trim()) {
            toast.error('Please provide alt text for accessibility');
            return;
        }
        onInsert(uploadedImage.url, altText);
        toast.success('Image inserted into note!');
        handleReset();
    };

    const handleReset = () => {
        setUploadedImage(null);
        setPreview(null);
        setAltText('');
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold font-['Poppins']">Upload Image</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Upload Zone */}
                    {!uploadedImage && (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition ${isDragActive
                                    ? 'border-[#2ECC71] bg-green-50'
                                    : 'border-gray-300 hover:border-[#2ECC71] hover:bg-green-50'
                                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <input {...getInputProps()} />

                            {isUploading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-16 h-16 text-[#2ECC71] animate-spin" />
                                    <p className="text-gray-600">Uploading image...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <Upload className="w-8 h-8 text-[#2ECC71]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            or click to browse your computer
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <ImageIcon className="w-4 h-4" />
                                        <span>Supports: PNG, JPG, GIF, WebP, SVG</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Maximum file size: 5MB
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    {preview && uploadedImage && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Image Preview</h3>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>

                            <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded-lg mx-auto max-h-96 object-contain"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2">
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Image Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">File name:</span>
                                        <p className="font-medium text-gray-900 truncate">{uploadedImage.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">File size:</span>
                                        <p className="font-medium text-gray-900">{formatFileSize(uploadedImage.size)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Alt Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alt Text <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Describe the image for accessibility (e.g., 'Graph showing quadratic function')"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-transparent"
                                    maxLength={200}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {altText.length}/200 characters · Help visually impaired users understand the image
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-yellow-900 mb-2">💡 Alt Text Tips</h4>
                                <ul className="text-xs text-yellow-800 space-y-1">
                                    <li>• Be specific and descriptive</li>
                                    <li>• For graphs: describe the trend or key information</li>
                                    <li>• For diagrams: explain what's shown and its purpose</li>
                                    <li>• For equations: describe the mathematical concept</li>
                                    <li>• Keep it concise but informative</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        {uploadedImage && (
                            <button
                                onClick={handleInsert}
                                disabled={!altText.trim()}
                                className="flex-1 px-6 py-2 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg hover:from-[#27AE60] hover:to-[#229954] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Insert Image
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
