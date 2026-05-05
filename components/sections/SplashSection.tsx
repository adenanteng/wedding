import Image from "next/image"
import { FloatingElement } from "@/components/ui/floating-element"
import { AnimatedText } from "../ui/animated-text"
import { Loader2 } from "lucide-react"
import { EndlessBouncingText } from "../ui/endless-bouncing-text"

interface SplashSectionProps {
  isOpen: boolean
  onOpen: () => void
  guestName?: string
  isLoadingGuest?: boolean
}

export default function SplashSection({ isOpen, onOpen, guestName = "", isLoadingGuest = false }: SplashSectionProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-700 ${isOpen ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
    >
      <div className="relative flex w-full max-w-md flex-col items-center px-6">
        {/* Ring decoration - top left */}
        <FloatingElement className="absolute top-0 left-16 -rotate-20" duration={3}>
          <Image
            src="/img/ring.png"
            alt="Ring"
            width={60}
            height={60}
            className="h-[60px] w-[60px] object-contain"
          />
        </FloatingElement>

        <FloatingElement className="absolute top-26 right-10 -rotate-20" duration={4} delay={0.5}>
          <Image
            src="/img/tie.png"
            alt="Tie"
            width={60}
            height={60}
            className="h-[60px] w-[60px] object-contain"
          />
        </FloatingElement>

        {/* Confetti decoration */}
        <FloatingElement className="absolute top-47" duration={5} yOffset={8}>
          <Image
            src="/img/2.png"
            alt="Confetti"
            width={100}
            height={40}
            className="h-auto w-[100px] object-contain"
          />
        </FloatingElement>

        <div className="-rotate-5">
          <FloatingElement yOffset={10} duration={3}>
            <EndlessBouncingText
              as="h1"
              text={"These Kids\nAre Getting\nMarried"}
              className="font-chewy font-bold text-4xl text-center leading-[1.2] tracking-widest text-primary uppercase"
            />
          </FloatingElement>
        </div>

        {/* Couple Photo */}
        <div className="relative mt-20">
          {/* Photo with hand-drawn frame */}
          <div className="relative ml-8">
            <Image
              src="/img/1.png"
              alt="Hand-drawn frame"
              width={250}
              height={370}
              className="pointer-events-none relative z-10 h-auto w-[230px]"
            />

            <div className="absolute top-1 left-6">
              <Image
                src="/img/kid-square-aden.jpeg"
                alt="Aden kid"
                width={75}
                height={75}
                className="h-[75px] w-[75px] object-contain"
              />
            </div>

            <div className="absolute top-1 right-10">
              <Image
                src="/img/kid-square-rahma.jpeg"
                alt="Rahma kid"
                width={75}
                height={75}
                className="h-[75px] w-[75px] object-contain"
              />
            </div>
          </div>

          {/* Sparkles decoration */}
          <FloatingElement className="absolute -left-5 top-10" duration={2} yOffset={6}>
            <Image
              src="/img/sparkles.png"
              alt="Sparkles"
              width={30}
              height={30}
              className="h-auto w-[30px] object-contain"
            />
          </FloatingElement>

          <FloatingElement className="absolute -right-10 bottom-10" duration={3} delay={0.2} yOffset={6}>
            <Image
              src="/img/sparkles.png"
              alt="Sparkles"
              width={30}
              height={30}
              className="h-auto w-[30px] object-contain"
            />
          </FloatingElement>
        </div>

        {/* Names */}
        <div className="mt-6 flex h-8 items-center justify-center">
          {isLoadingGuest ? (
            <div className="h-6 w-40 animate-pulse rounded-md bg-primary/20"></div>
          ) : (
            <h2
              className="text-center text-2xl tracking-wide"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {guestName}
            </h2>
          )}
        </div>

        {/* Date */}
        <p
          className="mt-1 text-center text-xl tracking-widest"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          15.06.26
        </p>

        {/* Open Invitation Button */}
        <button
          onClick={onOpen}
          disabled={isLoadingGuest}
          className="mt-8 flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all hover:enabled:bg-white hover:enabled:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isLoadingGuest ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Tunggu Sebentar...</span>
            </>
          ) : (
            "Buka Undangan"
          )}
        </button>
      </div>
    </div>
  )
}
