import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Air Quality Monitor - Environmental Dashboard",
  description:
    "Real-time air quality monitoring and environmental data analysis dashboard with interactive charts and live updates",
  generator: "v0.app",
  keywords: ["air quality", "environmental monitoring", "dashboard", "real-time data", "analytics"],
  authors: [{ name: "Air Quality Monitor Team" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">{children}</body>
    </html>
  )
}
