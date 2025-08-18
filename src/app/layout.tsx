import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "ErgoSanitas | Plataforma Nutricional Deportiva",
  description: "Plataforma especializada en nutrición deportiva para atletas juveniles basada en el modelo ABCD de evaluación nutricional",
  keywords: "nutrición deportiva, atletas juveniles, evaluación ABCD, antropometría, bioquímica, clínica, dietética",
  authors: [{ name: "ErgoSanitas Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1a73e8" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
