"use client"

import { useState, useEffect } from "react"
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
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { IconLoader2 } from "@tabler/icons-react"
import { RSVP } from "./columns"
import { useBackToClose } from "@/hooks/useBackToClose"

interface EditRsvpSheetProps {
  rsvp: RSVP
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditRsvpSheet({ rsvp, open, onOpenChange, onSuccess }: EditRsvpSheetProps) {
  const [loading, setLoading] = useState(false)

  useBackToClose(open, () => onOpenChange(false))
  
  const [formData, setFormData] = useState({
    name: rsvp.name,
    phone: rsvp.phone,
    source: rsvp.source,
    short_id: rsvp.short_id,
  })

  // Sync state if rsvp prop changes
  useEffect(() => {
    setFormData({
      name: rsvp.name,
      phone: rsvp.phone,
      source: rsvp.source,
      short_id: rsvp.short_id,
    })
  }, [rsvp])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('rsvps')
        .update({
          name: formData.name,
          phone: formData.phone,
          source: formData.source,
          short_id: formData.short_id,
        })
        .eq('id', rsvp.id)

      if (error) throw error

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error updating RSVP:", error)
      alert("Gagal memperbarui RSVP.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={{ fontFamily: "var(--font-sans)" }}>
        <SheetHeader>
          <SheetTitle>Edit Tamu Undangan</SheetTitle>
          <SheetDescription>
            Ubah detail tamu undangan.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama Tamu</Label>
            <Input
              id="edit-name"
              placeholder=""
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Nomor WhatsApp</Label>
            <Input
              id="edit-phone"
              placeholder=""
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-source">Source</Label>
            <Select
              value={formData.source} 
              onValueChange={(value) => setFormData(p => ({ ...p, source: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aden">aden</SelectItem>
                <SelectItem value="rahma">rahma</SelectItem>
                <SelectItem value="enola">enola</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-short_id">Short ID</Label>
            <Input
              id="edit-short_id"
              placeholder=""
              value={formData.short_id}
              onChange={(e) => setFormData(p => ({ ...p, short_id: e.target.value.toUpperCase() }))}
              required
            />
          </div>
          <SheetFooter className="pt-4 p-0">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
