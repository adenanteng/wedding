import Image from "next/image"
import { AnimatedSection } from "@/components/ui/animated-section"
import { FloatingElement } from "@/components/ui/floating-element"

export default function TimelineSection() {
  return (
    <div className="relative flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Candle Illustration */}
      <AnimatedSection className="w-full flex justify-center" delay={0.1}>
        <FloatingElement yOffset={8} duration={3.5}>
          <Image
            src="/img/5.svg"
            alt="Candle"
            width={100}
            height={100}
            className="h-[100px] w-[100px] object-contain"
          />
        </FloatingElement>
      </AnimatedSection>

      {/* Timeline Schedule */}
      <AnimatedSection className="mt-4 w-full max-w-xs" delay={0.2}>
        {/* Row 1 */}
        <div className="border-b border-black py-3">
          <div className="flex items-baseline gap-6">
            <span
              className="w-[90px] text-right text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              09:00
            </span>
            <span
              className="text-base"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Akad Nikah
            </span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="border-b border-black py-3">
          <div className="flex items-baseline gap-6">
            <span
              className="w-[90px] text-right text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              10:00
            </span>
            <span
              className="text-base"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Resepsi
            </span>
          </div>
        </div>

        {/* Row 3 */}
        <div className="border-b border-black py-3">
          <div className="flex items-baseline gap-6">
            <span
              className="w-[90px] text-right text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              18:00
            </span>
            <span
              className="text-base"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Party
            </span>
          </div>
        </div>

        {/* Row 4 */}
        <div className="border-b border-black py-3">
          <div className="flex items-baseline gap-6">
            <span
              className="w-[90px] text-right text-sm"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              19:00
            </span>
            <span
              className="text-base"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Photo and Greeting
            </span>
          </div>
        </div>
      </AnimatedSection>

      {/* Shoes/Heels Illustration - bottom right */}
      <AnimatedSection className="relative w-full" delay={0.3}>
        <FloatingElement className="absolute -top-15 left-0" yOffset={6} duration={4} delay={0.5}>
          <Image
            src="/img/7.svg"
            alt="Shoes"
            width={90}
            height={90}
            className="h-[90px] w-[90px] object-contain"
          />
        </FloatingElement>

        <FloatingElement className="absolute bottom-40 right-10 rotate-20" yOffset={4} duration={3} delay={0.5}>
          <Image
            src="/img/sparkles.png"
            alt="ornament"
            width={20}
            height={20}
            className="object-contain"
          />
        </FloatingElement>
      </AnimatedSection>
    </div>
  )
}
