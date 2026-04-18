"use client"

import MusicPlayer from "@/components/MusicPlayer"
import BrideGroomSection from "@/components/sections/BrideGroomSection"
import ClosingSection from "@/components/sections/ClosingSection"
import CommentSection from "@/components/sections/CommentSection"
import EventSection from "@/components/sections/EventSection"
import GiftSection from "@/components/sections/GiftSection"
import HeroSection from "@/components/sections/HeroSection"
import RsvpSection from "@/components/sections/RsvpSection"
import SplashSection from "@/components/sections/SplashSection"
import TimelineSection from "@/components/sections/TimelineSection"
import ProposalVideoSection from "@/components/sections/ProposalVideoSection"
import { supabase } from "@/lib/supabaseClient"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [guestName, setGuestName] = useState("Tamu Undangan")
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
          Izinkan kami melantunkan tembang sakral...
        </p>

        <BrideGroomSection />
        <EventSection />
        <TimelineSection />
        <RsvpSection />
        <GiftSection />
        <ProposalVideoSection />
        <div className="bg-white px-6 py-10 w-full">
          <CommentSection />
        </div>
        <ClosingSection />
      </div>
    </>
  )
}
