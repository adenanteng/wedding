import Image from "next/image"
import { IconCopy } from "@tabler/icons-react"
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card"

const bankCards = [
  {
    bankName: "BSI",
    accountName: "Aden Anteng",
    accountNumber: "1234567890",
    logo: "/img/logo-bsi.png",
    rotate: -4,
  },
  {
    bankName: "Mandiri",
    accountName: "Rahma Cahya",
    accountNumber: "0987654321",
    logo: "/img/logo-mandiri.png",
    rotate: 3,
  },
  {
    bankName: "Seabank",
    accountName: "Rahma Cahya",
    accountNumber: "5544332211",
    logo: "/img/logo-seabank.png",
    rotate: -2,
  },
  {
    bankName: "Jago",
    accountName: "Aden Anteng",
    accountNumber: "1122334455",
    logo: "/img/logo-jago.png",
    rotate: 2,
  },
]

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
      <DraggableCardContainer className="relative mt-8 flex h-[220px] w-full max-w-[260px] items-center justify-center">
        <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black font-dancing">
          Sudah habis kak..
        </p>

        {bankCards.map((card, index) => (
          <div
            key={index}
            className="absolute inset-0 origin-center pointer-events-none"
            style={{ transform: `rotate(${card.rotate}deg)` }}
          >
            <DraggableCardBody
              className="pointer-events-auto m-0! min-h-0! w-full! max-w-[260px]! bg-transparent! p-0! shadow-none! rounded-none!"
            >
              {/* Ticket shape with dashed border */}
              <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-[#9e0e00]/30 bg-[#f5f0ea] px-5 py-5 shadow-lg transition-transform cursor-grab active:cursor-grabbing">
                {/* Left cutout */}
                <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-white ring-2 ring-dashed ring-[#9e0e00]/30" />
                {/* Right cutout */}
                <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-white ring-2 ring-dashed ring-[#9e0e00]/30" />

                {/* Logo or Bank Name */}
                <div className="flex h-[20px] items-center">
                  {card.logo ? (
                    <Image
                      src={card.logo}
                      alt={card.bankName}
                      width={200}
                      height={200}
                      draggable={false}
                      className="pointer-events-none h-full w-auto object-contain select-none"
                    />
                  ) : (
                    <span className="font-bold text-primary select-none">{card.bankName}</span>
                  )}
                </div>

                {/* Account Number */}
                <p
                  className="mt-2 text-lg tracking-widest select-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {card.accountNumber}
                </p>

                {/* Separator */}
                <div className="my-3 border-t border-dashed border-[#9e0e00]/30" />

                {/* Account Name + Copy */}
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="text-xs text-gray-600 select-none"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Account name:
                    </p>
                    <p
                      className="text-sm font-semibold select-none"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {card.accountName}
                    </p>
                  </div>
                  <button
                    className="flex items-center rounded bg-primary px-3 py-1 text-xs text-white transition-opacity active:opacity-70"
                    style={{ fontFamily: "var(--font-heading)" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(card.accountNumber);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <IconCopy size={12} className="mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            </DraggableCardBody>
          </div>
        ))}
      </DraggableCardContainer>

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
