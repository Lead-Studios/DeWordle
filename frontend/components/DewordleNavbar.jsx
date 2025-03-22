"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DewordleIcon from "@/assets/dewordleIcon.svg";
import { ChevronDown, Menu, X } from "lucide-react";
import HowToPlayModal from "./HowToPlayModal";
import Link from "next/link";

const NavbarLandingPage = () => {
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const helpGuideRef = useRef(null);

  // Toggle "How to Play" dropdown
  const toggleHelpGuide = () => {
    setIsHelpGuideOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        helpGuideRef.current &&
        !helpGuideRef.current.contains(event.target)
      ) {
        setIsHelpGuideOpen(false);
      }
    };

    // Add event listener only when modal is open
    if (isHelpGuideOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHelpGuideOpen]); // ✅ Ensures stable dependencies (Fixes React error)

  return (
    <div className="w-full bg-white shadow-md h-[70px] fixed top-0 left-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 lg:px-14">
        {/* Logo */}
        <div className="flex items-center relative">
          <Image
            src={DewordleIcon}
            alt="Dewordle icon"
            width={150}
            height={100}
            className="flex-shrink-0"
          />

          {/* How to Play Dropdown */}
          <div className="relative ml-4 md:ml-8" ref={helpGuideRef}>
            <button
              onClick={toggleHelpGuide}
              className="flex items-center gap-1 text-[#29296E] font-semibold focus:outline-none"
            >
              How to play
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isHelpGuideOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isHelpGuideOpen && (
              <HowToPlayModal
                isOpen={isHelpGuideOpen}
                onClose={toggleHelpGuide}
              />
            )}
          </div>
        </div>

        {/* Desktop Menu (Visible on Large Screens) */}
        <div className="hidden md:flex items-center gap-6 text-[#29296E]">
          <Link href="/game-guide">
            <button className="text-[#29296E] py-2">Game Guide</button>
          </Link>
          <Link href="/signup">
            <button className="text-[#29296E]">Sign Up</button>
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#29296E] focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (Visible on Small Screens) */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg py-4 z-50 flex flex-col items-center md:hidden">
          <Link href="/game-guide">
            <button className="text-[#29296E] py-2">Game Guide</button>
          </Link>
          <Link href="/signup">
            <button className="text-[#29296E] py-2">Sign Up</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavbarLandingPage;
