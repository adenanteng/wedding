"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { IconPlus, IconLoader2 } from "@tabler/icons-react"
import { useBackToClose } from "@/hooks/useBackToClose"

interface AddRsvpSheetProps {
  onSuccess?: () => void
}

export function AddRsvpSheet({ onSuccess }: AddRsvpSheetProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useBackToClose(open, () => setOpen(false))
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    source: "enola", // Default source
    short_id: "",
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateShortId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, short_id: result }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const finalShortId = formData.short_id || Math.random().toString(36).substring(2, 8).toUpperCase()
      
      const { error } = await supabase.from('rsvps').insert([
        {
          name: formData.name,
          phone: formData.phone,
          source: formData.source,
          short_id: finalShortId,
          invited: false,
          presence: null,
        }
      ])

      if (error) throw error

      setOpen(false)
      setFormData({
        name: "",
        phone: "",
        source: "enola",
        short_id: "",
      })
      
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error adding RSVP:", error)
      alert("Gagal menambahkan RSVP.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="text-lg">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Manual RSVP
        </Button>
      </SheetTrigger>
      <SheetContent style={{ fontFamily: "var(--font-sans)" }} className="text-lg">
        <SheetHeader>
          <SheetTitle className="text-lg">Tambah Tamu Undangan</SheetTitle>
          <SheetDescription className="text-lg">
            Masukkan detail tamu secara manual untuk masuk ke daftar undangan.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">Nama Tamu</Label>
            <Input
              id="name"
              placeholder=""
              className="text-lg"
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-lg">Nomor WhatsApp</Label>
            <Input
              id="phone"
              placeholder=""
              className="text-lg"
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source" className="text-lg">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value) => setFormData(p => ({ ...p, source: value }))}
            >
              <SelectTrigger className="w-full text-lg">
                <SelectValue placeholder="Pilih" className="text-lg" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aden" className="text-lg font-sans">aden</SelectItem>
                <SelectItem value="rahma" className="text-lg font-sans">rahma</SelectItem>
                <SelectItem value="enola" className="text-lg font-sans">enola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SheetFooter className="pt-4 p-0">
            <Button type="submit" className="w-full text-lg" disabled={loading}>
              {loading ? <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Tamu"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
