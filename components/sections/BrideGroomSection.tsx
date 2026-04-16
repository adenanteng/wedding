import Image from "next/image"

export default function BrideGroomSection() {
  return (
    <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Invitation Text */}
      <p
        className="max-w-xs text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Kami mengundang Anda untuk
        <br />
        menghadiri acara pernikahan kami.
      </p>

      {/* Bride & Groom Heading */}
      <h2
        className="mt-8 text-3xl tracking-wide text-primary font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Bride & Groom
      </h2>

      {/* Couple Photo with Hand-drawn Frame */}
      <div className="relative mt-6 flex items-center justify-center">
        {/* Frame SVG */}
        <Image
          src="/img/4.svg"
          alt="Hand-drawn ornate frame"
          width={300}
          height={440}
          className="pointer-events-none relative z-10 h-auto w-[280px]"
        />
        {/* Couple Photo inside frame */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="mt-2 p-3 overflow-hidden">
            <Image
              src="/img/couple.jpeg"
              alt="Couple photo"
              width={380}
              height={520}
              className="h-full w-full object-cover rounded-3xl border-2 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Groom Name */}
      <h3
        className="mt-8 text-2xl tracking-wide text-primary font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Aden Anteng Anugrah
      </h3>
      <p
        className="mt-3 max-w-xs text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Putra pertama dari
        <br />
        Bapak Enyang Suandi &
        <br />
        (Alm.) Ibu Kakai
      </p>

      {/* Separator */}
      <p
        className="mt-8 text-3xl text-primary font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        &
      </p>

      {/* Bride Name */}
      <h3
        className="mt-4 text-2xl tracking-wide text-primary font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Rahma Cahya Malinda
      </h3>
      <p
        className="mt-3 max-w-xs text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Putri pertama dari
        <br />
        Bapak Ahmad Ansori &
        <br />
        Ibu Rinawati
      </p>
    </div>
  )
}
