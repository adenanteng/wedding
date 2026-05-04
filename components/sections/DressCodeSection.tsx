import { AnimatedSection } from "@/components/ui/animated-section"
import { AnimatedText } from "../ui/animated-text"

export default function DressCodeSection() {
  return (
    <div className="relative flex w-full flex-col items-center px-6 pt-10 pb-16">
      <AnimatedSection className="flex w-full flex-col items-center" delay={0.1}>
        <h2
          className="text-center text-4xl leading-tight tracking-wide text-primary font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          The attire
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <AnimatedText
          className="mt-6 max-w-xs text-center text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
          text="Kami meminta Anda untuk mengenakan warna-warna berikut di acara spesial kami"
        />
      </AnimatedSection>

      {/* Color Palette */}
      <AnimatedSection delay={0.3}>
        <div className="flex -space-x-4 mt-4 justify-center items-center">
          <div className="h-16 w-16 rounded-full bg-white shadow-md border-4 border-background relative z-10" title="White" />
          <div className="h-16 w-16 rounded-full shadow-md border-4 border-background relative z-20" style={{ backgroundColor: "#EAE3D2" }} title="Cream" />
          <div className="h-16 w-16 rounded-full shadow-md border-4 border-background relative z-30" style={{ backgroundColor: "#DDC1A4" }} title="Khaki" />
          <div className="h-16 w-16 rounded-full shadow-md border-4 border-background relative z-40" style={{ backgroundColor: "#A09D82" }} title="Olive" />
        </div>
        <p className="text-center text-xs font-semibold mt-1 mb-4 tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
          White • Cream • Khaki • Olive
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <AnimatedText
          className="max-w-xs text-center text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-heading)" }}
          text="Anda bisa memadupadankan warna-warna ini atau memilih satu warna saja."
        />
      </AnimatedSection>
    </div>
  )
}
