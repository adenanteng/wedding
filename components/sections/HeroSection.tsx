import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="flex w-full flex-col items-center">
      {/* ===== SAVE THE DATE HEADING ===== */}
      <div className="relative z-10 pt-10 pb-2 text-center">
        <h1
          className="font-heading font-bold text-5xl leading-[1.15] tracking-wide text-[#9e0e00] uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Save
          <br />
          The
          <br />
          Date!
        </h1>
      </div>

      {/* ===== HAND-DRAWN ILLUSTRATION (tali love) ===== */}
      <div className="relative z-0 -mt-6 w-full px-0">
        <Image
          src="/img/3.svg"
          alt="Hand-drawn illustration of two hands holding a string of love"
          width={600}
          height={300}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      {/* ===== COUPLE NAMES ===== */}
      <div className="z-10 -mt-2 text-center">
        <h2
          className="text-3xl tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Aden & Rahma
        </h2>
      </div>

      {/* ===== QURAN VERSE ===== */}
      <div className="mt-6 max-w-xs px-6 text-center">
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          And one of His signs is that He created for you spouses from among
          yourselves so that you may find comfort in them. And He has placed
          between you compassion and mercy. Surely in this are signs for people
          who reflect.
        </p>
        <p
          className="mt-4 text-xs tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Surah Ar-Rum 21
        </p>
      </div>
    </div>
  )
}
