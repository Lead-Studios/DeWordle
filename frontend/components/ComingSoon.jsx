"use client"

import { useState } from "react"

export default function ComingSoon() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Email submitted:", email)
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
      setEmail("")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <main className="max-w-3xl mx-auto text-center">
        {/* Colorful gradient heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-green-400 via-blue-500 to-pink-500 text-transparent bg-clip-text">
          Coming Soon
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-800 mb-12 max-w-lg mx-auto">
          From automation of people processes to creating an engaged and driven culture.
        </p>

        {/* Email notification form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Please enter your email address"
            className="flex-grow px-4 py-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`px-6 py-3 rounded bg-white text-black font-medium hover:bg-gray-200 transition-colors ${
              isSubmitted ? "bg-green-500 text-white" : ""
            }`}
          >
            {isSubmitted ? "Submitted!" : "Notify Me"}
          </button>
        </form>

        {/* Notification text */}
        <p className="text-sm text-gray-400">_ Notify me when App is launched _</p>
      </main>
    </div>
  )
}

