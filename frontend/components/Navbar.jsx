
"use client"

import React, { useState } from "react"
import Image from "next/image"
import DewordleIcon from "../assets/dewordleIcon.svg"
import { BarChartIcon as ChartNoAxesColumn, Settings, CircleHelp } from "lucide-react"
import LeaderBoardModal from "./LeaderBoardModal"
import { HelpGuide } from "./HelpGuide"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="navbar bg-[#FAF7F7] shadow-md h-[70px]">
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 lg:px-14">
        {/* Navbar Start: Dewordle Icon */}
        <div className='navbar-start flex items-center'>
          <Image
            src={DewordleIcon}
            alt='Dewordle icon'
            width={200}
            height={150}
            className='flex-shrink-0'
          />
        </div>

        {/* Navbar End: Icons and Connect Button */}
        <div className='navbar-end hidden md:flex items-center gap-6'>
          {/* Icons */}
          <button onClick={() => setIsLeaderBoardOpen(true)}>
            <ChartNoAxesColumn
              color='#29296E'
              size={24}
              className='hover:scale-110 hover:shadow-lg transition-transform'
            />
          </button>
          <button onClick={() => setIsSettingsOpen(true)}>
            <Settings
              color='#29296E'
              size={24}
              className='hover:scale-110 hover:shadow-lg transition-transform'
            />
          </button>

          <CircleHelp
            color='#29296E'
            size={24}
            className='hover:scale-110 hover:shadow-lg transition-transform'
          />

          {/* Connect Button */}
          <button className='bg-[#29296E] w-[150px] h-[39px] text-white text-sm font-semibold rounded-[15px] flex items-center justify-center transform transition-transform hover:scale-110 hover:shadow-lg'>
            Connect
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="btn btn-square btn-ghost text-[#29296E]">

            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className='absolute top-[85px] left-0 w-full bg-white shadow-lg rounded-lg py-2 z-50'>
            <div className='flex flex-col items-center gap-4 py-2'>
              {/* Icons */}
              <div className="flex justify-center gap-6">
                <button onClick={() => setIsLeaderboardOpen(true)}>
                  <ChartNoAxesColumn
                    color='#29296E'
                    size={32}
                    className='hover:scale-110 hover:shadow-lg transition-transform cursor-pointer'
                  />
                </button>

                <button onClick={() => setIsSettingsOpen(true)}>
                  <Settings
                    color='#29296E'
                    size={32}
                    className='hover:scale-110 hover:shadow-lg transition-transform cursor-pointer'
                  />
                </button>

                <CircleHelp
                  color='#29296E'
                  size={32}
                  className='hover:scale-110 hover:shadow-lg transition-transform cursor-pointer'
                />
>>>>>>> main
              </div>

              {/* Connect Button */}
              <button className='bg-[#29296E] w-[150px] h-[39px] text-white text-sm font-semibold rounded-[15px] flex items-center justify-center transform transition-transform hover:scale-110 hover:shadow-lg mt-4'>
                Connect
              </button>
            </div>
          </div>
        )}
        
        {/* Leaderboard Modal */}
        <LeaderBoardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />

          {/* Help Guide Modal */}
        <HelpGuide isOpen={isHelpGuideOpen} onClose={() => setIsHelpGuideOpen(false)} />

        {/* Setting modal components  */}
        <Setting
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  )
}

export default Navbar

