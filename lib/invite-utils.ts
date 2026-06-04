export interface InviteGuest {
  name: string
  short_id: string
}

export const getInvitationMessage = (guest: InviteGuest, origin: string): string => {
  return `Kepada Yth. 
*Bapak/Ibu/Saudara/i ${guest.name}*

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

_Bismillahirahmanirrahim_

Tanpa mengurangi rasa hormat, karena keterbatasan jarak, melalui pesan digital ini kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara pernikahan kami.
Berikut detail informasi acara beserta link undangan digital kami:

*Rahma Cahya Malinda, S.H* 
                       & 
*Aden Anteng Anugrah, S.Kom*

🗓️ Hari/Tanggal: *Senin, 15 Juni 2026*
📍 Lokasi: *Kediaman Mempelai Wanita*
🔗 Link Undangan: 
*${origin}/${guest.short_id}*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari istimewa kami.

Terima kasih banyak atas perhatian dan doa restunya.

_Wassalamu’alaikum Warahmatullahi Wabarakatuh_


Kami yang berbahagia,
Rahma & Aden`
}
