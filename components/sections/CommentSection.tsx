"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { IconLoader2, IconMessageCircle, IconSend } from "@tabler/icons-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"
import { AnimatedSection } from "@/components/ui/animated-section"
import { FloatingElement } from "@/components/ui/floating-element"
import { MessageCircle } from "lucide-react"

export default function CommentSection() {
  const params = useParams()
  const guestId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<any[]>([])
  const [guestRealId, setGuestRealId] = useState<string | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      // Fetch guest data
      if (guestId) {
        const { data: rsvpData } = await supabase
          .from("rsvps")
          .select("id")
          .eq("short_id", guestId)
          .single()

        if (rsvpData) {
          setGuestRealId(rsvpData.id)
        }
      }

      // Fetch initial comments
      const { data: commentsData } = await supabase
        .from("comments")
        .select("id, message, created_at, sender_id, rsvps(name)")
        .order("created_at", { ascending: false })

      if (commentsData) {
        setComments(commentsData)
      }
      setIsLoading(false)
    }

    init()

    // Realtime subscription
    const channel = supabase
      .channel("comments_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        async (payload) => {
          // Fetch the joined data for the new comment
          const { data: newComment } = await supabase
            .from("comments")
            .select("id, message, created_at, sender_id, rsvps(name)")
            .eq("id", payload.new.id)
            .single()

          if (newComment) {
            setComments((prev) => {
              // Avoid duplicates
              if (prev.some(c => c.id === newComment.id)) return prev
              return [newComment, ...prev]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [guestId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !guestRealId) return

    setIsSubmitting(true)
    try {
      // Insert comment and select the newly created joined object
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{ sender_id: guestRealId, message: message.trim() }])
        .select("id, message, created_at, sender_id, rsvps(name)")
        .single()

      if (error) throw error

      if (newComment) {
        setComments((prev) => [newComment, ...prev])
      }
      
      setMessage("")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to submit comment:", error)
      alert("Gagal mengirim pesan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format date helper (Relative Time in Indonesian)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Baru saja"
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks} minggu yang lalu`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`
    
    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} tahun yang lalu`
  }

  return (
    <div className="flex w-full flex-col items-center px-2 pt-10 pb-5 bg-[#f5f0ea] shadow-lg rounded-3xl border-2 border-primary">
      {/* Heading */}
      <AnimatedSection delay={0.1}>
        <h2
          className="text-center text-4xl leading-tight tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Buku Tamu
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <span 
          className="text-primary/60 text-xs" 
          style={{fontFamily: "var(--font-heading)"}}
        >
          {comments.length} Komentar
        </span>
      </AnimatedSection>
      
      <AnimatedSection className="relative w-full" delay={0.3}>
        <FloatingElement className="absolute -top-20 left-10 -rotate-20" yOffset={6} duration={4}>
          <Image
            src="/img/ring.png"
            alt="ornament"
            width={30}
            height={30}
            className="h-auto w-[30px] object-contain"
          />
        </FloatingElement>
        <FloatingElement className="absolute bottom-0 right-10 rotate-20" yOffset={4} duration={3} delay={0.5}>
          <Image
            src="/img/sparkles.png"
            alt="ornament"
            width={20}
            height={20}
            className="h-auto w-[20px] object-contain"
          />
        </FloatingElement>
      </AnimatedSection>

      {/* Comments List */}
      <AnimatedSection className="mt-5 w-full max-w-sm" delay={0.4}>
        {isLoading ? (
          <div className="flex justify-center py-8 text-primary">
            <IconLoader2 className="animate-spin" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-primary/20 p-8 text-center text-primary/60">
            <p className="text-sm font-medium">Belum ada pesan.</p>
            <p className="mt-1 text-xs">Jadilah yang pertama mengirim doa!</p>
          </div>
        ) : (
          <div className="flex max-h-[450px] flex-col gap-4 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40">
            {comments.slice(0, visibleCount).map((comment) => (
              <div
                key={comment.id}
                className="relative flex flex-col rounded-xl border-2 border-dashed border-primary/30 bg-white p-5 shadow-lg"
              >
                {/* Decorative Pin/Dot */}
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary/30" />
                
                <h3
                  className="text-lg font-bold text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {comment.rsvps?.name || "Tamu Undangan"}
                </h3>
                <p 
                  className="mt-1 text-xs"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {formatDate(comment.created_at)}
                </p>
                
                <div className="my-3 w-full border-t border-dashed border-primary/50" />
                
                <p 
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {comment.message}
                </p>
              </div>
            ))}

            {visibleCount < comments.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="mx-auto mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-primary/40 px-6 py-2 text-[10px] font-bold tracking-wider text-primary/60 transition-all hover:border-primary hover:text-primary active:opacity-70"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Lihat Selebihnya
              </button>
            )}
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay={0.5}>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <button
              className="mt-5 flex items-center justify-center rounded-lg border-2 border-primary bg-primary px-6 py-3 text-sm font-bold tracking-wider text-white transition-all active:opacity-70 disabled:opacity-50"
              style={{ fontFamily: "var(--font-heading)" }}
              disabled={!guestRealId || isLoading}
            >
              <IconMessageCircle className="mr-2" size={20} />
              Tinggalkan Pesan
            </button>
          </DrawerTrigger>
          <DrawerContent className="bg-transparent border-none before:border-2 before:border-primary">
            <div className="mx-auto w-full max-w-sm px-6 pb-6">
              <DrawerHeader className="px-0">
                <DrawerTitle className="text-2xl text-primary flex justify-center items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <MessageCircle className="size-6" />
                  Kirim Pesan
                </DrawerTitle>
                <DrawerDescription className="text-center" style={{ fontFamily: "var(--font-heading)" }}>
                  
                </DrawerDescription>
              </DrawerHeader>

              <form onSubmit={handleSubmit} className="px-0">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan atau harapan baik Anda..."
                className="min-h-[120px] w-full resize-none rounded-xl border-2 border-dashed border-primary p-4 text-sm focus:border-primary focus:outline-none"
                style={{ fontFamily: "var(--font-heading)" }}
                disabled={isSubmitting}
                autoFocus
              />

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="flex w-full items-center justify-center rounded-full border-2 border-primary bg-primary py-3 text-sm font-bold tracking-wider text-white transition-all active:opacity-70 disabled:opacity-50"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {isSubmitting ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    <>
                      <IconSend className="mr-2" size={18} />
                      Kirim Pesan
                    </>
                  )}
                </button>
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-full border-2 border-primary bg-transparent py-3 text-sm font-bold tracking-wider text-primary transition-all active:opacity-70"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Batal
                  </button>
                </DrawerClose>
              </div>
            </form>
            </div>
          </DrawerContent>
        </Drawer>
      </AnimatedSection>
    </div>
  )
}
