"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"

type Quiz = {
  id: number
  topic_id: number
  question: string
  options: string[]
  correct_answer: number
}

type QuickQuizModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  topicId: number
}

export function QuickQuizModal({ open, onOpenChange, topicId }: QuickQuizModalProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchQuizzes = useCallback(async () => {
    if (!open) return

    setLoading(true)

    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase.from("quizzes").select("*").eq("topic_id", topicId).limit(5)

      if (error) throw error

      // If we have quizzes, use them; otherwise use fallback
      if (data && data.length > 0) {
        // Randomize the order
        setQuizzes(data.sort(() => 0.5 - Math.random()))
      } else {
        // Fallback to a single quiz question if none found
        setQuizzes([
          {
            id: 1,
            topic_id: topicId,
            question:
              "Which equation correctly relates displacement (s), initial velocity (u), time (t), and acceleration (a)?",
            options: ["s = ut + at²", "s = ut + ½at²", "s = ut - ½at²", "s = u + at²"],
            correct_answer: 1,
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error)
      // Fallback to a single quiz question
      setQuizzes([
        {
          id: 1,
          topic_id: topicId,
          question:
            "Which equation correctly relates displacement (s), initial velocity (u), time (t), and acceleration (a)?",
          options: ["s = ut + at²", "s = ut + ½at²", "s = ut - ½at²", "s = u + at²"],
          correct_answer: 1,
        },
      ])
    } finally {
      setCurrentQuizIndex(0)
      setSelectedOption(null)
      setIsAnswered(false)
      setScore(0)
      setLoading(false)
    }
  }, [open, topicId])

  useEffect(() => {
    fetchQuizzes()

    // Clean up function
    return () => {
      setQuizzes([])
      setSelectedOption(null)
    }
  }, [fetchQuizzes])

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return
      setSelectedOption(optionIndex)
    },
    [isAnswered],
  )

  const handleCheckAnswer = useCallback(() => {
    if (selectedOption === null || quizzes.length === 0) return

    setIsAnswered(true)
    if (selectedOption === quizzes[currentQuizIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1)
    }
  }, [selectedOption, quizzes, currentQuizIndex])

  const handleNextQuestion = useCallback(() => {
    setCurrentQuizIndex((prevIndex) => prevIndex + 1)
    setSelectedOption(null)
    setIsAnswered(false)
  }, [])

  const handleFinish = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleRestart = useCallback(() => {
    setCurrentQuizIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
  }, [])

  // Early return if no quizzes or loading
  if (loading || quizzes.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-secondary">Quick Quiz</DialogTitle>
            <DialogDescription className="text-foreground/80">Loading questions...</DialogDescription>
          </DialogHeader>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const currentQuiz = quizzes[currentQuizIndex]
  const isLastQuiz = currentQuizIndex === quizzes.length - 1

  if (!currentQuiz) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/40">
        <DialogHeader>
          <DialogTitle className="text-secondary">Quick Quiz</DialogTitle>
          <DialogDescription className="text-foreground/80">
            Test your knowledge with these quick questions.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuizIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              Question {currentQuizIndex + 1} of {quizzes.length}
            </div>

            <div className="font-medium text-lg">{currentQuiz.question}</div>

            <RadioGroup value={selectedOption?.toString()} className="space-y-3">
              {currentQuiz.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div
                    className={`flex items-center space-x-2 rounded-md border border-border/40 p-3 cursor-pointer transition-all duration-300 ${
                      isAnswered && index === currentQuiz.correct_answer
                        ? "border-secondary bg-secondary/10"
                        : isAnswered && index === selectedOption && index !== currentQuiz.correct_answer
                          ? "border-destructive bg-destructive/10"
                          : "hover:border-primary/40 hover:bg-primary/5"
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      disabled={isAnswered}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </Label>
                    {isAnswered && index === currentQuiz.correct_answer && (
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    )}
                    {isAnswered && index === selectedOption && index !== currentQuiz.correct_answer && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isAnswered ? (
            isLastQuiz ? (
              <div className="w-full flex flex-col gap-4">
                <motion.div
                  className="text-center py-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-lg font-medium text-secondary">Quiz Complete!</div>
                  <div className="text-foreground/80">
                    Your score: <span className="text-primary font-bold">{score}</span> out of {quizzes.length}
                  </div>
                </motion.div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleRestart}
                    className="border-border/40 hover:text-primary hover:border-primary/40"
                  >
                    Restart Quiz
                  </Button>
                  <AnimatedButton onClick={handleFinish} variant="tertiary">
                    Finish
                  </AnimatedButton>
                </div>
              </div>
            ) : (
              <AnimatedButton onClick={handleNextQuestion} className="w-full sm:w-auto" variant="primary">
                Next Question
              </AnimatedButton>
            )
          ) : (
            <AnimatedButton
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="w-full sm:w-auto"
              variant="primary"
            >
              Check Answer
            </AnimatedButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
