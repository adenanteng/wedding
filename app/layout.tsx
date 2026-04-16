import { Gloria_Hallelujah, Caveat, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const gloriaHallelujah = Gloria_Hallelujah({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
