import { createBrowserClient } from '@supabase/ssr';

/**
 * Get authenticated Supabase client for browser
 * This ensures the user's session is included in requests
 */
function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  NOTE_IMAGES: 'note-images',
  PAST_PAPERS: 'past-papers',
  SYLLABUS_DOCS: 'syllabus-docs',
  AVATARS: 'avatars',
} as const;

/**
 * File upload configuration
 */
export const FILE_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  PDF_MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
};

/**
 * Upload an image to Supabase Storage
 * 
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param userId - User ID for path organization
 * @returns Public URL of uploaded file
 */
export async function uploadImage(
  file: File,
  bucket: string,
  userId: string
): Promise<string> {
  // Validate file type
  if (!FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  // Validate file size
  if (file.size > FILE_LIMITS.IMAGE_MAX_SIZE) {
    throw new Error('File size exceeds 5MB limit.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Get authenticated client
  const supabase = getSupabaseClient();

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Upload a PDF to Supabase Storage
 * 
 * @param file - PDF file to upload
 * @param bucket - Storage bucket name
 * @param userId - User ID for path organization
 * @returns Public URL of uploaded file
 */
export async function uploadPDF(
  file: File,
  bucket: string,
  userId: string
): Promise<string> {
  // Validate file type
  if (!FILE_LIMITS.ALLOWED_PDF_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF files are allowed.');
  }

  // Validate file size
  if (file.size > FILE_LIMITS.PDF_MAX_SIZE) {
    throw new Error('File size exceeds 20MB limit.');
  }

  // Generate unique filename
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // Get authenticated client
  const supabase = getSupabaseClient();

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * 
 * @param bucket - Storage bucket name
 * @param path - File path to delete
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Get file URL from storage path
 * 
 * @param bucket - Storage bucket name
 * @param path - File path
 * @returns Public URL
 */
export function getFileUrl(bucket: string, path: string): string {
  const supabase = getSupabaseClient();

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

/**
 * Format file size for display
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
