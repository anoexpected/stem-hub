"use client"

import { useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, FileText, Beaker } from "lucide-react"
import { AnimatedElement } from "@/components/ui/animated-element"
import { motion } from "framer-motion"

type Topic = {
  id: number
  title: string
  content_md: string
}

type Chapter = {
  id: number
  title: string
  type: "theory" | "practical"
  order: number
  topics: Topic[]
}

type SubjectChaptersProps = {
  chapters: Chapter[]
}

export default function SubjectChapters({ chapters }: SubjectChaptersProps) {
  const [activeTab, setActiveTab] = useState("all")

  const theoryChapters = chapters.filter((chapter) => chapter.type === "theory")
  const practicalChapters = chapters.filter((chapter) => chapter.type === "practical")

  const displayChapters = activeTab === "all" ? chapters : activeTab === "theory" ? theoryChapters : practicalChapters

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-secondary">Chapters</h2>
          <TabsList className="bg-card border border-border/40">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="theory"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Theory
            </TabsTrigger>
            <TabsTrigger
              value="practical"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Practical
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-6">
          <Accordion type="multiple" className="space-y-4">
            {displayChapters.map((chapter, index) => (
              <AnimatedElement key={chapter.id} animation="fade-up" delay={0.05 * index}>
                <AccordionItem
                  value={`chapter-${chapter.id}`}
                  className="border rounded-lg px-6 bg-card border-border/40 overflow-hidden"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {chapter.type === "theory" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <Beaker className="h-5 w-5 text-secondary" />
                      )}
                      <div>
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.topics.length} {chapter.topics.length === 1 ? "topic" : "topics"}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-8">
                      {chapter.topics.map((topic, topicIndex) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * topicIndex }}
                        >
                          <Link
                            href={`/topics/${topic.id}`}
                            className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 transition-colors"
                          >
                            <div className="flex-1 text-foreground hover:text-primary transition-colors">
                              {topic.title}
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AnimatedElement>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="theory" className="mt-6">
          <Accordion type="multiple" className="space-y-4">
            {theoryChapters.map((chapter, index) => (
              <AnimatedElement key={chapter.id} animation="fade-up" delay={0.05 * index}>
                <AccordionItem
                  value={`chapter-${chapter.id}`}
                  className="border rounded-lg px-6 bg-card border-border/40 overflow-hidden"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.topics.length} {chapter.topics.length === 1 ? "topic" : "topics"}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-8">
                      {chapter.topics.map((topic, topicIndex) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * topicIndex }}
                        >
                          <Link
                            href={`/topics/${topic.id}`}
                            className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 transition-colors"
                          >
                            <div className="flex-1 text-foreground hover:text-primary transition-colors">
                              {topic.title}
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AnimatedElement>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="practical" className="mt-6">
          <Accordion type="multiple" className="space-y-4">
            {practicalChapters.map((chapter, index) => (
              <AnimatedElement key={chapter.id} animation="fade-up" delay={0.05 * index}>
                <AccordionItem
                  value={`chapter-${chapter.id}`}
                  className="border rounded-lg px-6 bg-card border-border/40 overflow-hidden"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Beaker className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="font-medium">{chapter.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.topics.length} {chapter.topics.length === 1 ? "topic" : "topics"}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-2 pl-8">
                      {chapter.topics.map((topic, topicIndex) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 * topicIndex }}
                        >
                          <Link
                            href={`/topics/${topic.id}`}
                            className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 transition-colors"
                          >
                            <div className="flex-1 text-foreground hover:text-primary transition-colors">
                              {topic.title}
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AnimatedElement>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
