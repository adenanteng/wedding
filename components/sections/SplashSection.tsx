import Image from "next/image"
import { FloatingElement } from "@/components/ui/floating-element"
import { AnimatedText } from "../ui/animated-text"

interface SplashSectionProps {
  isOpen: boolean
  onOpen: () => void
  guestName?: string
}

export default function SplashSection({ isOpen, onOpen, guestName = "" }: SplashSectionProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-700 ${
        isOpen ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
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

        {/* Heading */}
        {/* <h1
          className="relative z-10 mt-8 text-center text-4xl font-bold leading-[1.1] tracking-wide text-primary uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          These Kids
          <br />
          Are Getting
          <br />
          Married
        </h1> */}

        <AnimatedText
          text={"These Kids\nAre Getting\nMarried"}
          className="relative z-10 mt-8 text-center text-4xl font-bold leading-[1.1] tracking-wide text-primary uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
          delay={0.1}
        />

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
        <h2
          className="mt-6 text-center text-2xl tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {guestName}
        </h2>

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
          className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all hover:bg-white hover:text-primary"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Open Invitation
        </button>
      </div>
    </div>
  )
}
