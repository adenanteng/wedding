import { Chewy, Gloria_Hallelujah, Great_Vibes, Patrick_Hand } from "next/font/google";

import { ConsoleGreeting } from "@/components/console-greeting";
import { Toaster } from "@/components/ui/sonner";
import { MusicProvider } from "@/context/MusicContext";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading-next',
});

const chewy = Chewy({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-chewy-next',
});

const fontSans = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans-next",
})

const great_vibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes-next',
})

export const metadata: Metadata = {
  title: "Aden & Rahma",
  description: "Invitation to our wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        gloriaHallelujah.variable,
        chewy.variable,
        great_vibes.variable
      )}
    >
      <body>
        <ConsoleGreeting />
        <MusicProvider>
          {children}
          <Toaster />
        </MusicProvider>
      </body>
    </html>
  )
}
