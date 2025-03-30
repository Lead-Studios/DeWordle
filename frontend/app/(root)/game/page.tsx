"use client";

import React, { useState, useEffect } from "react";
import Keyboard from "@/components/Keyboard";
import WordGrid from "@/components/WordGrid.jsx";
import HowToPlayModal from "@/components/HowToPlayModal";

export default function Page() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if it's the user's first time
    const isFirstTime = localStorage.getItem("isFirstTime");
    if (isFirstTime === null || isFirstTime === "true") {
      setShowTutorial(true);
    }
  }, []);

  const handleModalClose = () => {
    setShowTutorial(false);
    // Update flag so modal doesn't show again
    localStorage.setItem("isFirstTime", "false");
  };

  return (
    <div className="mt-24 h-screen relative">
       {showTutorial && (
        <HowToPlayModal isOpen={showTutorial} onClose={handleModalClose} />
      )}
      <WordGrid />
      <Keyboard />
     
    </div>
  );
}
