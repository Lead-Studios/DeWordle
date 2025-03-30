"use client";

import React from "react";
import { X } from "lucide-react";

const HowToPlayModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Full screen container with flexbox to center the modal
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop: clicking it calls onClose */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Modal Content Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-5 border border-gray-200 min-h-[500px] w-[350px] md:w-[400px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-[#29296E] font-bold text-lg">How to play</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules List */}
        <p className="text-sm text-gray-700 mt-3">Guess the wordle in 6 tries:</p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>• Each guess must be a valid 5-letter word.</li>
          <li>
            • The color of the tiles will change to show how close your guess was to the word.
          </li>
        </ul>

        {/* Examples Section */}
        <h3 className="text-[#29296E] font-bold text-sm mt-4">Examples</h3>

        {/* Example 1 */}
        <div className="mt-2">
          <div className="flex gap-1">
            <span className="w-10 h-10 flex items-center justify-center bg-green-500 text-white font-bold text-lg rounded-md">
              W
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              O
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              R
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              D
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              Y
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            W is in the word and in the correct spot.
          </p>
        </div>

        {/* Example 2 */}
        <div className="mt-2">
          <div className="flex gap-1">
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              L
            </span>
            <span className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white font-bold text-lg rounded-md">
              I
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              G
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              H
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              T
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            I is in the word but in the wrong spot.
          </p>
        </div>

        {/* Example 3 */}
        <div className="mt-2">
          <div className="flex gap-1">
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              R
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              O
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              G
            </span>
            <span className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white font-bold text-lg rounded-md">
              U
            </span>
            <span className="w-10 h-10 flex items-center justify-center border border-gray-300 text-lg rounded-md">
              E
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            U is not in the word in any spot.
          </p>
        </div>

        {/* Bottom Section */}
        <p className="mt-4 text-xs text-gray-600 border-t pt-3">
          <a href="#" className="text-blue-500 hover:underline">
            Log in or create a free account
          </a>{" "}
          to link your stats.
        </p>
        <p className="mt-2 text-xs text-gray-600">
          A new puzzle is released daily at midnight. If you haven’t already, you
          can{" "}
          <a href="#" className="text-blue-500 hover:underline">
            sign up
          </a>{" "}
          for our daily reminder email.
        </p>
      </div>
    </div>
  );
};

export default HowToPlayModal;
