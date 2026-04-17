"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FloatingElementProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    duration?: number
    yOffset?: number
    delay?: number
}

export function FloatingElement({ 
    children, 
    className, 
    duration = 3,
    yOffset = 15,
    delay = 0,
    ...props
}: FloatingElementProps) {
    return (
        <motion.div
            animate={{ y: [0, -yOffset, 0] }}
            transition={{ 
                duration, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay
            }}
            className={cn("relative", className)}
            {...props}
        >
            {children}
        </motion.div>
    )
}
