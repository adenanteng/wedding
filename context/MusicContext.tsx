"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface MusicContextType {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  isForcePaused: boolean
  setIsForcePaused: (paused: boolean) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isForcePaused, setIsForcePaused] = useState(false)

  return (
    <MusicContext.Provider value={{ isPlaying, setIsPlaying, isForcePaused, setIsForcePaused }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider")
  }
  return context
}
