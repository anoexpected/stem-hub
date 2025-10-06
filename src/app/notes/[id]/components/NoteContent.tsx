'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import './tiptap-content.css';
import { Printer, Download } from 'lucide-react';

interface NoteContentProps {
  note: any;
}

export default function NoteContent({ note }: NoteContentProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a blob with the note content
    const contentType = isHtmlContent(note.content) ? 'text/html' : 'text/markdown';
    const blob = new Blob([note.content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${isHtmlContent(note.content) ? '.html' : '.md'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Detect if content is HTML or Markdown
  const isHtmlContent = (content: string) => {
    return content.trim().startsWith('<') || content.includes('<p>') || content.includes('<div>');
  };

  const isHtml = isHtmlContent(note.content);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 font-['Poppins']">
          Study Notes
        </h2>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Print"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Download"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <article className="prose prose-lg max-w-none">
          {isHtml ? (
            // Render HTML content directly
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: note.content }}
              style={{
                lineHeight: '1.75',
              }}
            />
          ) : (
            // Render Markdown content
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Headings
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-8 font-['Poppins']" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6 font-['Poppins']" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold text-gray-900 mb-2 mt-4 font-['Poppins']" {...props} />
                ),

                // Paragraphs
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                ),

                // Lists
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="ml-4" {...props} />
                ),

                // Code
                code: ({ node, inline, className, children, ...props }: any) => {
                  return inline ? (
                    <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4" {...props}>
                      {children}
                    </code>
                  );
                },

                // Images
                img: ({ node, ...props }) => (
                  <img
                    className="max-w-full h-auto rounded-lg shadow-md my-6 mx-auto"
                    {...props}
                  />
                ),

                // Links
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#2ECC71] underline hover:text-[#27AE60] transition"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),

                // Blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#2ECC71] pl-4 italic text-gray-700 my-4 bg-green-50 py-2"
                    {...props}
                  />
                ),

                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-2 bg-gray-50 text-left text-sm font-bold text-gray-900" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200" {...props} />
                ),
              }}
            >
              {note.content}
            </ReactMarkdown>
          )}
        </article>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          Last updated: {new Date(note.updated_at || note.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
