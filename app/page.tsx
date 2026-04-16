"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { IconCopy } from "@tabler/icons-react"

const WEDDING_TIMESTAMP = new Date("2026-06-15T08:00:00+07:00").getTime()

function useCountdown(targetTimestamp: number) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const diff = targetTimestamp - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetTimestamp])

  return timeLeft
}

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_TIMESTAMP)

  // Lock body scroll while splash/cover modal is visible
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* ===== SPLASH / COVER MODAL ===== */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-all duration-700 ${isOpen ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <div className="relative flex w-full max-w-md flex-col items-center px-6">
          {/* Ring decoration - top left */}
          <div className="absolute top-0 left-16 -rotate-20">
            <Image
              src="/img/ring.png"
              alt="Ring"
              width={60}
              height={60}
              className="h-[60px] w-[60px] object-contain"
            />
          </div>

          <div className="absolute top-26 right-10 -rotate-20">
            <Image
              src="/img/tie.png"
              alt="Tie"
              width={60}
              height={60}
              className="h-[60px] w-[60px] object-contain"
            />
          </div>

          {/* Confetti decoration */}
          <Image
            src="/img/2.png"
            alt="Confetti"
            width={100}
            height={40}
            className="absolute top-42 object-contain"
          />

          {/* Heading */}
          <h1
            className="relative z-10 mt-8 text-center text-4xl font-bold leading-[1.1] tracking-wide text-primary uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            These Kids
            <br />
            Are Getting
            <br />
            Married
          </h1>

          {/* Couple Photo */}
          <div className="relative mt-16">
            {/* Photo with hand-drawn frame */}
            <div className="relative">
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
                  alt="Tie"
                  width={75}
                  height={75}
                  className="h-[75px] w-[75px] object-contain"
                />
              </div>

              <div className="absolute top-1 right-10">
                <Image
                  src="/img/kid-square-rahma.jpeg"
                  alt="Tie"
                  width={75}
                  height={75}
                  className="h-[75px] w-[75px] object-contain"
                />
              </div>
            </div>

            {/* Sparkles decoration */}
            <Image
              src="/img/sparkles.png"
              alt="Sparkles"
              width={30}
              height={30}
              className="absolute -right-10 bottom-10 object-contain"
            />
          </div>

          {/* Names */}
          <h2
            className="mt-6 text-center text-2xl tracking-wide"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aden & Rahma
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
            onClick={() => setIsOpen(true)}
            className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Open Invitation
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative mx-auto flex min-h-svh max-w-md flex-col items-center overflow-hidden">
        {/* ===== SAVE THE DATE HEADING ===== */}
        <div className="relative z-10 pt-10 pb-2 text-center">
          <h1
            className="font-heading text-5xl leading-[1.15] tracking-wide text-[#9e0e00] uppercase"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Save
            <br />
            The
            <br />
            Date!
          </h1>
        </div>

        {/* ===== HAND-DRAWN ILLUSTRATION (tali love) ===== */}
        <div className="relative z-0 -mt-6 w-full px-0">
          <Image
            src="/img/3.svg"
            alt="Hand-drawn illustration of two hands holding a string of love"
            width={600}
            height={300}
            className="h-auto w-full object-contain"
            priority
          />
        </div>

        {/* ===== COUPLE NAMES ===== */}
        <div className="z-10 -mt-2 text-center">
          <h2
            className="text-3xl tracking-wide text-primary font-bold"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            Aden & Rahma
          </h2>
        </div>

        {/* ===== QURAN VERSE ===== */}
        <div className="mt-6 max-w-xs px-6 text-center">
          <p
            className="text-base leading-relaxed"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            And one of His signs is that He created for you spouses from among
            yourselves so that you may find comfort in them. And He has placed
            between you compassion and mercy. Surely in this are signs for people
            who reflect.
          </p>
          <p
            className="mt-4 text-sm tracking-wider"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            Surah Ar-Rum 21
          </p>
        </div>

        {/* ===== MUSIC PLAYER ===== */}
        <div className="mt-8 w-full max-w-[280px] px-4">
          <div className="overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-xl">
            {/* Album Art / Couple Photo */}
            <div className="relative flex items-center gap-3 p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#2a2a2a]">
                <Image
                  src="/img/kid-square-rahma.jpeg"
                  alt="Couple photo"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center overflow-hidden">
                {/* Progress bar */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">01:10</span>
                  <div className="relative h-1 flex-1 rounded-full bg-[#333]">
                    <div className="absolute top-0 left-0 h-full w-[30%] rounded-full bg-[#9e0e00]" />
                    <div className="absolute top-1/2 left-[30%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" />
                  </div>
                  <span className="text-[10px] text-gray-400">04:10</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5 px-4 pb-4 pt-1">
              {/* Repeat */}
              <button className="text-gray-400 transition-colors hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </button>

              {/* Previous */}
              <button className="text-white transition-colors hover:text-gray-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Play */}
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-lg transition-transform hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* Next */}
              <button className="text-white transition-colors hover:text-gray-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18h2V6h-2zM6 18l8.5-6L6 6z" />
                </svg>
              </button>

              {/* Shuffle */}
              <button className="text-gray-400 transition-colors hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ===== FOOTER TEXT ===== */}
        <p
          className="mt-6 mb-10 text-center text-sm"
          style={{ fontFamily: "var(--font-handwritten)" }}
        >
          Click play button to listen our song..
        </p>

        {/* ===== SECTION 2: BRIDE & GROOM ===== */}
        <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
          {/* Invitation Text */}
          <p
            className="max-w-xs text-center text-base leading-relaxed"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            Together with our family, we invite you
            <br />
            to join us in our wedding vows.
          </p>

          {/* Bride & Groom Heading */}
          <h2
            className="mt-8 text-3xl tracking-wide text-primary font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bride & Groom
          </h2>

          {/* Couple Photo with Hand-drawn Frame */}
          <div className="relative mt-6 flex items-center justify-center">
            {/* Frame SVG */}
            <Image
              src="/img/4.svg"
              alt="Hand-drawn ornate frame"
              width={300}
              height={440}
              className="pointer-events-none relative z-10 h-auto w-[280px]"
            />
            {/* Couple Photo inside frame */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="mt-2 p-3 overflow-hidden">
                <Image
                  src="/img/couple.jpeg"
                  alt="Couple photo"
                  width={380}
                  height={520}
                  className="h-full w-full object-cover rounded-4xl border"
                />
              </div>
            </div>
          </div>

          {/* Groom Name */}
          <h3
            className="mt-8 text-2xl tracking-wide text-primary font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aden Anteng Anugrah
          </h3>
          <p
            className="mt-3 max-w-xs text-center text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The beloved first son of
            <br />
            Mr. Enyang Suandi and
            <br />
            Mrs. Kakai
          </p>

          {/* Separator */}
          <p
            className="mt-8 text-3xl text-primary font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            &
          </p>

          {/* Bride Name */}
          <h3
            className="mt-4 text-2xl tracking-wide text-primary font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Rahma Cahya Malinda
          </h3>
          <p
            className="mt-3 max-w-xs text-center text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The beloved first daughter of
            <br />
            Mr. Ahmad Ansori and
            <br />
            Mrs. Rinawati
          </p>
        </div>

        {/* ===== SECTION 3: SAVE THE DATE EVENT ===== */}
        <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
          {/* Disco Ball + Save The Date */}
          <div className="flex w-full max-w-xs items-start justify-between gap-2">
            {/* Disco Ball */}
            <div className="w-[120px] shrink-0">
              <Image
                src="/img/disco.png"
                alt="Disco ball illustration"
                width={240}
                height={240}
                className="h-auto w-full object-contain -rotate-5"
              />
            </div>
            {/* Save The Date text */}
            <h2
              className="text-center text-5xl tracking-wide text-primary font-bold uppercase rotate-10"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Save
              <br />
              The
              <br />
              Date!
            </h2>
          </div>

          {/* Calendar Section */}
          <div className="mt-8 flex w-[calc(100%+5rem)] -mx-10 items-stretch -rotate-5">
            {/* Saturday */}
            <div className="flex flex-1 flex-col items-center border-y-2 border-l-2 border-primary">
              <span
                className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Minggu
              </span>
              <span
                className="mt-1 text-5xl text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                14
              </span>
            </div>

            {/* Sunday (D-day) */}
            <div className="relative flex flex-1 flex-col items-center border-2 border-r-2 border-primary pb-5">
              <span
                className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Senin
              </span>
              <span
                className="mt-1 text-5xl text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                15
              </span>
              {/* Circle around D-day */}
              <div className="absolute top-10 right-10">
                <Image
                  src="/img/circle.svg"
                  alt="Tie"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] object-contain"
                />
              </div>
              <span
                className="absolute top-22 right-5 text-sm font-bold text-primary -rotate-10"
                style={{ fontFamily: "var(--font-handwritten)" }}
              >
                D-day !!
              </span>
            </div>

            {/* Monday */}
            <div className="flex flex-1 flex-col items-center border-y-2 border-r-2 border-primary">
              <span
                className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Selasa
              </span>
              <span
                className="mt-1 text-5xl text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                16
              </span>
            </div>
          </div>


          {/* Wedding Intimate Party */}
          <h3
            className="mt-10 text-center text-3xl tracking-wide text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Wedding Party
          </h3>

          {/* Event Details */}
          <div
            className="mt-5 text-center text-sm leading-relaxed0"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <p>Sunday, 15 Juni 2026</p>
            <p>09.00 WIB</p>
            <p className="mt-2">di Mana mana</p>
            <p>Jl. Kemang Timur No.89, Bangka, Kec.</p>
            <p>Mampang Prpt., Kota Metro</p>
          </div>

          {/* See Location Button */}
          <button
            // onClick={() => setIsOpen(true)}
            className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            See Location
          </button>
        </div>

        {/* ===== SECTION 4: EVENT TIMELINE ===== */}
        <div className="relative flex w-full flex-col items-center px-6 pb-16">
          {/* Candle Illustration */}
          <Image
            src="/img/5.svg"
            alt="Tie"
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
            <div className="absolute -top-15 right-0">
              <Image
                src="/img/6.svg"
                alt="Tie"
                width={80}
                height={80}
                className="h-[80px] w-[80px] object-contain"
              />
            </div>
          </div>
        </div>

        {/* ===== SECTION 5: WEDDING GIFT ===== */}
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
                  className="flex items-center rounded bg-primary px-3 py-1 text-xs text-white transition-opacity"
                  style={{ fontFamily: "var(--font-heading)" }}
                  onClick={() => {
                    if (typeof navigator !== "undefined") {
                      navigator.clipboard.writeText("1122334455")
                    }
                  }}
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
            // onClick={() => setIsOpen(true)}
            className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lorem ipsum
          </button>
        </div>

        {/* ===== SECTION 6: COUNTDOWN & CLOSING ===== */}
        <div className="relative flex w-full flex-col px-6 pt-10 pb-16">
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

          {/* SEE YOU ON 8.8.26 */}
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
      </div>
    </>
  )
}
