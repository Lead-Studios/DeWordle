"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [doesPasswordMatch, setdoesPasswordMatch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", {
      newPassword,
      confirmNewPassword,
    });
  };

  useEffect(() => {
    newPassword === confirmNewPassword
      ? setdoesPasswordMatch(true)
      : setdoesPasswordMatch(false);
  }, [newPassword, confirmNewPassword]);

  const isFormValid = newPassword && confirmNewPassword && doesPasswordMatch;
  return (
    <div className="">
      <div className="w-full max-w-xl mx-auto p-6">
        <div className="p-6">
          <h1 className="text-[35px] sm:text-[40px] md:text-[48px] text-[#29296E] font-[600] font-roboto text-center mb-10 text-3xl sm:text-4xl whitespace-nowrap">
            Reset your password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password  */}
            <div>
              <label
                htmlFor="NewPassword"
                className="block text-[16px] font-[400] text-[#535353] mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="NewPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#535353] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  placeholder="New password"
                  style={{ WebkitAppearance: "none" }}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Re-enter New Password  */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-[16px] font-[400] text-[#535353] mb-1"
              >
                Re-enter Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#535353] rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  placeholder="Enter new password"
                  style={{ WebkitAppearance: "none" }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  tabIndex="-1"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {doesPasswordMatch ? '' : <p className="text-red-600 text-left text-sm" >Password does not match</p>}
            </div>

            {/* Submission Button */}
            <div className="pt-7">
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
    </div>
  );
};

export default ResetPassword;
