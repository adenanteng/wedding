"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
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

interface BulkInviteSheetProps {
  onSuccess?: () => void
}

export function BulkInviteSheet({ onSuccess }: BulkInviteSheetProps) {
  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useBackToClose(open, () => setOpen(false))
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0 })
  const stopRef = useRef(false)

  const handleBulkInvite = async () => {
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

    const total = guests.length
    setStats({ total, sent: 0, failed: 0 })
    setProgress(0)

    const origin = window.location.origin

    toast.promise(async () => {
      for (let i = 0; i < guests.length; i++) {
        if (stopRef.current) {
          setIsProcessing(false)
          return "Bulk invite dihentikan"
        }

        const guest = guests[i]
        const messageText = `Kpd Yth. *${guest.name}*\n\nBismillah Ar-Rahman Ar-Rahim.\n\nDi hari yang berbahagia nanti, kami sangat mengharapkan kehadiran Bapak/Ibu/Saudara/i untuk ikut merayakan babak baru kehidupan kami.\n\nDetail Undangan:\n${origin}/${guest.short_id}\n\nTerima kasih telah menjadi bagian dari perjalanan kami. Sampai jumpa di hari bahagia!`;


        try {
          // Send WhatsApp via Server Action
          const result = await sendWhatsAppMessage({
            source: guest.source,
            number: guest.phone,
            text: messageText,
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
        if (i < guests.length - 1 && !stopRef.current) {
          await new Promise(resolve => setTimeout(resolve, i % 5 === 0 ? 8000 : 5000))
        }
      }

      setIsProcessing(false)
      if (onSuccess) onSuccess()
      return "Bulk invite selesai"
    }, {
      loading: "Mengirim undangan bulk...",
      success: (msg) => msg,
      error: "Terjadi kesalahan saat bulk invite",
    })
  }

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

        <div className="py-8 px-6 space-y-6 text-lg">
          {!isProcessing ? (
            <div className="bg-secondary/30 p-4 rounded-lg flex flex-col gap-2">
              <p className="font-medium">Informasi:</p>
              <ul className="text-muted-foreground list-disc list-inside space-y-1">
                <li>Hanya tamu dengan status "Belum Terundang" yang akan dikirim.</li>
                <li>Ada jeda 5-8 detik antar pesan untuk keamanan akun WhatsApp.</li>
                <li>Jangan tutup tab browser ini selama proses berjalan.</li>
              </ul>
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
            <Button className="w-full text-lg" onClick={handleBulkInvite}>
              <IconPlayerPlay className="mr-2 h-4 w-4" />
              Mulai Bulk Invite
            </Button>
          ) : (
            <Button variant="destructive" className="w-full text-lg" onClick={() => stopRef.current = true}>
              <IconPlayerStop className="mr-2 h-4 w-4" />
              Stop Proses
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
