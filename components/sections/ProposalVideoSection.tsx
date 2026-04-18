import { AnimatedSection } from "@/components/ui/animated-section"
import { Backlight } from "@/components/ui/backlight"
import { FloatingElement } from "@/components/ui/floating-element"
import { useMusic } from "@/context/MusicContext"
import { IconMaximize, IconMinimize, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function ProposalVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setIsForcePaused } = useMusic()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Slow video volume fading (3-4 seconds)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.volume = 0
      let vol = 0
      const interval = setInterval(() => {
        if (vol < 0.98) {
          vol += 0.02
          video.volume = vol
        } else {
          video.volume = 1
          clearInterval(interval)
        }
      }, 80) // 80ms * 50 steps = 4 seconds
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
      setIsForcePaused(true)
      startControlsTimer(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
      setIsForcePaused(false)
      setShowControls(true)
    }
  }

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const startControlsTimer = (forceIsPlaying?: boolean) => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    setShowControls(true)

    const isCurrentlyPlaying = typeof forceIsPlaying === "boolean" ? forceIsPlaying : isPlaying
    if (isCurrentlyPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }
  }

  const handleContainerClick = () => {
    if (!isPlaying) {
      togglePlay()
    } else {
      startControlsTimer()
    }
  }

  return (
    <div className="relative flex w-full flex-col items-center px-6 py-10">
      <AnimatedSection className="w-full flex flex-col items-center" delay={0.1}>
        <h2
          className="text-3xl tracking-wide text-primary font-bold mb-10"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Our Journey
        </h2>

        <Backlight blur={40} className="w-full max-w-[400px]">
          <div
            ref={containerRef}
            className={`video-fullscreen-container relative w-full aspect-video group cursor-pointer ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
            onClick={handleContainerClick}
            onMouseMove={() => startControlsTimer()}
          >
            {/* Hand-drawn look container with shadow (only when NOT fullscreen) */}
            {!isFullscreen && (
              <div className="absolute inset-0 bg-white border-[2.5px] border-black shadow-[8px_8px_0px_0px_rgba(130,14,3,0.9)] rounded-xl rotate-[-1.5deg]"></div>
            )}

            <div className={`video-inner-wrapper relative z-10 w-full h-full p-2 ${!isFullscreen ? 'rotate-[-0.5deg]' : 'p-0'}`}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-xl"
                playsInline
                src="/video/lamaran.mp4"
                poster="/img/thumbnail.jpeg"
                onEnded={() => {
                  setIsPlaying(false)
                  setIsForcePaused(false)
                  setShowControls(true)
                }}
              />

              {/* Custom Controls Overlay */}
              <AnimatePresence>
                {showControls && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col justify-between bg-black/20 rounded-xl p-4"
                  >
                    {/* Center Play Button */}
                    <div className="flex flex-1 items-center justify-center mt-10">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {isPlaying ? <IconPlayerPause size={32} /> : <IconPlayerPlay size={32} className="ml-1" />}
                      </motion.button>
                    </div>

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-end">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleFullscreen}
                        className={`flex h-10 w-10 ${isFullscreen ? 'mr-5' : 'mr-1'} items-center justify-center border-2 border-black bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                      >
                        {isFullscreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Decorative Sparkle (only when NOT fullscreen) */}
            {!isFullscreen && (
              <FloatingElement className="absolute -top-6 -right-6 z-20" yOffset={4} duration={3}>
                <Image
                  src="/img/sparkles.png"
                  alt="ornament"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </FloatingElement>
            )}
          </div>
        </Backlight>

        {/* Bottom Ornament */}
        <FloatingElement className="mt-12 opacity-80" yOffset={5} duration={4}>
          <Image
            src="/img/2.png"
            alt="Hand-drawn ornament"
            width={120}
            height={40}
            className="object-contain rotate-180"
          />
        </FloatingElement>
      </AnimatedSection>
    </div>
  )
}
