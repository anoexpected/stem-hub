"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

type AnimatedElementProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  animation?: "fade-up" | "fade-in" | "scale" | "slide-left" | "slide-right" | "none"
  once?: boolean
}

export function AnimatedElement({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  animation = "fade-up",
  once = true,
}: AnimatedElementProps) {
  const { ref, inView } = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const getAnimationVariants = () => {
    switch (animation) {
      case "fade-up":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }
      case "fade-in":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }
      case "slide-left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }
      case "slide-right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }
      case "none":
        return {
          hidden: {},
          visible: {},
        }
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
