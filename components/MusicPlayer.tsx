"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useMusic } from "@/context/MusicContext"

interface MusicPlayerProps {
  isOpened: boolean
}

export default function MusicPlayer({ isOpened }: MusicPlayerProps) {
  const { isPlaying, setIsPlaying, isForcePaused } = useMusic()
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("00:00")
  const [duration, setDuration] = useState("00:00")
  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle autoplay when invitation is opened
  useEffect(() => {
    if (isOpened && audioRef.current && !isForcePaused) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.warn("Autoplay was prevented by browser:", err)
      })
    }
  }, [isOpened, isForcePaused, setIsPlaying])

  // Handle force pause from video with fade
  useEffect(() => {
    if (audioRef.current) {
      if (isForcePaused) {
        // Fade out
        let vol = audioRef.current.volume
        const interval = setInterval(() => {
          if (vol > 0.05) {
            vol -= 0.05
            if (audioRef.current) audioRef.current.volume = vol
          } else {
            if (audioRef.current) {
              audioRef.current.volume = 0
              audioRef.current.pause()
            }
            clearInterval(interval)
          }
        }, 150)
        return () => clearInterval(interval)
      } else if (isPlaying) {
        // Fade in
        audioRef.current.volume = 0
        audioRef.current.play().catch(err => console.warn(err))
        let vol = 0
        const interval = setInterval(() => {
          if (vol < 0.95) {
            vol += 0.05
            if (audioRef.current) audioRef.current.volume = vol
          } else {
            if (audioRef.current) audioRef.current.volume = 1
            clearInterval(interval)
          }
        }, 150)
        return () => clearInterval(interval)
      }
    }
  }, [isForcePaused, isPlaying])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration
      if (!isNaN(total)) {
        setProgress((current / total) * 100)
        setCurrentTime(formatTime(current))
        setDuration(formatTime(total))
      }
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      audioRef.current.currentTime = percentage * audioRef.current.duration
    }
  }

  return (
    <div className="mt-8 w-full max-w-[280px] px-4">
      <audio
        ref={audioRef}
        src="/audio/background.mp3"
        loop
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />
      
      <div className="overflow-hidden rounded-3xl bg-gray-900 shadow-lg">
        {/* Album Art / Couple Photo */}
        <div className="relative flex items-center gap-3 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-900">
            <Image
              src="/img/kid-square-rahma.jpeg"
              alt="Couple photo"
              width={64}
              height={64}
              className={`h-full w-full object-cover ${isPlaying ? "animate-spin-slow" : ""}`}
            />
            {/* Spinning disk overlay if desired, but image transition is nice */}
          </div>
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <div className="relative w-full overflow-hidden whitespace-nowrap mask-image-linear">
              <p 
                className={`font-medium text-white mb-1 inline-block ${isPlaying ? "animate-marquee" : ""}`} 
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {isPlaying ? "Sedang Memutar: Barasuara - Terbuang Dalam Waktu" : "Musik Dihentikan"}
              </p>
            </div>
            {/* Progress bar */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-400 tabular-nums" style={{ fontFamily: "var(--font-sans)" }}>{currentTime}</span>
              <div 
                className="relative h-1 flex-1 cursor-pointer rounded-full bg-[#333]"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full rounded-full bg-[#9e0e00] transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg" 
                  style={{ left: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 tabular-nums" style={{ fontFamily: "var(--font-sans)" }}>{duration}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 px-4 pb-4 pt-1">
          {/* Previous (Disabled for single song) */}
          <button className="text-gray-600 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Play / Pause */}
          <button 
            onClick={togglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next (Disabled for single song) */}
          <button className="text-gray-600 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
