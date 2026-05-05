"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconPlayerPlay, IconX } from "@tabler/icons-react"
import { useMusic } from "@/context/MusicContext"
import { Backlight } from "@/components/ui/backlight"

interface CommentVideoPlayerProps {
  src: string
}

export const CommentVideoPlayer = ({ src }: CommentVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isPlaying: isMusicPlaying, setIsPlaying: setIsMusicPlaying, setIsForcePaused } = useMusic()
  const [wasMusicPlaying, setWasMusicPlaying] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9)

  const toggleModal = () => {
    if (!isModalOpen) {
      setWasMusicPlaying(isMusicPlaying)
      setIsMusicPlaying(false)
      setIsForcePaused(true)
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
      setIsPlaying(false)
      setIsForcePaused(false)
      if (wasMusicPlaying) setIsMusicPlaying(true)
    }
  }

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current
      setAspectRatio(videoWidth / videoHeight)
    }
  }

  // Handle back button to close modal and lock scroll
  useEffect(() => {
    if (isModalOpen) {
      // Lock scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      window.history.pushState({ modalOpen: true }, "")

      const handlePopState = () => {
        // Close modal and resume music
        setIsModalOpen(false)
        setIsPlaying(false)
        setIsForcePaused(false)
        if (wasMusicPlaying) setIsMusicPlaying(true)
      }

      window.addEventListener("popstate", handlePopState)
      
      return () => {
        // Unlock scroll
        document.body.style.overflow = originalStyle;
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [isModalOpen, wasMusicPlaying, setIsMusicPlaying, setIsForcePaused])

  // Auto play when modal opens
  useEffect(() => {
    if (isModalOpen && videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        setIsPlaying(false)
      })
    }
  }, [isModalOpen])

  return (
    <>
      {/* Thumbnail in Feed */}
      <div 
        className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary/20 shadow-inner group cursor-pointer" 
        onClick={toggleModal}
      >
        <video
          src={src}
          className="w-full h-full object-cover opacity-80"
          preload="metadata"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110">
            <IconPlayerPlay size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Popup Video Player */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={toggleModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-[90vw] md:max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Backlight blur={40} className="w-full">
                <div 
                  className="relative w-full overflow-hidden rounded-2xl border-[3px] border-black bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  style={{ aspectRatio: aspectRatio }}
                  onClick={togglePlay}
                >
                  <video
                    ref={videoRef}
                    src={src}
                    className="w-full h-full object-contain"
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                  />

                  {/* Close Button - Now Inside */}
                  <button
                    onClick={toggleModal}
                    className="absolute top-2 right-2 z-20 px-3 py-1.5 bg-white text-primary rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 font-bold text-xs"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Tutup <IconX size={16} />
                  </button>

                  {/* Controls Overlay */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                          <IconPlayerPlay size={32} fill="currentColor" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Backlight>

              {/* Decorative Text */}
              <p 
                className="mt-6 text-center text-white/80 text-sm italic"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Klik video untuk memutar / pause
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
