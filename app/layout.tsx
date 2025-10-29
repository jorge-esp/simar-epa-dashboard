import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import ClientLayout from "./client-layout"
import "./globals.css"

export const metadata: Metadata = {
  title: "SIMAR-EPA | Sistema de Información Marítima",
  description: "Sistema de Información Marítima - Empresa Portuaria Arica",
  generator: "v0.app",
  icons: {
    icon: "/images/puerto-arica-logo.png",
    shortcut: "/images/puerto-arica-logo.png",
    apple: "/images/puerto-arica-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
