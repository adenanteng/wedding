"use client"

import { useState, useEffect } from "react"
import MusicPlayer from "@/components/MusicPlayer"
import SplashSection from "@/components/sections/SplashSection"
import HeroSection from "@/components/sections/HeroSection"
import BrideGroomSection from "@/components/sections/BrideGroomSection"
import EventSection from "@/components/sections/EventSection"
import TimelineSection from "@/components/sections/TimelineSection"
import GiftSection from "@/components/sections/GiftSection"
import ClosingSection from "@/components/sections/ClosingSection"

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll while splash/cover modal is visible
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <SplashSection
        isOpen={isOpen}
        onOpen={() => setIsOpen(true)}
      />

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative mx-auto flex min-h-svh max-w-md flex-col items-center overflow-x-hidden">
        <HeroSection />

        {/* ===== MUSIC PLAYER ===== */}
        <MusicPlayer isOpened={isOpen} />

        {/* ===== FOOTER TEXT ===== */}
        <p
          className="mt-6 mb-10 text-center text-xs"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Click play button to listen our song..
        </p>

        <BrideGroomSection />
        <EventSection />
        <TimelineSection />
        <GiftSection />
        <ClosingSection />
      </div>
    </>
  )
}
