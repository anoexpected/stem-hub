"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"
import { AnimatedElement } from "@/components/ui/animated-element"
import { motion, AnimatePresence } from "framer-motion"

type Testimonial = {
  id: number
  subject_id: number
  quote: string
  author: string
  subject_name?: string
}

// Memoize the testimonial card to prevent unnecessary re-renders
const TestimonialCard = memo(({ testimonial, color }: { testimonial: Testimonial; color: string }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    <Card className={`w-full max-w-3xl mx-auto border-l-4 ${color} bg-card border-border/40 shadow-lg`}>
      <CardContent className="pt-6">
        <div className="flex justify-center mb-4">
          <Quote className="h-10 w-10 text-primary opacity-50" />
        </div>
        <blockquote className="text-center text-xl italic">"{testimonial.quote}"</blockquote>
      </CardContent>
      <CardFooter className="flex flex-col items-center pb-6">
        <p className="font-semibold">{testimonial.author}</p>
        <p className="text-sm text-secondary">{testimonial.subject_name}</p>
      </CardFooter>
    </Card>
  </motion.div>
))

TestimonialCard.displayName = "TestimonialCard"

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Use useCallback to prevent recreation of functions on each render
  const fetchTestimonials = useCallback(async () => {
    try {
      const supabase = createSupabaseClient()

      // Limit the number of testimonials to reduce memory usage
      const { data, error } = await supabase
        .from("testimonials")
        .select(`
          id,
          subject_id,
          quote,
          author,
          subjects(name)
        `)
        .limit(5)

      if (error) throw error

      const formattedData = data.map((item) => ({
        id: item.id,
        subject_id: item.subject_id,
        quote: item.quote,
        author: item.author,
        subject_name: item.subjects?.name,
      }))

      setTestimonials(formattedData)
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      // Fallback to minimal mock data if fetch fails
      setTestimonials([
        {
          id: 1,
          subject_id: 1,
          quote: "STEM Hub helped me achieve an A* in my Physics A-Level.",
          author: "Sarah J.",
          subject_name: "Physics",
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTestimonials()

    // Clean up function to prevent memory leaks
    return () => {
      setTestimonials([])
    }
  }, [fetchTestimonials])

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }, [testimonials.length])

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Color mapping for subjects
  const getSubjectColor = useCallback((subjectName?: string) => {
    const colorMap: Record<string, string> = {
      Physics: "border-primary",
      Chemistry: "border-secondary",
      Biology: "border-tertiary",
      Mathematics: "border-primary",
      "Computer Science": "border-secondary",
    }

    return colorMap[subjectName || ""] || "border-primary"
  }, [])

  if (loading) {
    return (
      <section className="container px-4 md:px-6 py-8">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse w-full max-w-3xl h-40 bg-card rounded-lg"></div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="container px-4 md:px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />

      <AnimatedElement animation="fade-up" className="relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What our students say</h2>
        </div>
      </AnimatedElement>

      <AnimatedElement animation="fade-up" delay={0.2} className="relative z-10">
        <div className="relative">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentTestimonial.id}
              testimonial={currentTestimonial}
              color={getSubjectColor(currentTestimonial.subject_name)}
            />
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center mt-8 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            disabled={testimonials.length <= 1}
            className="border-border/40 hover:bg-card hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous testimonial</span>
          </Button>

          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-6" : "bg-muted"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            disabled={testimonials.length <= 1}
            className="border-border/40 hover:bg-card hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next testimonial</span>
          </Button>
        </div>
      </AnimatedElement>
    </section>
  )
}
