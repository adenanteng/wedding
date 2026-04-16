"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient"
import { IconConfetti, IconCopy, IconPencil, IconTrash } from "@tabler/icons-react"
import { EditRsvpSheet } from "./edit-rsvp-sheet"
import { sendWhatsAppMessage } from "@/lib/actions/invite"

export type RSVP = {
  id: string
  name: string
  phone: string
  source: string
  short_id: string
  invited: boolean | null
  presence: boolean | null
  total_guest: number
  created_at: string
}

export const columns: ColumnDef<RSVP>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return <div className="font-medium">{name}</div>
    },
  },
  {
    accessorKey: "phone",
    header: "Telepon",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return <div className="font-medium">{phone}</div>
    },
  },
  {
    accessorKey: "presence",
    header: "Kehadiran",
    cell: ({ row }) => {
      const presence = row.getValue("presence")

      if (presence === null || presence === undefined) {
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1">
            <MoreHorizontal className="h-3 w-3" />
            Belum Tahu
          </Badge>
        )
      }

      return (
        <Badge variant={presence ? "default" : "destructive"} className="flex w-fit items-center gap-1">
          {presence ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Hadir
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Tidak Hadir
            </>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "invited",
    header: "Diundang",
    cell: ({ row }) => {
      const invited = row.getValue("invited")

      if (invited === null || invited === undefined) {
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1">
            <MoreHorizontal className="h-3 w-3" />
            Tidak Tahu
          </Badge>
        )
      }

      return (
        <Badge variant={invited ? "default" : "destructive"} className="flex w-fit items-center gap-1">
          {invited ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Terundang
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Belum
            </>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "source",
    header: "Sumber",
    cell: ({ row }) => {
      const source = row.getValue("source") as string
      return <div className="font-medium">{source}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const rsvp = row.original
      const [isEditOpen, setIsEditOpen] = useState(false)

      const handleInvite = async (id: string) => {
        try {
          const { error: updateError } = await supabase
            .from('rsvps')
            .update({ invited: true })
            .eq('id', id);

          if (updateError) throw updateError;

          const origin = window.location.origin;
          const messageText = `Kpd Yth. *${rsvp.name}*,\n\nBismillah Ar-Rahman Ar-Rahim\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.\n\nUndangan Digital:\n${origin}/${rsvp.short_id}\n\nSebuah kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;

          const result = await sendWhatsAppMessage({
            source: rsvp.source,
            number: rsvp.phone,
            text: messageText,
          });

          if (!result.success) throw new Error(result.error);

          if ((table.options.meta as any)?.refresh) {
            (table.options.meta as any).refresh();
          }

          alert(`Undangan berhasil dikirim ke ${rsvp.name}`);
        } catch (error) {
          console.error('Error sending invitation:', error);
          alert('Gagal mengirim undangan.');
        }
      };

      const deleteRsvp = async () => {
        if (confirm(`Are you sure you want to delete ${rsvp.name}?`)) {
          const { error } = await supabase.from('rsvps').delete().eq('id', rsvp.id)
          if (!error) {
            if ((table.options.meta as any)?.refresh) {
              (table.options.meta as any).refresh()
            }
          }
        }
      }

      return (
        <>
          <EditRsvpSheet 
            rsvp={rsvp} 
            open={isEditOpen} 
            onOpenChange={setIsEditOpen}
            onSuccess={() => {
              if ((table.options.meta as any)?.refresh) {
                (table.options.meta as any).refresh()
              }
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleInvite(rsvp.id)}
              >
                <IconConfetti className="mr-2 h-4 w-4" />
                Undang
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
              >
                <IconPencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${rsvp.short_id}`)}
              >
                <IconCopy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={deleteRsvp}>
                <IconTrash className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  },
]
