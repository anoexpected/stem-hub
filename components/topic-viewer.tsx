"use client"

import { useState, useMemo, memo } from "react"
import dynamic from "next/dynamic"
import { AnimatedButton } from "@/components/ui/animated-button"
import { QuickQuizModal } from "@/components/quick-quiz-modal"
import { AnimatedElement } from "@/components/ui/animated-element"
import { motion } from "framer-motion"

// Dynamically import ReactMarkdown with its plugins to reduce initial bundle size
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false })
const remarkMath = dynamic(() => import("remark-math"), { ssr: false })
const rehypeKatex = dynamic(() => import("rehype-katex"), { ssr: false })

// Import KaTeX CSS only when needed
const KatexCSS = () => <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />

type TopicViewerProps = {
  content: string
}

// Memoized TableOfContents component
const TableOfContents = memo(({ content }: { content: string }) => {
  // Extract headings from markdown content
  const headings = useMemo(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const result: { level: number; text: string; slug: string }[] = []

    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      result.push({
        level,
        text,
        slug: slugify(text),
      })
    }

    return result
  }, [content])

  return (
    <nav className="space-y-1">
      {headings.map((heading, index) => (
        <motion.a
          key={index}
          href={`#${heading.slug}`}
          className={`block py-1 text-sm hover:text-primary transition-colors ${
            heading.level === 1
              ? "font-medium text-foreground"
              : heading.level === 2
                ? "pl-4 text-muted-foreground"
                : "pl-8 text-muted-foreground"
          }`}
          whileHover={{ x: 4, transition: { duration: 0.2 } }}
        >
          {heading.text}
        </motion.a>
      ))}
    </nav>
  )
})

TableOfContents.displayName = "TableOfContents"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
}

export default function TopicViewer({ content }: TopicViewerProps) {
  const [showQuiz, setShowQuiz] = useState(false)

  // Split content into chunks if it's very large
  const contentChunks = useMemo(() => {
    if (content.length > 10000) {
      // Split at major section breaks to avoid breaking formulas
      return content.split(/(?=# )/g)
    }
    return [content]
  }, [content])

  return (
    <>
      <KatexCSS />

      <div className="hidden lg:block sticky top-20 self-start h-[calc(100vh-120px)] overflow-y-auto pr-4 border-r border-border/40">
        <AnimatedElement animation="fade-in">
          <h3 className="font-medium mb-4 text-secondary">On this page</h3>
          <TableOfContents content={content} />
        </AnimatedElement>
      </div>

      <div className="prose prose-invert max-w-none">
        {contentChunks.map((chunk, index) => (
          <AnimatedElement key={index} animation="fade-up" delay={0.1 * index}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 id={slugify(props.children as string)} className="text-secondary" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    id={slugify(props.children as string)}
                    className="border-b border-border/40 text-primary"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3 id={slugify(props.children as string)} className="text-tertiary" {...props} />
                ),
                img: ({ node, ...props }) => (
                  <div className="my-4">
                    <motion.img
                      {...props}
                      className="rounded-lg max-w-full h-auto border border-border/40"
                      alt={props.alt || "Topic image"}
                      loading="lazy" // Add lazy loading for images
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  return (
                    <code className={`${className} font-code bg-card p-1 rounded text-primary`} {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ node, children, ...props }) => {
                  return (
                    <pre className="bg-card border border-border/40 rounded-lg p-4 overflow-x-auto" {...props}>
                      {children}
                    </pre>
                  )
                },
              }}
            >
              {chunk}
            </ReactMarkdown>
          </AnimatedElement>
        ))}

        <AnimatedElement animation="fade-up" delay={0.3}>
          <div className="mt-8 pt-4 border-t border-border/40 flex justify-center">
            <AnimatedButton onClick={() => setShowQuiz(true)} variant="tertiary">
              Take Quick Quiz
            </AnimatedButton>
          </div>
        </AnimatedElement>
      </div>

      {showQuiz && <QuickQuizModal open={showQuiz} onOpenChange={setShowQuiz} topicId={1} />}
    </>
  )
}
