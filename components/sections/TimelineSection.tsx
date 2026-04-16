import Image from "next/image"

export default function TimelineSection() {
  return (
    <div className="relative flex w-full flex-col items-center px-6 pb-16">
      {/* Candle Illustration */}
      <Image
        src="/img/5.svg"
        alt="Candle"
        width={100}
        height={100}
        className="h-[100px] w-[100px] object-contain"
      />

      {/* Timeline Schedule */}
      <div className="mt-4 w-full max-w-xs">
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
              Wedding Ceremony
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
              Reception
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
      </div>

      {/* Shoes/Heels Illustration - bottom right */}
      <div className="relative w-full">
        <div className="absolute -top-15 left-0">
          <Image
            src="/img/7.svg"
            alt="Shoes"
            width={90}
            height={90}
            className="h-[90px] w-[90px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
