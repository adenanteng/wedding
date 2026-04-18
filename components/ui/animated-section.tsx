"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    className?: string
    delay?: number
}

export function AnimatedSection({ 
    children, 
    className, 
    delay = 0,
    ...props
}: AnimatedSectionProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={isMounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
