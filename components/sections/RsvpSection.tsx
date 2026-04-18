"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { IconLoader2, IconHeart } from "@tabler/icons-react"
import { sendWhatsAppMessage } from "@/lib/actions/invite"
import { AnimatedSection } from "@/components/ui/animated-section"

export default function RsvpSection() {
  const params = useParams()
  const guestId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUserPresence, setCurrentUserPresence] = useState<boolean | null>(null)
  const [isChangingMind, setIsChangingMind] = useState(false)
  const [guestName, setGuestName] = useState("Tamu Undangan")

  // Fetch initial RSVP status
  useEffect(() => {
    const fetchRSVP = async () => {
      if (!guestId) {
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("rsvps")
        .select("name, presence")
        .eq("short_id", guestId)
        .single()

      if (!error && data) {
        setGuestName(data.name)
        setCurrentUserPresence(data.presence)
      }
      setIsLoading(false)
    }

    fetchRSVP()
  }, [guestId])

  const handleRSVP = async (presence: boolean) => {
    if (!guestId) return

    setIsSubmitting(true)
    try {
      // If same choice, just go to submitted view
      if (currentUserPresence !== null && currentUserPresence === presence) {
        setIsChangingMind(false)
        setIsSubmitting(false)
        return
      }

      const { data, error } = await supabase
        .from("rsvps")
        .update({ presence })
        .eq("short_id", guestId)
        .select("phone, source")
        .single()

      if (error) throw error

      if (data?.phone && data?.source) {
        const textMessage = presence
          ? `Dear ${guestName},\n\nKehadiran Anda adalah kehormatan, waktu yang Anda luangkan adalah kado terindah.`
          : `Dear ${guestName},\n\nGak apa-apa, we totally understand. Makasih ya udah sempetin ngabarin. Sending love from here! 🤍`

        try {
          const textResult = await sendWhatsAppMessage({
            source: data.source,
            number: data.phone,
            text: textMessage,
          })

          if (!textResult.success) {
            console.error("Failed to send text message:", textResult.error)
          }

          if (presence) {
            const locationResult = await sendWhatsAppMessage({
              source: data.source,
              number: data.phone,
              type: "location",
              locationData: {
                name: "Lokasi Acara",
                address: "Jl. Kencana Indah No.42, Margorejo, Metro Selatan, Kota Metro, Lampung.",
                latitude: -5.1484356219499166,
                longitude: 105.29310599848067,
                delay: 1200,
              },
            })

            if (!locationResult.success) {
              console.error("Failed to send location message:", locationResult.error)
            }
          }
        } catch (apiError) {
          console.error("Failed to trigger WhatsApp message action:", apiError)
        }
      }

      setCurrentUserPresence(presence)
      setIsChangingMind(false)
    } catch (error) {
      console.error("Failed to RSVP:", error)
      alert("Gagal mengirim RSVP. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const showSubmittedView = currentUserPresence !== null && !isChangingMind

  return (
    <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Heading */}
      <AnimatedSection delay={0.1}>
        <h2
          className="text-center text-4xl leading-tight tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Reservasi
        </h2>
      </AnimatedSection>

      <AnimatedSection className="mt-8 w-full max-w-sm rounded-xl border-2 border-primary border-dashed bg-[#fdfcf5] p-6 shadow-sm" delay={0.2}>
        {isLoading ? (
          <div className="flex justify-center py-8 text-primary">
            <IconLoader2 className="animate-spin" size={32} />
          </div>
        ) : showSubmittedView ? (
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-primary">
              <IconHeart size={40} className="text-primary" />
            </div>
            <h3
              className="mb-2 text-xl font-bold tracking-wide text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Terima Kasih, {guestName}!
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {currentUserPresence === false
                ? "Gak apa-apa, we totally understand. Makasih ya udah sempetin ngabarin. Sending love from here! 🤍"
                : "Senang sekali melihatmu menyempatkan hadir di tengah kesibukanmu. Terima kasih ya!"}
            </p>
            <div className="mt-8">
              <button
                onClick={() => setIsChangingMind(true)}
                className="w-full rounded-lg border-2 border-primary bg-transparent py-2.5 text-sm font-bold tracking-wider text-primary transition-all active:opacity-70"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Saya berubah pikiran
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p
              className="mb-2 font-bold text-lg text-primary tracking-wide"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {isChangingMind ? "Revisi Kehadiran" : "Apakah kamu akan hadir?"}
            </p>
            <p
              className="mb-8 text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {isChangingMind
                ? "Silakan perbarui status kehadiran Anda di bawah ini."
                : "Kami tidak sabar untuk merayakan momen bahagia ini bersama Anda."}
            </p>

            <div className="flex flex-col gap-4">
              <button
                disabled={isSubmitting}
                onClick={() => handleRSVP(true)}
                className="flex w-full justify-center rounded-lg border-2 border-primary bg-primary py-3 text-sm font-bold tracking-wider text-white transition-all active:opacity-70 disabled:opacity-50"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {isSubmitting ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  "Ya, saya akan hadir"
                )}
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleRSVP(false)}
                className="flex w-full justify-center rounded-lg border-2 border-primary text-primary bg-transparent py-3 text-sm font-bold tracking-wider transition-all active:opacity-70 disabled:opacity-50"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {isSubmitting ? (
                  <IconLoader2 className="animate-spin" />
                ) : (
                  "Saya tidak bisa hadir"
                )}
              </button>
            </div>

            {isChangingMind && (
              <button
                onClick={() => setIsChangingMind(false)}
                className="mt-6 text-xs underline underline-offset-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Batal mengubah
              </button>
            )}
          </div>
        )}
      </AnimatedSection>
    </div>
  )
}
