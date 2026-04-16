import Image from "next/image"
import { IconCopy } from "@tabler/icons-react"

export default function GiftSection() {
  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Heading */}
      <h2
        className="text-center text-4xl leading-tight tracking-wide text-primary font-bold"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Wedding
        <br />
        Gift
      </h2>

      {/* Gift message paragraph 1 */}
      <p
        className="mt-6 max-w-xs text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Your presence is the most meaningful gift of all.
        But if you&apos;d like to give something extra, we kindly prefer
        cash gifts to help us begin our next chapter together.
      </p>

      {/* Bank Card - Ticket style */}
      <div className="relative mt-8 w-full max-w-[260px]">
        {/* Ticket shape with dashed border */}
        <div
          className="relative overflow-hidden rounded-lg border-2 border-dashed border-[#9e0e00]/30 bg-[#f5f0ea] px-5 py-5"
        >
          {/* Left cutout */}
          <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f5f0ea] ring-2 ring-dashed ring-[#9e0e00]/30" />
          {/* Right cutout */}
          <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-[#f5f0ea] ring-2 ring-dashed ring-[#9e0e00]/30" />

          {/* BCA Logo */}
          <div className=" flex">
            <Image
              src="/img/logo-jago.png"
              alt="bank"
              width={200}
              height={200}
              className="h-[20px] w-auto object-contain"
            />
          </div>

          {/* Account Number */}
          <p
            className="text-lg tracking-widest"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            1122334455
          </p>

          {/* Separator */}
          <div className="my-3 border-t border-dashed border-[#9e0e00]/30" />

          {/* Account Name + Copy */}
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Account name:
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Aden Anteng
              </p>
            </div>
            <button
              className="flex items-center rounded bg-primary px-3 py-1 text-xs text-white transition-opacity active:opacity-70"
              style={{ fontFamily: "var(--font-heading)" }}
              onClick={() => handleCopy("1122334455")}
            >
              <IconCopy
                size={10}
                className="mr-1"
              />
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp message */}
      <p
        className="mt-8 max-w-xs text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Thinking of sending a gift? Just drop us a message on
        WhatsApp first and we&apos;ll share our address with you!
      </p>

      {/* WhatsApp Button */}
      <button
        className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all hover:bg-white hover:text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Contact Us
      </button>
    </div>
  )
}
