import Image from "next/image"
import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedText } from "@/components/ui/animated-text"
import { FloatingElement } from "@/components/ui/floating-element"
import { EndlessBouncingText } from "@/components/ui/endless-bouncing-text"

export default function HeroSection() {
  return (
    <div className="flex w-full flex-col items-center mt-10">
      {/* ===== SAVE THE DATE HEADING ===== */}
      <AnimatedSection className="relative z-10 pt-10 pb-2 text-center -rotate-5" delay={0.1}>
        <FloatingElement yOffset={10} duration={3}>
          <EndlessBouncingText
            as="h1"
            text={"Save\nThe\nDate!"}
            className="font-heading font-bold text-5xl leading-[1.15] tracking-wide text-primary uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          />
        </FloatingElement>
      </AnimatedSection>

      {/* ===== HAND-DRAWN ILLUSTRATION (tali love) ===== */}
      <AnimatedSection className="relative z-0 -mt-6 w-full px-0" delay={0.2}>
        <Image
          src="/img/3.svg"
          alt="Hand-drawn illustration of two hands holding a string of love"
          width={600}
          height={300}
          className="h-auto w-full object-contain"
          priority
        />
      </AnimatedSection>

      {/* ===== COUPLE NAMES ===== */}
      <AnimatedSection className="z-10 -mt-2 text-center" delay={0.3}>
        <FloatingElement yOffset={10} duration={3}>
          <h2
            className="text-3xl tracking-wide text-primary font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aden & Rahma
          </h2>
        </FloatingElement>
      </AnimatedSection>

      {/* ===== QURAN VERSE ===== */}
      <div className="mt-6 max-w-xs px-6 text-center">
        <AnimatedText
          text='"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."'
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
          delay={0.4}
        />
        <AnimatedText
          text="QS. Ar-Rum: 21"
          className="mt-4 text-xs tracking-wider"
          style={{ fontFamily: "var(--font-heading)" }}
          delay={1.5}
        />
      </div>
    </div>
  )
}
