"use client"

import { motion, Variants } from "framer-motion"
import { ElementType, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps extends HTMLAttributes<HTMLElement> {
  text: string
  className?: string
  as?: ElementType
  once?: boolean
  delay?: number
}

export function AnimatedText({
  text,
  className,
  as: Component = "p",
  once = false,
  delay = 0,
  ...props
}: AnimatedTextProps) {
  // Split text into words to handle word wrap properly
  const words = text.split(" ")

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.015, delayChildren: delay },
    },
  }

  const charVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 250,
      },
    },
  }

  return (
    <Component className={cn("overflow-hidden", className)} {...props}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        className="inline-block"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block">
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={charVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {/* Add space after each word except the last one */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Component>
  )
}
