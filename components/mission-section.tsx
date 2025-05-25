"use client"

import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedElement } from "@/components/ui/animated-element"
import { motion } from "framer-motion"
import { Atom } from "lucide-react"

export default function MissionSection() {
  return (
    <section className="w-full py-16 bg-[#182937] dark:bg-[#182937] relative overflow-hidden">
      {/* Glowing elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tertiary/50 to-transparent" />

      {/* Radial glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <AnimatedElement animation="fade-up" delay={0.1}>
            <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="h-0.5 w-12 bg-tertiary mr-4" />
                <h2 className="text-3xl font-bold font-heading text-white">Our Mission</h2>
                <div className="h-0.5 w-12 bg-tertiary ml-4" />
              </div>

              <p className="text-white/90 text-lg leading-relaxed text-center lg:text-left">
                We're on a mission to ensure inclusive and equitable education, and to promote lifelong learning
                opportunities for all students who are passionate about understanding the world and solving real-world
                problems through Science, Technology, Engineering, and Mathematics (STEM).
              </p>

              <div className="flex justify-center lg:justify-start pt-4">
                <Link href="/about">
                  <AnimatedButton variant="outline" className="border-tertiary text-tertiary hover:bg-tertiary/10">
                    Learn More
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          </AnimatedElement>

          <AnimatedElement animation="fade-up" delay={0.3} className="flex justify-center">
            <div className="relative">
              {/* Glowing circle behind the atom */}
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Atom icon with orbiting electrons */}
              <motion.div
                className="relative z-10 p-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Atom className="h-40 w-40 text-white" />
              </motion.div>

              {/* Orbiting particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-tertiary"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0.7,
                  }}
                  animate={{
                    x: Math.cos(i * ((Math.PI * 2) / 3)) * 100,
                    y: Math.sin(i * ((Math.PI * 2) / 3)) * 100,
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                    delay: i * 1,
                  }}
                />
              ))}
            </div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
