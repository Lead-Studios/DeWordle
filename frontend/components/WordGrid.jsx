"use client";
import React, { useContext } from "react";
import { AppContext } from "@/context/AppContext";

function WordGrid() {
  const { gridData } = useContext(AppContext);

  return (
    <div className="mt-5">
      <div className="grid grid-cols-5 gap-3 md:gap-5 place-content-center mx-auto w-[300px] md:w-[400px] text-foreground">
        {gridData.map((cell, index) => (
          <div
            key={index}
            className="w-[50px] h-[50px] rounded-[4px] flex items-center justify-center text-2xl font-semibold shadow-md transition-all duration-300 ease-in-out"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #777777",
              animation: cell.char ? "fadeIn 0.5s ease-in-out" : "none",
            }}
          >
            {cell.char}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordGrid;
