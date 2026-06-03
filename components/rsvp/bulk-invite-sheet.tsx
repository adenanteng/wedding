"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabaseClient"
import { IconConfetti, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react"
import { toast } from "sonner"
import { sendWhatsAppMessage } from "@/lib/actions/invite"
import { useBackToClose } from "@/hooks/useBackToClose"
import { getInvitationMessage } from "@/lib/invite-utils"

interface BulkInviteSheetProps {
  onSuccess?: () => void
}

export function BulkInviteSheet({ onSuccess }: BulkInviteSheetProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useBackToClose(open, () => setOpen(false))
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 })
  const [limitInput, setLimitInput] = useState("30")
  const [totalUninvited, setTotalUninvited] = useState<number | null>(null)
  const stopRef = useRef(false)

  const fetchUninvitedCount = async () => {
    const { count, error } = await supabase
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .or('invited.eq.false,invited.is.null')

    if (!error && count !== null) {
      setTotalUninvited(count)
    }
  }

  useEffect(() => {
    if (open) {
      fetchUninvitedCount()
    }
  }, [open])

  const handleBulkInvite = async () => {
    const limitVal = Number(limitInput)
    if (isNaN(limitVal) || limitVal < 1 || limitVal > 50) {
      toast.error("Limit undangan harus antara 1 dan 50")
      return
    }

    setIsProcessing(true)
    stopRef.current = false

    // 1. Fetch uninvited guests
    const { data: guests, error } = await supabase
      .from('rsvps')
      .select('*')
      .or('invited.eq.false,invited.is.null')

    if (error) {
      toast.error("Gagal mengambil data tamu")
      setIsProcessing(false)
      return
    }

    if (!guests || guests.length === 0) {
      toast.info("Semua tamu sudah diundang!")
      setIsProcessing(false)
      return
    }

    // Limit to user input
    const guestsToInvite = guests.slice(0, limitVal)

    const total = guestsToInvite.length
    setStats({ total, sent: 0, failed: 0 })
    setProgress(0)

    const origin = window.location.origin

    toast.promise(async () => {
      for (let i = 0; i < guestsToInvite.length; i++) {
        if (stopRef.current) {
          setIsProcessing(false)
          fetchUninvitedCount()
          return "Bulk invite dihentikan"
        }

        const guest = guestsToInvite[i]
        const messageText = getInvitationMessage(guest, origin);


        try {
          // Send WhatsApp via Server Action
          const result = await sendWhatsAppMessage({
            source: guest.source,
            number: guest.phone,
            text: messageText,
            attachBanner: true,
          });

          if (!result.success) throw new Error(result.error);

          // Update Supabase
          await supabase.from('rsvps').update({ invited: true }).eq('id', guest.id)

          setStats(prev => ({ ...prev, sent: prev.sent + 1 }))
        } catch (err) {
          console.error(`Failed to invite ${guest.name}`, err)
          setStats(prev => ({ ...prev, failed: prev.failed + 1 }))
        }

        setProgress(Math.round(((i + 1) / total) * 100))

        // Delay (e.g., 5-8 seconds between messages)
        if (i < guestsToInvite.length - 1 && !stopRef.current) {
          await new Promise(resolve => setTimeout(resolve, i % 5 === 0 ? 8000 : 5000))
        }
      }

      setIsProcessing(false)
      fetchUninvitedCount()
      if (onSuccess) onSuccess()
      return "Bulk invite selesai"
    }, {
      loading: `Mengirim ${total} undangan bulk...`,
      success: (msg) => msg,
      error: "Terjadi kesalahan saat bulk invite",
    })
  }

  const isLimitInvalid = isNaN(Number(limitInput)) || Number(limitInput) < 1 || Number(limitInput) > 50

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="text-lg">
          <IconConfetti className="mr-2 h-4 w-4" />
          Bulk Invite
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md" style={{ fontFamily: "var(--font-sans)" }}>
        <SheetHeader>
          <SheetTitle className="text-lg">Bulk Invite WhatsApp</SheetTitle>
          <SheetDescription className="text-lg">
            Kirim undangan ke semua tamu yang belum terundang secara otomatis dengan delay.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-6 space-y-6 text-base">
          {!isProcessing ? (
            <div className="space-y-6">
              {/* Info Tamu */}
              <div className="bg-secondary/20 p-4 rounded-xl border border-secondary/50 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Total Tamu Belum Diundang:</span>
                  <span className="font-bold text-base">
                    {totalUninvited !== null ? `${totalUninvited} orang` : "Memuat..."}
                  </span>
                </div>
              </div>

              {/* Input Limit */}
              <div className="space-y-2">
                <Label htmlFor="limit-input" className="text-sm font-medium flex justify-between">
                  <span>Limit Undangan per Sesi:</span>
                  <span className="text-xs text-muted-foreground">(Maksimal 50)</span>
                </Label>
                <Input
                  id="limit-input"
                  type="number"
                  min={1}
                  max={50}
                  value={limitInput}
                  onChange={(e) => setLimitInput(e.target.value)}
                  className="w-full focus-visible:ring-primary"
                />
                
                {/* Warning / Error messages */}
                {Number(limitInput) > 30 && Number(limitInput) <= 50 && (
                  <div className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                    <span className="font-bold">⚠️ Peringatan Anti-Spam:</span>
                    <span>Mengirim lebih dari 30 undangan sekaligus meningkatkan risiko nomor WhatsApp diblokir atau ditandai sebagai spam oleh WhatsApp.</span>
                  </div>
                )}
                {(Number(limitInput) > 50 || Number(limitInput) < 1 || isLimitInvalid) && (
                  <div className="text-xs text-red-600 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg flex flex-col gap-1">
                    <span className="font-bold">❌ Input Tidak Valid:</span>
                    <span>Masukkan jumlah limit undangan antara 1 sampai 50.</span>
                  </div>
                )}
              </div>

              <div className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2 text-sm">
                <p className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Informasi Prosedur:</p>
                <ul className="text-muted-foreground list-disc list-inside space-y-1.5 text-xs">
                  <li>Hanya tamu dengan status "Belum Terundang" yang akan diproses.</li>
                  <li>Ada jeda 5-8 detik antar pesan untuk mengurangi risiko spam.</li>
                  <li>Jangan tutup tab browser ini selama proses pengiriman berlangsung.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress: {progress}%</span>
                <span>{stats.sent + stats.failed} / {stats.total}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-bold uppercase">Berhasil</p>
                  <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-bold uppercase">Gagal</p>
                  <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6">
          {!isProcessing ? (
            <Button 
              className="w-full text-lg font-medium" 
              onClick={handleBulkInvite}
              disabled={isLimitInvalid || totalUninvited === 0}
            >
              <IconPlayerPlay className="mr-2 h-4 w-4" />
              Mulai Bulk Invite
            </Button>
          ) : (
            <Button variant="destructive" className="w-full text-lg font-medium" onClick={() => stopRef.current = true}>
              <IconPlayerStop className="mr-2 h-4 w-4" />
              Stop Proses
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
