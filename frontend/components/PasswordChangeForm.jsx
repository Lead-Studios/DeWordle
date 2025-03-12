"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordChangeForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", {
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  const isFormValid = currentPassword && newPassword && confirmPassword;

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <div className="p-6">
        <h1 className="text-[48px] md:text-[48px] text-[#29296E] font-[600] font-roboto text-center mb-10 text-3xl sm:text-4xl">
          Password Change
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password  */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-[16px] font-[400] text-[#535353] mb-1"
            >
              Enter Existing Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#535353] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Enter current password"
                style={{ WebkitAppearance: "none" }}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password  */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-[16px] font-[400] text-[#535353] mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#535353] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Enter new password"
                style={{ WebkitAppearance: "none" }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex="-1"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password  */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[16px] font-[400] text-[#535353] mb-1"
            >
              Re-enter Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#535353] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                placeholder="Confirm new password"
                style={{ WebkitAppearance: "none" }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submission Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 px-4 rounded-[24px] text-white font-medium transition-colors ${
                isFormValid
                  ? "bg-[#29296E] hover:bg-[#12123f]"
                  : "bg-[#656586] cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
