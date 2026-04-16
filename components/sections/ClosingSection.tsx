import Image from "next/image"
import { useCountdown } from "@/hooks/useCountdown"

const WEDDING_TIMESTAMP = new Date("2026-06-15T08:00:00+07:00").getTime()

export default function ClosingSection() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_TIMESTAMP)

  return (
    <div className="relative flex w-full flex-col overflow-hidden px-6 pt-10 pb-16">
      <div className="flex w-full items-start gap-4">
        {/* Left side: heading + countdown */}
        <div className="flex flex-1 flex-col">
          {/* OUR BIG DAY AWAITS */}
          <h2
            className="text-3xl font-bold leading-tight tracking-wide text-primary uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Big Day
            <br />
            Awaits
          </h2>

          {/* Countdown Timer */}
          <div className="mt-6 flex items-baseline gap-1">
            <div className="flex flex-col items-center">
              <span
                className="text-3xl tabular-nums text-[#9e0e00]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(days).padStart(2, "0")}
              </span>
              <span
                className="mt-1 text-[9px] uppercase tracking-widest text-primary"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Days
              </span>
            </div>
            <span
              className="mb-4 text-2xl text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className="text-3xl tabular-nums text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(hours).padStart(2, "0")}
              </span>
              <span
                className="mt-1 text-[9px] uppercase tracking-widest text-primary"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Hours
              </span>
            </div>
            <span
              className="mb-4 text-2xl text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className="text-3xl tabular-nums text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(minutes).padStart(2, "0")}
              </span>
              <span
                className="mt-1 text-[9px] uppercase tracking-widest text-primary"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Minutes
              </span>
            </div>
            <span
              className="mb-4 text-2xl text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              :
            </span>
            <div className="flex flex-col items-center">
              <span
                className="text-3xl tabular-nums text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {String(seconds).padStart(2, "0")}
              </span>
              <span
                className="mt-1 text-[9px] uppercase tracking-widest text-primary"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                Seconds
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Right side: Photo booth strip */}
          <div className="absolute right-0 -bottom-106 -rotate-10 flex w-[120px] flex-col gap-1 border-4 border-primary bg-primary shadow-lg">
            <div className="h-[120px] w-full overflow-hidden p-1">
              <Image
                src="/img/couple1.jpeg"
                alt="Couple photo 1"
                width={200}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-[120px] w-full overflow-hidden p-1">
              <Image
                src="/img/couple2.jpeg"
                alt="Couple photo 2"
                width={200}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-[120px] w-full overflow-hidden p-1">
              <Image
                src="/img/couple3.jpeg"
                alt="Couple photo 3"
                width={200}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SEE YOU ON DATE */}
      <h2
        className="mt-16 text-3xl font-bold leading-tight tracking-wide text-primary uppercase"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        See You
        <br />
        On 15.06.26
      </h2>

      {/* Couple Names */}
      <p
        className="mt-4 text-2xl tracking-wide text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Aden & Rahma
      </p>
    </div>
  )
}
