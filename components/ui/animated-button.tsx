"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "tertiary"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  sdg4?: boolean
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, sdg4, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        <Button
          className={cn(
            variant === "tertiary" && "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90",
            sdg4 && "relative pl-7",
            className,
          )}
          variant={variant === "tertiary" ? "default" : variant}
          size={size}
          ref={ref}
          asChild={asChild}
          aria-label={
            sdg4
              ? `${props["aria-label"] || props.children?.toString() || "Button"} - Supporting UN SDG 4: Quality Education`
              : props["aria-label"]
          }
          data-sdg="4"
          {...props}
        >
          {sdg4 && (
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold rounded-full bg-blue-500 text-white w-4 h-4 flex items-center justify-center"
              title="UN SDG 4: Quality Education"
            >
              4
            </span>
          )}
          {props.children}
        </Button>
      </motion.div>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
