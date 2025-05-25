"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedElement } from "@/components/ui/animated-element"
import { Badge } from "@/components/ui/badge"
import { Atom, BookOpen, Calculator, FlaskRoundIcon as Flask, Microscope } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

type Subject = {
  id: number
  name: string
  code: string
  board: string
  level: string
  description: string
}

type SubjectDirectoryProps = {
  subjects: Subject[]
}

export default function SubjectDirectory({ subjects }: SubjectDirectoryProps) {
  const [discipline, setDiscipline] = useState<string>("all")
  const [board, setBoard] = useState<string>("all")
  const [level, setLevel] = useState<string>("all")

  // Get unique values for filters
  const disciplines = Array.from(new Set(subjects.map((subject) => subject.name)))
  const boards = Array.from(new Set(subjects.map((subject) => subject.board)))
  const levels = Array.from(new Set(subjects.map((subject) => subject.level)))

  // Filter subjects based on selected filters
  const filteredSubjects = subjects.filter((subject) => {
    return (
      (discipline === "all" || subject.name === discipline) &&
      (board === "all" || subject.board === board) &&
      (level === "all" || subject.level === level)
    )
  })

  // Get icon for subject
  const getSubjectIcon = (name: string) => {
    switch (name) {
      case "Physics":
        return <Atom className="h-8 w-8 text-primary" />
      case "Chemistry":
        return <Flask className="h-8 w-8 text-secondary" />
      case "Biology":
        return <Microscope className="h-8 w-8 text-tertiary" />
      case "Mathematics":
        return <Calculator className="h-8 w-8 text-primary" />
      case "Computer Science":
        return <BookOpen className="h-8 w-8 text-secondary" />
      default:
        return <BookOpen className="h-8 w-8 text-primary" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Filters sidebar */}
      <AnimatedElement animation="fade-up" className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-secondary">Filters</h3>
          <p className="text-sm text-muted-foreground">Narrow down subjects by discipline, board, and level.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="discipline" className="text-sm font-medium">
              Discipline
            </label>
            <Select value={discipline} onValueChange={setDiscipline}>
              <SelectTrigger id="discipline" className="bg-card border-border/40">
                <SelectValue placeholder="Select discipline" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                <SelectItem value="all">All Disciplines</SelectItem>
                {disciplines.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="board" className="text-sm font-medium">
              Examination Board
            </label>
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger id="board" className="bg-card border-border/40">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                <SelectItem value="all">All Boards</SelectItem>
                {boards.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="level" className="text-sm font-medium">
              Level
            </label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level" className="bg-card border-border/40">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/40">
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </AnimatedElement>

      {/* Subject grid */}
      <div className="md:col-span-3">
        <AnimatedElement animation="fade-up" delay={0.1}>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSubjects.length} of {subjects.length} subjects
            </p>
          </div>
        </AnimatedElement>

        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, index) => (
              <AnimatedElement key={subject.id} animation="fade-up" delay={0.1 * ((index % 3) + 1)}>
                <Link href={`/subjects/${subject.board.toLowerCase()}/${subject.code}`}>
                  <motion.div
                    whileHover={{
                      y: -4,
                      boxShadow: "0 10px 25px -5px rgba(0, 130, 255, 0.1), 0 8px 10px -6px rgba(0, 130, 255, 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full bg-card border-border/40 hover:border-primary/60 transition-all duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          {getSubjectIcon(subject.name)}
                          <Badge
                            variant={subject.board === "CAIE" ? "default" : "secondary"}
                            className={
                              subject.board === "CAIE"
                                ? "bg-primary/80 hover:bg-primary"
                                : "bg-secondary/80 hover:bg-secondary"
                            }
                          >
                            {subject.board}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-secondary">{subject.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-sm font-medium text-primary">{subject.code}</div>
                          <div className="text-xs text-muted-foreground">{subject.level}</div>
                        </div>
                        <p className="text-sm text-foreground/80 line-clamp-2">{subject.description}</p>
                      </CardContent>
                      <CardFooter>
                        <AnimatedButton
                          variant="ghost"
                          size="sm"
                          className="w-full hover:text-primary hover:bg-primary/10"
                        >
                          View Subject
                        </AnimatedButton>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </Link>
              </AnimatedElement>
            ))}
          </div>
        ) : (
          <AnimatedElement animation="fade-up" delay={0.2}>
            <div className="flex flex-col items-center justify-center p-8 border border-border/40 rounded-lg bg-card/50">
              <p className="text-muted-foreground mb-4">No subjects match your filters.</p>
              <AnimatedButton
                onClick={() => {
                  setDiscipline("all")
                  setBoard("all")
                  setLevel("all")
                }}
              >
                Reset Filters
              </AnimatedButton>
            </div>
          </AnimatedElement>
        )}
      </div>
    </div>
  )
}
