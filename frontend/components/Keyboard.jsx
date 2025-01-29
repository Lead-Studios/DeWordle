import React from "react";
import { Delete } from "lucide-react";

const Keyboard = () => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    [
      "Enter",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      { label: "", icon: <Delete />, type: "icon" },
    ],
  ];

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {row.map((key, keyIndex) => {
              if (typeof key === "object" && key.type === "icon") {
                return (
                  <button
                    key={keyIndex}
                    className="bg-[#939b9f]/30 hover:bg-gray-400 text-gray-800 font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-md shadow-md flex items-center space-x-2 transition-all text-xs sm:text-sm"
                  >
                    {key.icon}
                    <span>{key.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={keyIndex}
                  className="bg-[#939b9f]/30 hover:bg-gray-400 text-gray-800 font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-md shadow-md transition-all text-xs sm:text-sm"
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
