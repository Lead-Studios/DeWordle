"use client"
import Link from "next/link"
import Copywrite from "./Copywrite"
// update code to implement corrections
export default function Footer() {
  return (
    <footer className="bg-[#282c34] text-white/90 py-2 px-1 sm:py-4 sm:px-6 min-w-[280px]">
      <div className="container mx-auto max-w-[280px] sm:max-w-none px-1">
        <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[9px] xxs:text-[10px] xs:text-xs sm:text-sm text-center">
         <Copywrite/>
          <span aria-hidden="true">|</span>
          <Link href="#" className="hover:text-white transition-colors whitespace-nowrap" aria-label="View Sitemap">
            Sitemap
          </Link>
          update code 
          <span aria-hidden="true">|</span>
          <Link
            href="#"
            className="hover:text-white transition-colors whitespace-nowrap"
            aria-label="View Privacy Policy"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true">|</span>
          <Link
            href="#"
            className="hover:text-white transition-colors whitespace-nowrap"
            aria-label="View Terms of Service"
          >
            Terms of Service
          </Link>
          <span aria-hidden="true">|</span>
          <Link
            href="#"
            className="hover:text-white transition-colors whitespace-nowrap"
            aria-label="View Terms of Sale"
          >
            Terms of Sale
          </Link>
          <span aria-hidden="true">|</span>
          <button
            className="hover:text-white transition-colors whitespace-nowrap"
            aria-label="Manage Privacy Preferences"
          >
            Manage Privacy Preferences
          </button>
        </nav>
      </div>
    </footer>
  )
}

