"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function SubAdminSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      // Simulate API call - in a real app, you would handle authentication here
      // setTimeout is just for demo purposes
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-[#383874] mb-2">
          Sub Admin Sign In
        </h1>
        <p className="text-gray-600 text-sm md:text-base">Enter your details to Log In</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-600 text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7878B5] focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-600 text-sm">
            password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7878B5] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="text-right">
            <a href="#" className="text-[#383874] text-sm hover:underline">
              forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isFormValid && !isLoading
              ? "bg-[#7878B5] hover:bg-[#6868a5]"
              : "bg-[#7878B5]/50 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
