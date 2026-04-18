"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
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
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <motion.div
            animate={isMounted ? { y: [0, -yOffset, 0] } : { y: 0 }}
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
