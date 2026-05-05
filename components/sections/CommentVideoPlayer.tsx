"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconPlayerPlay } from "@tabler/icons-react"
import { useMusic } from "@/context/MusicContext"

interface CommentVideoPlayerProps {
  src: string
}

export function CommentVideoPlayer({ src }: CommentVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isPlaying: isMusicPlaying, setIsPlaying: setIsMusicPlaying } = useMusic()
  const [wasMusicPlaying, setWasMusicPlaying] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      // Pause music
      setWasMusicPlaying(isMusicPlaying)
      setIsMusicPlaying(false)
      
      // Pause other videos
      document.querySelectorAll("video").forEach(v => {
        const videoElement = v as HTMLVideoElement
        if (videoElement !== videoRef.current) videoElement.pause()
      })

      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
      if (wasMusicPlaying) setIsMusicPlaying(true)
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/20 shadow-inner group cursor-pointer" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        onEnded={() => {
          setIsPlaying(false)
          if (wasMusicPlaying) setIsMusicPlaying(true)
        }}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Custom Play Button Overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IconPlayerPlay size={24} fill="currentColor" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
