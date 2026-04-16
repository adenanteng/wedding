"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import MusicPlayer from "@/components/MusicPlayer"
import SplashSection from "@/components/sections/SplashSection"
import HeroSection from "@/components/sections/HeroSection"
import BrideGroomSection from "@/components/sections/BrideGroomSection"
import EventSection from "@/components/sections/EventSection"
import TimelineSection from "@/components/sections/TimelineSection"
import RsvpSection from "@/components/sections/RsvpSection"
import GiftSection from "@/components/sections/GiftSection"
import CommentSection from "@/components/sections/CommentSection"
import ClosingSection from "@/components/sections/ClosingSection"

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [guestName, setGuestName] = useState("Nama tamu")
  const params = useParams()
  const guestId = params?.id as string

  // Fetch guest name from Supabase
  useEffect(() => {
    const fetchGuest = async () => {
      if (!guestId) return

      const { data, error } = await supabase
        .from("rsvps")
        .select("name")
        .eq("short_id", guestId)
        .single()

      if (data && !error) {
        setGuestName(data.name)
      }
    }
    
    fetchGuest()
  }, [guestId])

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
        guestName={guestName}
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
          Klik tombol play untuk mendengarkan lagu kami..
        </p>

        <BrideGroomSection />
        <EventSection />
        <TimelineSection />
        <RsvpSection />
        <GiftSection />
        <div className="bg-white px-6 py-10 w-full">
          <CommentSection />
        </div>
        <ClosingSection />
      </div>
    </>
  )
}
