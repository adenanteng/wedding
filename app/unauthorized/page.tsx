import Image from "next/image"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f5f0ea] p-6 text-center text-primary">
      {/* Decorative Ornament */}
      <div className="mb-6">
        <Image
          src="/img/couple.jpeg"
          alt="Shoes Ornament"
          width={300}
          height={300}
          className="h-auto w-64 object-contain rounded-3xl border-2"
        />
      </div>

      <div className="relative">
        <h1
          className="text-4xl font-bold tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Oops!
        </h1>
        <div className="mt-4 flex flex-col gap-2">
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Undangan tidak ditemukan
          </p>
          <p
            className="text-sm opacity-70"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Silakan cek kembali link undangan Anda <br /> atau hubungi mempelai.
          </p>
        </div>

        {/* Ornament at bottom */}
        <div className="mt-10 opacity-30">
          <Image
            src="/img/sparkles.png"
            alt="Sparkles"
            width={40}
            height={40}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute -left-10 top-20 -rotate-12">
          <Image src="/img/ring.png" alt="" width={200} height={200} />
        </div>
        <div className="absolute -right-10 bottom-20 rotate-12">
          <Image src="/img/tie.png" alt="" width={200} height={200} />
        </div>
      </div>
    </div>
  )
}
