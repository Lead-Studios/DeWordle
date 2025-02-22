"use client";

import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/footer";
import { metadata } from "./metadata";
import { ThemeProvider } from "../context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
          <meta name="title" content={metadata.title} />
          <meta name="description" content={metadata.description} />
        </head>
        <body className="flex flex-col min-h-screen antialiased">
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}
