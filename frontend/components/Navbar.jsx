"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DewordleIcon from "@/assets/dewordleIcon.svg";
import {
  BarChartIcon,
  Settings as SettingsIcon,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown
} from "lucide-react";
import { HelpGuide } from "./HelpGuide";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileButtonRef = useRef(null);
  const router = useRouter();

  const user = {
    name: "John Stones",
    email: "johnstones1@gmail.com",
    avatar: "/avatar.jpg" 
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation handlers
  const handleNavigation = (path) => {
    setIsProfileOpen(false);
    router.push(path);
  };

  return (
    <div className="navbar bg-white shadow-md h-[70px]">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 lg:px-14">
        {/* Navbar Start: Dewordle Logo */}
        <div className="navbar-start flex items-center">
          <Link href="/" className="flex items-center">
            <Image src={DewordleIcon} alt="logo" width={147} height={44} quality={90}/>
          </Link>
        </div>

        {/* Navbar End: User Profile and Help */}
        <div className="navbar-end flex items-center gap-x-12 mt-4">
          {/* User Profile Button */}
          <div className="relative">
            <button 
              ref={profileButtonRef}
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 text-[#29296E] font-medium"
            >
              <div className="w-8 h-8 rounded-full  overflow-hidden flex items-center justify-center border-2 border-[#29296E]">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={32} 
                    height={32} 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-[#29296E]">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Hi John</span>
              <ChevronDown size={16} />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div 
                ref={dropdownRef}
                className="absolute -right-20 mt-2 bg-white rounded-lg shadow-lg py-4 z-50 w-[20rem]"
              >
                {/* Profile Info */}
                <div className="flex flex-col items-center justify-center px-4 py-4">
                  <div className="w-20 h-20 rounded-full  overflow-hidden flex items-center justify-center border-4 border-[#29296E] mb-2">
                    {user.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={80} 
                        height={80} 
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-medium text-[#29296E]">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center">{user.name}</h3>
                  <p className="text-sm text-gray-500 text-center">{user.email}</p>
                  
                  <button 
                    onClick={() => handleNavigation('/profile')}
                    className="w-full mt-3 py-2 bg-[#29296E] text-white font-medium rounded-full"
                  >
                    View Profile
                  </button>
                </div>

                {/* Menu Items */}
                <div className="mt-2">
                  <button 
                    onClick={() => handleNavigation('/setting')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 bg-gray-100"
                  >
                    <SettingsIcon size={18} className="text-[#29296E]" />
                    <span>Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/stats')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <BarChartIcon size={18} className="text-[#29296E]" />
                    <span>Stats</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/notifications')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <Bell size={18} className="text-[#29296E]" />
                    <span>Notifications</span>
                  </button>
                  
                  <div className="mt-12">
                    <button 
                      onClick={() => handleNavigation('/logout')}
                      className="w-full px-4 py-2 text-left flex items-center gap-3"
                    >
                      <LogOut size={18} className="text-[#29296E]" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button 
            onClick={() => setIsHelpGuideOpen(true)}
            className="flex items-center text-[#29296E]"
          >
            <HelpCircle size={24} />
            <span className="ml-1 hidden sm:inline">Help</span>
          </button>

          {/* Connect Button */}
          <button className="bg-[#29296E] w-[150px] h-[39px] text-white text-sm font-semibold rounded-full flex items-center justify-center transform transition-transform hover:scale-110 hover:shadow-lg">
                Connect
              </button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="btn btn-square btn-ghost text-[#29296E]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Help Guide Modal */}
        <HelpGuide
          isOpen={isHelpGuideOpen}
          onClose={() => setIsHelpGuideOpen(false)}
        />
      </div>
    </div>
  );
};

export default Navbar;