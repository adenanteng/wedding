"use client"

import { motion, Variants } from "framer-motion"
import { ElementType, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface EndlessBouncingTextProps extends HTMLAttributes<HTMLElement> {
  text: string
  className?: string
  as?: ElementType
  delay?: number
}

export function EndlessBouncingText({
  text,
  className,
  as: Component = "p",
  delay = 0,
  ...props
}: EndlessBouncingTextProps) {
  // Support multiline strings using \n
  const lines = text.split("\n")

  const charVariants = (i: number): Variants => ({
    animate: {
      scale: [1, 1.3, 1],
      transition: {
        repeat: Infinity,
        duration: 3,
        times: [0, 0.15, 0.3, 1],
        ease: "easeInOut" as const,
        delay: delay + i * 0.1,
      },
    },
  })

  let globalCharIndex = 0;

  return (
    <Component className={cn("inline-block", className)}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ")
        
        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block">
                {word.split("").map((char) => {
                  const currentIndex = globalCharIndex++;
                  return (
                    <motion.span
                      key={currentIndex}
                      variants={charVariants(currentIndex)}
                      animate="animate"
                      className="inline-block origin-center"
                    >
                      {char}
                    </motion.span>
                  );
                })}
                {/* Add space between words */}
                {wordIndex < words.length - 1 && (
                  <span className="inline-block">&nbsp;</span>
                )}
              </span>
            ))}
          </span>
        )
      })}
    </Component>
  )
}
