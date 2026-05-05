"use client"

import { AnimatedSection } from "@/components/ui/animated-section"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { FloatingElement } from "@/components/ui/floating-element"
import { supabase } from "@/lib/supabaseClient"
import { IconLoader2, IconMessageCircle, IconSend, IconTrash } from "@tabler/icons-react"
import { MessageCircle, Type, Video } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import VideoRecorder from "./VideoRecorder"
import { CommentVideoPlayer } from "./CommentVideoPlayer"

export default function CommentSection() {
  const params = useParams()
  const guestId = params?.id as string

  interface Comment {
    id: string
    message: string
    created_at: string
    sender_id: string
    video_url?: string | null
    rsvps: {
      name: string
    } | null
  }

  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [guestRealId, setGuestRealId] = useState<string | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const [visibleCount, setVisibleCount] = useState(10)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [mode, setMode] = useState<"text" | "video">("text")
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Blur the trigger button immediately to prevent "aria-hidden" focus warnings
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }

      // Delay focus to allow drawer animation to complete before keyboard pops up
      const timer = setTimeout(() => {
        textareaRef.current?.focus()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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
        .select("id, message, created_at, sender_id, video_url, rsvps(name)")
        .order("created_at", { ascending: false })

      if (commentsData) {
        setComments(commentsData as unknown as Comment[])
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
            .select("id, message, created_at, sender_id, video_url, rsvps(name)")
            .eq("id", payload.new.id)
            .single()

          if (newComment) {
            setComments((prev) => {
              // Avoid duplicates
              if (prev.some(c => c.id === newComment.id)) return prev
              return [newComment as unknown as Comment, ...prev]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [guestId])

  const handleVideoUpload = (url: string) => {
    setVideoUrl(url)
    setMode("text") // Switch back to text to add message if they want
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !guestRealId) return

    setIsSubmitting(true)
    try {
      // Insert comment and select the newly created joined object
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{
          sender_id: guestRealId,
          message: message.trim(),
          video_url: videoUrl
        }])
        .select("id, message, created_at, sender_id, video_url, rsvps(name)")
        .single()

      if (error) throw error

      if (newComment) {
        setComments((prev) => [newComment as unknown as Comment, ...prev])

        // Scroll to top after a short delay to ensure DOM is updated
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        }, 100)
      }

      setMessage("")
      setVideoUrl(null)
      setMode("text")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to submit comment:", error)
      alert("Gagal mengirim pesan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (id: string, videoUrl?: string | null) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", id)

      if (error) throw error

      if (videoUrl) {
        try {
          const fileName = videoUrl.split("/").pop()
          if (fileName) {
            await supabase.storage.from("video-wishes").remove([fileName])
          }
        } catch (storageError) {
          console.error("Error deleting video from storage:", storageError)
        }
      }

      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Gagal menghapus pesan.")
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
          Warmest Wishes
        </h2>
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <span
          className="text-primary/60 text-xs"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {comments.length} Komentar
        </span>
      </AnimatedSection>

      <AnimatedSection className="relative w-full" delay={0.3}>
        <FloatingElement className="absolute -top-25 left-1 -rotate-20" yOffset={6} duration={4}>
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
          <div
            ref={scrollRef}
            className="flex max-h-[450px] flex-col gap-4 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40"
          >
            {comments.slice(0, visibleCount).map((comment) => (
              <div
                key={comment.id}
                className="relative flex flex-col rounded-xl border-2 border-dashed border-primary/30 bg-white p-5 shadow-lg"
              >
                {/* Decorative Pin/Dot */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {comment.sender_id === guestRealId && (
                    <button
                      onClick={() => handleDeleteComment(comment.id, comment.video_url)}
                      className="p-1 text-primary transition-colors"
                      title="Hapus Pesan"
                    >
                      <IconTrash size={16} />
                    </button>
                  )}
                  <div className="h-2 w-2 rounded-full bg-primary/30" />
                </div>

                <h3
                  className="text-lg font-bold text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {comment.rsvps?.name || ""}
                </h3>
                <p
                  className="mt-1 text-xs"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {formatDate(comment.created_at)}
                </p>

                <div className="my-3 w-full border-t border-dashed border-primary/50" />

                {comment.video_url && (
                  <div className="mt-3">
                    <CommentVideoPlayer src={comment.video_url} />
                  </div>
                )}

                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap mt-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {comment.message}
                </p>
              </div>
            ))}

            {visibleCount < comments.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="mx-auto mt-6 flex items-center justify-center rounded-xl border-2 border-primary bg-white px-8 py-2.5 text-xs font-bold tracking-wider text-primary shadow-[3px_3px_0px_0px_rgba(130,14,3,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Lihat Selebihnya
              </button>
            )}
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay={0.5} className="w-full">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto">
            <DrawerTrigger asChild>
              <button
                onClick={() => setMode("text")}
                className="flex-1 flex items-center justify-center rounded-xl border-2 border-primary bg-white px-6 py-3.5 text-sm font-bold tracking-wider text-primary shadow-[4px_4px_0px_0px_rgba(130,14,3,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                style={{ fontFamily: "var(--font-heading)" }}
                disabled={!guestRealId || isLoading}
              >
                <IconMessageCircle className="mr-2" size={20} />
                Tulis Pesan
              </button>
            </DrawerTrigger>
            
            <DrawerTrigger asChild>
              <button
                onClick={() => setMode("video")}
                className="flex-1 flex items-center justify-center rounded-xl border-2 border-primary bg-primary px-6 py-3.5 text-sm font-bold tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                style={{ fontFamily: "var(--font-heading)" }}
                disabled={!guestRealId || isLoading}
              >
                <Video className="mr-2" size={20} />
                Rekam Video
              </button>
            </DrawerTrigger>
          </div>
          <DrawerContent className="bg-transparent border-none before:border-2 before:border-primary max-h-[96vh]">
            <div className="mx-auto w-full max-w-sm px-6 pb-8 overflow-y-auto custom-scrollbar">
              <DrawerHeader className="px-0 pt-6 pb-2">
                <DrawerTitle className="text-2xl text-primary flex justify-center items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                  <MessageCircle className="size-6" />
                  Kirim Pesan
                </DrawerTitle>
                <DrawerDescription className="text-center" style={{ fontFamily: "var(--font-heading)" }}>

                </DrawerDescription>
              </DrawerHeader>

              {/* <div className="mb-4 flex justify-center gap-2">
                <button
                  onClick={() => setMode("text")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-xs font-bold transition-all ${mode === "text" ? "bg-primary text-white" : "bg-white text-primary border-2 border-primary"
                    }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Type size={16} />
                  Pesan Teks
                </button>
                <button
                  onClick={() => setMode("video")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-xs font-bold transition-all ${mode === "video" ? "bg-primary text-white" : "bg-white text-primary border-2 border-primary"
                    }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Video size={16} />
                  Video Ucapan
                </button>
              </div> */}

              {mode === "video" ? (
                <VideoRecorder
                  onUploadComplete={handleVideoUpload}
                />
              ) : (
                <form onSubmit={handleSubmit} className="px-0">
                  {videoUrl && (
                    <div className="mb-4 relative rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
                      <CommentVideoPlayer src={videoUrl} />
                      <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1 shadow-lg backdrop-blur-sm">
                        <Video size={12} /> Video Terlampir
                      </div>
                      <button
                        type="button"
                        onClick={() => setVideoUrl(null)}
                        className="absolute top-3 right-3 bg-primary text-white p-1.5 rounded-full shadow-lg transition-all active:scale-90"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  )}

                  <textarea
                    // ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={videoUrl ? "Tambahkan pesan untuk video Anda (opsional)..." : "Tulis pesan atau harapan baik Anda..."}
                    className="min-h-[120px] w-full resize-none rounded-xl border-2 border-dashed border-primary p-4 text-sm focus:border-primary focus:outline-none"
                    style={{ fontFamily: "var(--font-heading)" }}
                    disabled={isSubmitting}
                  />

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={(!message.trim() && !videoUrl) || isSubmitting}
                      className="flex w-full items-center justify-center rounded-xl border-2 border-primary bg-primary py-3.5 text-sm font-bold tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {isSubmitting ? (
                        <IconLoader2 className="animate-spin" />
                      ) : (
                        <>
                          <IconSend className="mr-2" size={18} />
                          {videoUrl ? "Kirim Video & Pesan" : "Kirim Pesan"}
                        </>
                      )}
                    </button>
                    <DrawerClose asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-center rounded-xl border-2 border-primary bg-white py-3 text-sm font-bold tracking-wider text-primary shadow-[4px_4px_0px_0px_rgba(130,14,3,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        Batal
                      </button>
                    </DrawerClose>
                  </div>
                </form>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </AnimatedSection>
    </div>
  )
}
