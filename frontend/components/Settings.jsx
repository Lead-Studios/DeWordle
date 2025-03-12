"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Switch } from "@headlessui/react";
import Copywrite from "./Copywrite";
import { useTheme } from "@/context/ThemeContext";

export const Setting = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { isDarkMode, toggleDarkMode } = useTheme();

  const [enabled, setEnabled] = useState({
    "Hard Mode": false,
    "Dark Theme": document.documentElement.classList.contains("dark"),
    "High Contrast Mode": false,
    "Onscreen Keyboard Input Only": false,
  });

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    setEnabled((prev) => ({ ...prev, "Dark Theme": !prev["Dark Theme"] }));
  };

  // Static setting data
  const settingsDetails = [
    {
      header: "Hard Mode",
      desc: "Any revealed hints must be used in subsequent guesses",
      status: "disabled",
    },
    {
      header: "Dark Theme",
      desc: "",
      status: "enabled",
    },
    {
      header: "High Contrast Mode",
      desc: "Contrast and colorblindness improvements",
      status: "disabled",
    },
    {
      header: "Onscreen Keyboard Input Only",
      desc: "Ignore key input except from the onscreen keyboard. Most helpful for users using speech recognition or other assistive devices.",
      status: "disabled",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className=" bg-background shadow-lg px-6 p-3 rounded-md pb-5 w-full sm:w-[50%] lg:w-[40%]">
        {/* header section  */}
        <div className="flex justify-between items-center">
          <h1 className="mx-auto text-2xl font-bold">SETTINGS</h1>
          <button onClick={onClose} className="text-[50px] font-bold">
            <X />
          </button>
        </div>

        {settingsDetails.map((setting, index) => (
          <div key={index} className="mt-5 pb-4 border-b-2 border-black">
            <div className="flex justify-between items-center text-foreground">
              <h1 className="text-[18px]">{setting.header}</h1>

              {setting.header === "Dark Theme" ? (
                <Switch
                  checked={enabled["Dark Theme"]}
                  onChange={handleDarkModeToggle}
                  className="group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200
                   transition-colors duration-200 ease-in-out focus:outline-none focus:ring-[#c8d2d1] focus:ring-2 text-foreground"
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition text-foreground
                     duration-200 ease-in-out group-data-[checked]:translate-x-4"
                  />
                </Switch>
              ) : (
                <Switch
                  checked={enabled[setting.header]}
                  onChange={() =>
                    setEnabled((prev) => ({
                      ...prev,
                      [setting.header]: !prev[setting.header],
                    }))
                  }
                  className="group relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent text-foreground
                   bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-[#c8d2d1] focus:ring-2"
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-4 w-4 transform rounded-full text-foreground
                     bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4"
                  />
                </Switch>
              )}
            </div>
            <p className="text-[14px] text-foreground">{setting.desc}</p>
          </div>
        ))}

        <div className="flex items-center gap-1 py-3">
          <Copywrite />
        </div>
      </div>
    </div>
  );
};
