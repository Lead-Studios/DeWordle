import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google"
import "./globals.css"
import Footer from "../components/footer" 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "DeWordle",
  description: "A decentralized word guessing game",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen antialiased">
        <main className="flex-grow">{children}</main>
        {/* footerpage */}
        <Footer />
      </body>
    </html>
  )
}

