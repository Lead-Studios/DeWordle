import Image from "next/image";

export const PersonalInfoCard = ({ userData }) => {
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold text-[#2c2c2c] md:text-xl">
        Personal Information
      </h2>
      <div className="p-4 bg-white h-auto md:min-h-[550px] rounded-lg shadow-sm md:p-6">
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
          <h3 className="text-lg font-semibold md:textxl">
            {userData?.userName || "User"}
          </h3>
          <p className="text-[#4f4f4f]">{userData?.email || "Email"}</p>
        </div>

        <button className="w-full py-2.5 mb-5 text-white rounded-md bg-[#29296e] md:py-3 md:mb-6">
          Edit Profile
        </button>

        <div className="space-y-3 md:space-y-4">
          {/* commeted out till props is provided */}
          {/* <div>
            <p className="text-xs text-[#4f4f4f] md:text-sm">Full name</p>
            <p className="text-sm md:text-base">
              {userData?.userName || "full name"}
            </p>
          </div> */}
          <div>
            <p className="text-xs text-[#4f4f4f] md:text-sm">User name</p>
            <p className="text-sm md:text-base">
              {userData?.userName || "User"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#4f4f4f] md:text-sm">Email</p>
            <p className="text-sm md:text-base">{userData?.email || "Email"}</p>
          </div>
        </div>

        <button className="w-full py-2.5 mt-5 border rounded-md border-[#29296e] text-[#29296e] md:py-3 md:mt-6">
          Reset Password
        </button>
      </div>
    </div>
  );
};
