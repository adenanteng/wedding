"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, MoreHorizontal, ArrowUpDown } from "lucide-react"
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
import { RSVP } from "./types"

export const columns: ColumnDef<RSVP>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-2 py-1 -ml-2 h-8 text-sm"
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return <div className="font-medium">{name}</div>
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-2 py-1 -ml-2 h-8 text-sm"
        >
          Telepon
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string
      return <div className="font-medium">{phone}</div>
    },
  },
  {
    accessorKey: "presence",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-2 py-1 -ml-2 h-8 text-sm"
        >
          Kehadiran
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true
      const presence = row.getValue(columnId)
      if (filterValue === "hadir") return presence === true
      if (filterValue === "tidak_hadir") return presence === false
      if (filterValue === "belum_tahu") return presence === null || presence === undefined
      return true
    },
  },
  {
    accessorKey: "invited",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-2 py-1 -ml-2 h-8 text-sm"
        >
          Diundang
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true
      const invited = row.getValue(columnId)
      if (filterValue === "terundang") return invited === true
      if (filterValue === "belum") return invited === false
      if (filterValue === "tidak_tahu") return invited === null || invited === undefined
      return true
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-2 py-1 -ml-2 h-8 text-sm"
        >
          Sumber
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const source = row.getValue("source") as string
      return <div className="font-medium">{source}</div>
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true
      const source = row.getValue(columnId) as string
      return source === filterValue
    },
  },
  // {
  //   accessorKey: "total_guest",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="hover:bg-accent hover:text-accent-foreground font-semibold px-2 py-1 -ml-2 h-8 text-sm"
  //       >
  //         Tamu
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const total = row.getValue("total_guest") as number
  //     return <div className="font-medium">{total ?? 1}</div>
  //   },
  // },
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
          const messageText = `Kepada Yth. 
*Bapak/Ibu/Saudara/i ${rsvp.name}*

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

_Bismillahirahmanirrahim_

Selamat Pagi/Siang/Malam.

Tanpa mengurangi rasa hormat, karena keterbatasan jarak, melalui pesan digital ini kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.
Berikut detail informasi acara beserta link undangan digital kami:

*Rahma Cahya Malinda, S.H* 
                       & 
*Aden Anteng Anugrah, S.Kom*

🗓️ Hari/Tanggal: *Senin, 15 Juni 2026*
📍 Lokasi: *Kediaman mempelai wanita*
🔗 Link Undangan: 
*${origin}/${rsvp.short_id}*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.

Terima kasih banyak atas perhatian dan doa restunya.

Wassalamu’alaikum Warahmatullahi Wabarakatuh


Kami yang berbahagia,
Rahma & Aden`;

          const result = await sendWhatsAppMessage({
            source: rsvp.source,
            number: rsvp.phone,
            text: messageText,
            attachBanner: true,
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
              <Button variant="ghost" className="h-8 w-8 p-0 font-sans">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-lg font-sans">
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
