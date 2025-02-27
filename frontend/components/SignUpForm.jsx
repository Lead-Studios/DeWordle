import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

export default function SignUpForm() {
  return (
    <div className=" min-h-screen bg-[#ffffff] flex items-center justify-center p-4 ">
      <div className="w-full sm:max-w-md p-6 sm:p-8 rounded-lg ">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-[#29296E]">
          Get Started
        </h2>
        <p className="text-center text-black text-sm sm:text-base">
          Create your account
        </p>

        <form className="mt-6">
          <label htmlFor="text" className="text-black text-sm sm:text-base">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your name/nickname"
            className="w-full p-3 border border-black/40 rounded-lg mb-3 text-sm sm:text-base bg-transparent"
          />

          <label htmlFor="text" className="text-black text-sm sm:text-base">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            className="w-full p-3 border border-black/40 rounded-lg mb-3 text-sm sm:text-base bg-transparent"
          />

          <label htmlFor="email" className="text-black text-sm sm:text-base">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-3 border border-black/40 rounded-lg mb-3 text-sm sm:text-base bg-transparent"
          />

          <label htmlFor="password" className="text-black text-sm sm:text-base">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-black/40 rounded-lg mb-3 text-sm sm:text-base bg-transparent"
          />

          <label htmlFor="password" className="text-black text-sm sm:text-base">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className="w-full p-3 border border-black/40 rounded-lg mb-3 text-sm sm:text-base bg-transparent"
          />

          <button
            type="submit"
            className="w-full bg-[#29296A] text-white p-3 rounded-full mt-6 sm:mt-8 text-sm sm:text-base"
          >
            Create Account
          </button>
        </form>

        <div className="text-center my-4 text-gray-500 text-sm sm:text-base">
          or
        </div>

        <button className="w-full flex items-center justify-center p-3 rounded-full bg-[#F2F2F4] mb-2 text-black font-semibold text-sm sm:text-base">
          <FcGoogle className="mr-2" /> Continue with Google
        </button>
        <button className="w-full flex items-center justify-center p-3 rounded-full bg-[#F2F2F4] text-black font-semibold text-sm sm:text-base">
          <FaApple className="mr-2 text-black" /> Continue with Apple
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
          Already have an account?{' '}
          <a href="/signin" className="text-indigo-600">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
