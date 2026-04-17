import Image from "next/image"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedText } from "@/components/ui/animated-text"

export default function BrideGroomSection() {
  return (
    <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Invitation Text */}
      <AnimatedSection delay={0.1}>
        <AnimatedText
          text="Kami mengundang Anda untuk menghadiri acara pernikahan kami."
          className="max-w-xs text-center text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
        />
      </AnimatedSection>

      {/* Bride & Groom Heading */}
      <AnimatedSection delay={0.2}>
        <h2
          className="mt-8 text-3xl tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Bride & Groom
        </h2>
      </AnimatedSection>

      {/* Couple Photo with Hand-drawn Frame */}
      <AnimatedSection className="relative mt-6 flex items-center justify-center" delay={0.3}>
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
      </AnimatedSection>

      {/* Groom Name */}
      <AnimatedSection delay={0.4} className="flex flex-col items-center">
        <h3
          className="mt-8 text-2xl tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Aden Anteng Anugrah
        </h3>
        <AnimatedText
          text="Putra pertama dari Bapak Enyang Suandi & (Alm.) Ibu Kakai"
          className="mt-3 max-w-xs text-center text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
          delay={0.7}
        />
      </AnimatedSection>

      {/* Separator */}
      <AnimatedSection delay={0.5}>
        <p
          className="mt-8 text-3xl text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          &
        </p>
      </AnimatedSection>

      {/* Bride Name */}
      <AnimatedSection delay={0.6} className="flex flex-col items-center">
        <h3
          className="mt-4 text-2xl tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Rahma Cahya Malinda
        </h3>
        <AnimatedText
          text="Putri pertama dari Bapak Ahmad Ansori & Ibu Rinawati"
          className="mt-3 max-w-xs text-center text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
          delay={0.7}
        />
      </AnimatedSection>
    </div>
  )
}
