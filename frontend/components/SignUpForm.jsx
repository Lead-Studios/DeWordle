"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "./ui/googleIcon";
import Link from "next/link";

const SignUpForm = () => {
  const router = useRouter();
  const [toast, setToast] = useState({ message: "", type: "", show: false });
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    terms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (error) {
        console.error("Submission error:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5]">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-end items-center gap-4">
        <a href="/login" className="text-gray-600 hover:text-gray-900">
          Sign In
        </a>
        <button
          onClick={() => router.push("/")}
          className="bg-[#29296E] text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Request Demo
        </button>
      </header>

      <div className="flex items-center justify-center p-4">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          {/* Form Container */}
          <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
            <h1 className="text-2xl font-medium mb-6">Get Started Now</h1>
            <p className=" mb-6">
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium  mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.userName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your username"
                  required
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium  mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium  mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Create a password"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-2">
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the Terms & Policy
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-500">{errors.terms}</p>
                  )}
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#29296E] text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
              {toast.show && (
                <div
                  className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
                    toast.type === "success" ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {toast.message}
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center justify-center">
              <span className="text-gray-500 text-sm">or</span>
            </div>

            {/* Google Sign In Button */}
            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50">
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-600">
              Have an account?{" "}
              <Link
                href="/signin"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Illustration Placeholder */}
          <div className="hidden lg:block w-1/2 pl-12">
            <div className="w-full h-96 flex items-center justify-center">
              <img
                src="/illustration.svg"
                alt="Sign up illustration"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
