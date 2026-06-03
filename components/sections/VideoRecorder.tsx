"use client"

import { useMusic } from "@/context/MusicContext"
import { IconAlertCircle, IconCircleFilled, IconPhoto, IconPlayerPlay, IconPlayerStopFilled, IconRefresh, IconSparkles, IconTrash, IconUpload } from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"

interface VideoRecorderProps {
  onUploadComplete: (url: string) => void
}

export default function VideoRecorder({ onUploadComplete }: VideoRecorderProps) {
  const { 
    isPlaying: isMusicPlaying, 
    setIsPlaying: setIsMusicPlaying, 
    isForcePaused, 
    setIsForcePaused, 
    isEngagementPlaying, 
    setIsEngagementPlaying 
  } = useMusic()
  const [wasPlaying, setWasPlaying] = useState(false)

  const webcamRef = useRef<Webcam>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPlayingPreview, setIsPlayingPreview] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const MAX_DURATION = 20
  const [isUploading, setIsUploading] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
  const [filter, setFilter] = useState<string>("none")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)

  // Handle data availability
  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data))
      }
    },
    [setRecordedChunks]
  )

  // Start recording
  const handleStartCaptureClick = useCallback(() => {
    const video = webcamRef.current?.video
    const canvas = canvasRef.current
    if (!video || !canvas) return

    setIsRecording(true)
    setRecordingTime(0)
    setRecordedChunks([])

    // Pause all other videos on the page
    document.querySelectorAll("video").forEach(v => {
      const videoElement = v as HTMLVideoElement
      if (videoElement !== video) videoElement.pause()
    })

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to portrait 2:3
    canvas.width = 480
    canvas.height = 720

    const drawFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Calculate crop to maintain 2:3 aspect ratio from source
        const sourceAspect = video.videoWidth / video.videoHeight
        const targetAspect = 2 / 3

        let sx, sy, sw, sh
        if (sourceAspect > targetAspect) {
          // Source is wider than target (Landscape camera)
          sw = video.videoHeight * targetAspect
          sh = video.videoHeight
          sx = (video.videoWidth - sw) / 2
          sy = 0
        } else {
          // Source is narrower than target
          sw = video.videoWidth
          sh = video.videoWidth / targetAspect
          sx = 0
          sy = (video.videoHeight - sh) / 2
        }

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
      }
      requestRef.current = requestAnimationFrame(drawFrame)
    }

    drawFrame()

    // Get original stream for audio
    const originalStream = video.srcObject as MediaStream
    const canvasStream = canvas.captureStream(30) // 30 FPS

    // Combine canvas video with original audio
    const tracks = [
      ...canvasStream.getVideoTracks(),
      ...(originalStream ? originalStream.getAudioTracks() : [])
    ]

    const combinedStream = new MediaStream(tracks)

    // Check supported types for better compatibility (Safari/Chrome/Firefox)
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm"

    mediaRecorderRef.current = new MediaRecorder(combinedStream, { mimeType })
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable)
    mediaRecorderRef.current.start()
  }, [webcamRef, handleDataAvailable])

  // Stop recording
  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = null
    }
    setIsRecording(false)
  }, [mediaRecorderRef])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION) {
            handleStopCaptureClick()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, handleStopCaptureClick])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 40 * 1024 * 1024) { // 40MB limit
        setErrorMsg("File terlalu besar. Maksimal 40MB agar kualitas tetap terjaga dan pengiriman lancar.")
        return
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setRecordedChunks([file]) // Store file as a blob

      // Resume music when moving from webcam to preview
      if (wasPlaying) setIsMusicPlaying(true)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  // Generate preview
  useEffect(() => {
    if (!isRecording && recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    }
  }, [recordedChunks, isRecording])

  // Upload to Supabase
  const handleUpload = async () => {
    if (recordedChunks.length === 0) return

    setIsUploading(true)
    try {
      const blob = new Blob(recordedChunks, { type: "video/webm" })
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`

      // We'll pass the blob back to the parent to handle Supabase upload 
      // or handle it here if we import supabase
      const { supabase } = await import("@/lib/supabaseClient")

      const { error } = await supabase.storage
        .from("video-wishes")
        .upload(fileName, blob, {
          cacheControl: "3600",
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from("video-wishes")
        .getPublicUrl(fileName)

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Gagal mengunggah video. Silakan coba lagi.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetRecording = () => {
    setRecordedChunks([])
    setPreviewUrl(null)
    // Music will be paused again by the useEffect below
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }

  const filters = [
    { id: "none", name: "Normal", class: "" },
    { id: "sepia", name: "Classic", class: "sepia-[0.6]" },
    { id: "grayscale", name: "B&W", class: "grayscale" },
    { id: "warm", name: "Warm", class: "hue-rotate-15 contrast-110 saturate-110" },
  ]

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      <div className="relative w-full aspect-[2/3] rounded-3xl overflow-hidden bg-black border-4 border-primary/20 shadow-2xl">
        {previewUrl ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => {
            if (previewVideoRef.current?.paused) {
              previewVideoRef.current.play()
              setIsPlayingPreview(true)
            } else {
              previewVideoRef.current?.pause()
              setIsPlayingPreview(false)
            }
          }}>
            <video
              ref={previewVideoRef}
              src={previewUrl}
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => {
                setWasPlaying(isMusicPlaying)
                setIsMusicPlaying(false)
                document.querySelectorAll("video").forEach(v => {
                  const videoElement = v as HTMLVideoElement
                  if (videoElement !== previewVideoRef.current) videoElement.pause()
                })
              }}
              onEnded={() => {
                if (wasPlaying) setIsMusicPlaying(true)
                setIsPlayingPreview(false)
              }}
              onPause={() => setIsPlayingPreview(false)}
            />

            {/* Custom Play Button Overlay */}
            <AnimatePresence>
              {!isPlayingPreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black bg-white text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <IconPlayerPlay size={32} fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Webcam
              audio={true}
              muted={true}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }}
              mirrored={facingMode === "user"}
              className={`w-full h-full object-cover transition-all duration-300 ${filters.find(f => f.id === filter)?.class || ""}`}
            />
            {/* Hidden canvas for cropping to portrait */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-sans">REC {recordingTime}s / {MAX_DURATION}s</span>
            </div>
            {/* Progress Bar */}
            <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${(recordingTime / MAX_DURATION) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Wedding Frame Overlay */}
        {!previewUrl && (
          <div className="pointer-events-none absolute inset-0 border-16 border-transparent">
            <div className="absolute inset-0 border-2 border-white/30 m-2 rounded-lg" />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <IconSparkles className="text-white/50" size={24} />
              <IconSparkles className="text-white/50" size={24} />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-serif">
              Aden & Rahma Wedding
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 w-full font-heading">
        {!previewUrl ? (
          <>
            {/* Filters */}
            {/* <div className="flex gap-2 w-full justify-center mb-2">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-all ${filter === f.id ? "bg-primary text-white" : "bg-white/80 text-primary border border-primary/20"
                    }`}
                >
                  {f.name}
                </button>
              ))}
            </div> */}

            <button
              onClick={toggleCamera}
              className="p-4 rounded-full bg-white/80 text-primary shadow-lg active:scale-95 transition-transform"
            >
              <IconRefresh size={24} />
            </button>

            {isRecording ? (
              <button
                onClick={handleStopCaptureClick}
                className="p-4 rounded-full bg-primary text-white shadow-lg active:scale-95 transition-transform"
              >
                <IconPlayerStopFilled size={24} />
              </button>
            ) : (
              <button
                onClick={handleStartCaptureClick}
                className="p-4 rounded-full bg-primary text-white shadow-lg active:scale-95 transition-transform"
              >
                <IconCircleFilled size={24} className="text-white" />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-full bg-white/80 text-primary shadow-lg active:scale-95 transition-transform"
            >
              <IconPhoto size={24} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={resetRecording}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary border-2 border-primary font-bold active:scale-95 transition-all disabled:opacity-50"
            >
              <IconTrash size={20} />
              Ulangi
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <IconUpload size={20} />
              )}
              {isUploading ? "Mengunggah..." : "Kirim Video"}
            </button>
          </>
        )}
      </div>
      {/* Error Modal */}
      <AnimatePresence>
        {errorMsg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorMsg(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary text-primary">
                  <IconAlertCircle size={32} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-black" style={{ fontFamily: "var(--font-heading)" }}>
                  Waduh, Maaf Ya!
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-heading)" }}>
                  {errorMsg}
                </p>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="w-full rounded-xl border-2 border-primary bg-primary py-3 text-sm font-bold tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Siap, Mengerti!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
