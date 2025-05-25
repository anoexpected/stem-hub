"use client"

import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedElement } from "@/components/ui/animated-element"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function HeroBanner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])

  return (
    <section ref={ref} className="w-full py-12 md:py-24 lg:py-32 overflow-hidden relative">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background dark:from-primary/10" />
      </motion.div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div className="flex flex-col justify-center space-y-4" style={{ y: textY }}>
            <AnimatedElement animation="fade-up" delay={0.1}>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Join the world's largest <span className="text-primary">STEM</span> revision community
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Free notes & study tools for CAIE and ZIMSEC
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="fade-up" delay={0.3}>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <AnimatedButton variant="tertiary" size="lg">
                    Get started—free
                  </AnimatedButton>
                </Link>
                <Link href="/subjects">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="border-secondary text-secondary hover:text-secondary-foreground hover:bg-secondary"
                  >
                    Browse subjects
                  </AnimatedButton>
                </Link>
              </div>
            </AnimatedElement>
          </motion.div>

          <AnimatedElement animation="fade-in" delay={0.4} className="flex items-center justify-center">
            <motion.div
              className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
            >
              <Image
                src="/placeholder.jpg?height=500&width=500"
                alt="STEM graphic"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatedElement>
        </div>
      </div>
    </section>
  )
}
