"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, ChevronLeft, Info, Play, BookOpen } from "lucide-react"

export default function DewordleTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationWord, setAnimationWord] = useState("")
  const [animationIndex, setAnimationIndex] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [tooltipContent, setTooltipContent] = useState("")

  // Tutorial steps content
  const tutorialSteps = [
    {
      title: "Welcome to Dewordle!",
      content: "Dewordle is a word-guessing game where you try to guess a hidden 5-letter word in 6 attempts or less.",
      example: null,
    },
    {
      title: "Making a Guess",
      content: "Type a 5-letter word and press Enter to submit your guess.",
      example: {
        word: "REACT",
        target: "WORLD",
        explanation: "Let's try guessing the word 'REACT'",
      },
    },
    {
      title: "Understanding Feedback",
      content: "After each guess, the letters will change color to give you clues:",
      example: {
        word: "REACT",
        target: "WORLD",
        explanation:
          "Green: Letter is in the correct position. Yellow: Letter is in the word but in the wrong position. Gray: Letter is not in the word.",
      },
    },
    {
      title: "Using the Clues",
      content: "Use the colored clues to make better guesses in your next attempts.",
      example: {
        word: "WORLD",
        target: "WORLD",
        explanation: "Based on previous clues, we might guess 'WORLD', which is correct!",
      },
    },
    {
      title: "Winning the Game",
      content: "You win when you correctly guess the word. The fewer attempts, the better your score!",
      example: {
        word: "WORLD",
        target: "WORLD",
        explanation: "Congratulations! You've guessed the word correctly.",
      },
    },
  ]

  // Handle animation for typing effect
  useEffect(() => {
    if (currentStep > 0 && tutorialSteps[currentStep].example) {
      const word = tutorialSteps[currentStep].example.word
      if (animationIndex < word.length) {
        const timer = setTimeout(() => {
          setAnimationWord((prev) => prev + word[animationIndex])
          setAnimationIndex((prev) => prev + 1)
        }, 300)
        return () => clearTimeout(timer)
      }
    }
  }, [currentStep, animationIndex])

  // Reset animation when step changes
  useEffect(() => {
    setAnimationWord("")
    setAnimationIndex(0)
  }, [currentStep])

  // Show tooltip for a letter
  const handleShowTooltip = (content, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      top: rect.top - 70,
      left: rect.left + rect.width / 2,
    })
    setTooltipContent(content)
    setShowTooltip(true)
  }

  // Get letter background color based on game rules
  const getLetterColor = (letter, index, targetWord) => {
    if (!letter) return "bg-gray-100 dark:bg-gray-800"
    if (!targetWord) return "bg-gray-100 dark:bg-gray-800"

    if (letter === targetWord[index]) {
      return "bg-green-500 text-white"
    } else if (targetWord.includes(letter)) {
      return "bg-yellow-500 text-white"
    } else {
      return "bg-gray-400 dark:bg-gray-600 text-white"
    }
  }

  // Get tooltip content based on letter status
  const getTooltipContent = (letter, index, targetWord) => {
    if (!letter || !targetWord) return ""

    if (letter === targetWord[index]) {
      return `'${letter}' is in the correct position!`
    } else if (targetWord.includes(letter)) {
      return `'${letter}' is in the word but in the wrong position.`
    } else {
      return `'${letter}' is not in the word.`
    }
  }

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Close tutorial
  const closeTutorial = () => {
    setShowTutorial(false)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Main Game UI (Placeholder) */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Dewordle</h1>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-full aspect-square flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-xl font-bold text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Learn to Play
          </button>
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            {/* Tutorial Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">How to Play Dewordle</h2>
              <button
                onClick={closeTutorial}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tutorial Content */}
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {currentStep + 1}
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
                  {tutorialSteps[currentStep].title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">{tutorialSteps[currentStep].content}</p>

              {/* Interactive Example */}
              {tutorialSteps[currentStep].example && (
                <div className="mb-8">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      {tutorialSteps[currentStep].example.explanation}
                    </p>

                    <div className="flex justify-center mb-2">
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const letter = animationWord[i] || ""
                          const targetWord = tutorialSteps[currentStep].example.target
                          return (
                            <div
                              key={i}
                              className={`w-14 h-14 flex items-center justify-center ${getLetterColor(letter, i, targetWord)} rounded text-xl font-bold transition-all duration-300 cursor-pointer relative`}
                              onMouseEnter={(e) =>
                                letter && handleShowTooltip(getTooltipContent(letter, i, targetWord), e)
                              }
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              {letter}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Color Legend */}
                    {currentStep === 2 && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Correct position</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Wrong position</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded mr-2"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Not in word</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip */}
              {showTooltip && (
                <div
                  className="fixed bg-black text-white text-sm py-2 px-3 rounded shadow-lg z-50 pointer-events-none transform -translate-x-1/2"
                  style={{
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                  }}
                >
                  {tooltipContent}
                  <div className="absolute w-3 h-3 bg-black transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep < tutorialSteps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={closeTutorial}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      Play Game
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1)
                        setAnimationWord("")
                        setAnimationIndex(0)
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                Step {currentStep + 1} of {tutorialSteps.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

