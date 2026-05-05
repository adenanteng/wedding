import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 – Halaman Tidak Ditemukan | Aden & Rahma",
  description: "Halaman yang kamu cari tidak ditemukan.",
}

export default function NotFound() {
  return (
    <div
      className="min-h-svh flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: "linear-gradient(160deg, #fff9f5 0%, #fff 60%, #fdf4f4 100%)" }}
    >
      {/* Illustration */}
      <div className="relative mb-6 w-72 max-w-xs" style={{ animation: "fadeInUp 0.7s ease both" }}>
        <Image
          src="/img/404-illustration.png"
          alt="Bride and groom looking lost"
          width={400}
          height={400}
          priority
          className="w-full drop-shadow-lg rounded-3xl"
        />
      </div>

      {/* Headline */}
      <h1
        className="mt-2 text-3xl text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Nyasar ya? 😅
      </h1>

      {/* Subtext */}
      <p
        className="mt-3 max-w-xs text-base text-gray-500"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Halaman yang kamu cari tidak ditemukan.
        Mungkin link undangannya salah atau sudah tidak berlaku.
      </p>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px w-16 bg-primary/20" />
        <span className="text-lg text-primary">❤</span>
        <span className="h-px w-16 bg-primary/20" />
      </div>

      {/* CTA */}
      {/* <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[#9e0e00] px-8 py-3 text-sm font-semibold text-white shadow-md transition-transform active:scale-95 hover:bg-[#7a0b00]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        ← Kembali ke Beranda
      </Link> */}
    </div>
  )
}
