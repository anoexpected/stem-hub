"use client"

import Link from "next/link"
import { Github, Twitter, Facebook, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedElement } from "@/components/ui/animated-element"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <AnimatedElement animation="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary">STEM Hub</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ending STEM inequality—globally. Free resources for students everywhere.
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="animate-hover">
                  <Link href="https://twitter.com/stemhub" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="animate-hover">
                  <Link href="https://facebook.com/stemhub" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="animate-hover">
                  <Link href="https://instagram.com/stemhub" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="animate-hover">
                  <Link href="https://github.com/stemhub" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-secondary">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/subjects/caie" className="text-muted-foreground hover:text-primary transition-colors">
                    CAIE Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/subjects/zimsec" className="text-muted-foreground hover:text-primary transition-colors">
                    ZIMSEC Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/past-papers" className="text-muted-foreground hover:text-primary transition-colors">
                    Past Papers
                  </Link>
                </li>
                <li>
                  <Link href="/webinars" className="text-muted-foreground hover:text-primary transition-colors">
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-secondary">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contribute" className="text-muted-foreground hover:text-primary transition-colors">
                    Contribute
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.gg/stemhub"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-secondary">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-muted-foreground hover:text-primary transition-colors">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </AnimatedElement>

        <AnimatedElement animation="fade-up" delay={0.2}>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} STEM Hub. All rights reserved.</p>
          </div>
        </AnimatedElement>
      </div>
    </footer>
  )
}
