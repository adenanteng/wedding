import { Gloria_Hallelujah, Caveat, Patrick_Hand } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
});

const fontSans = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
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
        caveat.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
