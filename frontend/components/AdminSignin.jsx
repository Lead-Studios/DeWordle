"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AdminSignin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-96 mt-10  items-center justify-center px-4">
      <div className="w-full max-w-[498px] bg-white px-6 py-3 sm:px-12">
        {/* Title */}
        <h2 className="text-center text-4xl font-bold text-[#29296E]">
          Admin Sign In
        </h2>

        <h3 className="mt-2 mb-6 text-center text-lg text-[#252525]">
          Enter your details to Login
        </h3>

        {/* Form */}
        <form action="#" method="POST" className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="mt-1 block w-full max-w-[498px] rounded-[8px] border border-[#797979] bg-white px-3 py-2 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#29296E] sm:text-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full max-w-[498px] rounded-[8px] border border-[#797979] bg-white px-3 py-2 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[#29296E] sm:text-sm"
              />
              {/* Eye Icon for Show/Hide Password */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-[#29296E] hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full max-w-[498px] rounded-[8px] px-4 py-2 text-sm font-semibold text-white transition-all ${
              password
                ? "bg-[#29296E] hover:bg-[#413FA0]"
                : "bg-[#797979] cursor-not-allowed"
            }`}
            disabled={!password}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;
