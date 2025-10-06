/**
 * Text utilities for content preview and manipulation
 */

/**
 * Strip HTML tags from content and return clean text preview
 * @param htmlContent - The HTML content string
 * @param maxLength - Maximum length of the preview text (default: 200)
 * @returns Clean text preview without HTML tags
 */
export function stripHtmlTags(htmlContent: string, maxLength: number = 200): string {
    if (!htmlContent) return '';

    // Remove HTML tags
    const text = htmlContent.replace(/<[^>]*>/g, ' ');

    // Remove extra whitespace and normalize spaces
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Truncate to max length with ellipsis
    if (cleanText.length > maxLength) {
        return cleanText.substring(0, maxLength) + '...';
    }

    return cleanText;
}

/**
 * Detect if content is HTML or Markdown
 * @param content - The content string to check
 * @returns true if content appears to be HTML
 */
export function isHtmlContent(content: string): boolean {
    if (!content) return false;

    const trimmed = content.trim();
    return (
        trimmed.startsWith('<') ||
        content.includes('<p>') ||
        content.includes('<div>') ||
        content.includes('<h1>') ||
        content.includes('<ul>') ||
        content.includes('<ol>')
    );
}

/**
 * Get a preview excerpt from content (handles both HTML and Markdown)
 * @param content - The content string
 * @param maxLength - Maximum length of preview
 * @returns Clean preview text
 */
export function getContentPreview(content: string, maxLength: number = 200): string {
    if (!content) return '';

    // If it's HTML, strip tags first
    if (isHtmlContent(content)) {
        return stripHtmlTags(content, maxLength);
    }

    // For Markdown or plain text, just truncate
    const cleanText = content.replace(/\s+/g, ' ').trim();

    if (cleanText.length > maxLength) {
        return cleanText.substring(0, maxLength) + '...';
    }

    return cleanText;
}

/**
 * Count words in text (strips HTML first if needed)
 * @param content - The content string
 * @returns Word count
 */
export function countWords(content: string): number {
    if (!content) return 0;

    let text = content;

    // Strip HTML if present
    if (isHtmlContent(content)) {
        text = content.replace(/<[^>]*>/g, ' ');
    }

    // Split by whitespace and filter empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);

    return words.length;
}
