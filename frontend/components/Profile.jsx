"use client";
import { useContext, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { AppContext } from "@/context/AppContext";

export default function ProfilePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  // Get user data from context
  const { userData } = useContext(AppContext);
  function formatDate(dateString) {
    const date = new Date(dateString);
    // Options for abbreviated month and full numeric year
    const options = { month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Optionally, use useEffect to update the loading state once userData is available
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setIsLoading(false);
    }
  }, [userData]);



  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Mobile menu */}

      {/* Main Content */}
      <main className="grid grid-cols-1 gap-8 px-4 py-2 md:px-8 lg:px-16 lg:py-8 lg:grid-cols-2">
        {/* Personal Information */}

        {isloading ? (
          <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm animate-pulse"></div>
        ) : (
          <>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-[#2c2c2c] md:text-xl">
                Personal Information
              </h2>
              <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 mb-3 overflow-hidden border-2 rounded-full border-[#d7d7d7] md:w-24 md:h-24 md:mb-4">
                    <Image
                      src="/john.png"
                      alt="John Elliot Stones"
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    {userData.FullName || "John Elliot Stones"}
                  </h3>
                  <p className="text-[#4f4f4f]">{userData.userName}</p>
                </div>

                <button className="w-full py-2.5 mb-5 text-white rounded-md bg-[#29296e] md:py-3 md:mb-6">
                  Edit Profile
                </button>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-xs text-[#4f4f4f] md:text-sm">Full name</p>
                    <p className="text-sm md:text-base"> {userData.FullName || "John Elliot Stones"} </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4f4f4f] md:text-sm">User name</p>
                    <p className="text-sm md:text-base">{userData.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4f4f4f] md:text-sm">Email</p>
                    <p className="text-sm md:text-base">{userData.email}</p>
                  </div>
                </div>

                <button className="w-full py-2.5 mt-5 border rounded-md border-[#29296e] text-[#29296e] md:py-3 md:mt-6">
                  Reset Password
                </button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* My Stats */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-[#2c2c2c] md:text-xl">
                  My Stats
                </h2>
                <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Points</p>
                      <p className="font-medium text-sm md:text-base">1200</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Played</p>
                      <p className="font-medium text-sm md:text-base">2</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Win rate</p>
                      <p className="font-medium text-sm md:text-base">100%</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Current streak</p>
                      <p className="font-medium text-sm md:text-base">1</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Max streak</p>
                      <p className="font-medium text-sm md:text-base">2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-[#2c2c2c] md:text-xl">
                  Account Information
                </h2>
                <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Joined</p>
                      <p className="font-medium text-sm md:text-base">
                        {formatDate(userData.createdAt)}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Last Played</p>
                      <p className="font-medium text-sm md:text-base">
                        17th Feb 2025
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Email</p>
                      <p className="font-medium text-sm md:text-base">
                        {userData.email}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Email Status</p>
                      <p className="font-medium text-sm md:text-base">  {userData?.isVerified?.toString()}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm md:text-base">Profile ID</p>
                      <p className="font-medium text-sm md:text-base">{userData.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

