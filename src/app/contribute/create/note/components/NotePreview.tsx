'use client';

import { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface NotePreviewProps {
  title?: string;
  content: string;
  examBoards?: any[];
  subjects?: any[];
  topics?: any[];
  selectedExamBoardId?: string;
  selectedSubjectId?: string;
  selectedTopicId?: string;
}

export default function NotePreview({
  title,
  content,
  examBoards,
  subjects,
  topics,
  selectedExamBoardId,
  selectedSubjectId,
  selectedTopicId,
}: NotePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Find selected metadata
  const examBoard = examBoards?.find((b) => b.id === selectedExamBoardId);
  const subject = subjects?.find((s) => s.id === selectedSubjectId);
  const topic = topics?.find((t) => t.id === selectedTopicId);

  // Process LaTeX in content
  useEffect(() => {
    if (!contentRef.current || !content) return;

    const processLatex = () => {
      const element = contentRef.current;
      if (!element) return;

      // Process display math ($$...$$)
      element.innerHTML = element.innerHTML.replace(
        /\$\$(.*?)\$\$/g,
        (match, equation) => {
          try {
            return katex.renderToString(equation, {
              displayMode: true,
              throwOnError: false,
            });
          } catch {
            return match;
          }
        }
      );

      // Process inline math ($...$)
      element.innerHTML = element.innerHTML.replace(
        /\$([^\$]+)\$/g,
        (match, equation) => {
          try {
            return katex.renderToString(equation, {
              displayMode: false,
              throwOnError: false,
            });
          } catch {
            return match;
          }
        }
      );
    };

    // Set initial content
    contentRef.current.innerHTML = content;

    // Process LaTeX after a brief delay to ensure content is rendered
    setTimeout(processLatex, 50);
  }, [content]);

  return (
    <div className="space-y-6">
      {/* Title */}
      {title && (
        <h1 className="text-5xl font-bold text-gray-900 font-['Poppins'] leading-tight">
          {title}
        </h1>
      )}

      {/* Metadata Tags */}
      {(examBoard || subject || topic) && (
        <div className="flex flex-wrap gap-2">
          {examBoard && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {examBoard.name}
            </span>
          )}
          {subject && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {subject.name}
            </span>
          )}
          {topic && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              {topic.name}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="border-t border-gray-200 pt-6">
        {content ? (
          <div
            ref={contentRef}
            className="prose prose-lg max-w-none"
            style={{
              fontFamily: '"Georgia", serif',
              lineHeight: '1.8',
            }}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Start writing to see preview...</p>
          </div>
        )}
      </div>
    </div>
  );
}
