import React from "react";
import SigninWithGoogle from "@/components/sigInWithGoogle";
import Link from "next/link";
import { FaApple } from "react-icons/fa";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const handleSignInWithApple = () => {
    console.log("Sign in with Apple clicked");
  };

  return (
    <div className="h-screen bg-[#ffffff] flex flex-col ">
      <main className="">
        {children}
        <div className="flex flex-col mx-auto px-4 md:px-0 justify-center max-w-md w-full">
          <SigninWithGoogle />

          {/* Dummy sign in with Apple button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border bg-gray-100 rounded-full py-4 px-4 hover:bg-gray-200    mt-3"
          >
            <FaApple className="w-5 h-5 text-black" />
            Continue with Apple
          </button>

        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
