function formatDate(dateString) {
  if (!dateString) return "N/A";

  // Parse the ISO date string
  const date = new Date(dateString);

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get day, month, and year
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Format as "12 January 2025"
  return `${day} ${month} ${year}`;
}

export const AccountInfoCard = ({ userData }) => {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-[#2c2c2c] md:text-xl">
        Account Information
      </h2>
      <div className="p-4 bg-white rounded-lg shadow-sm md:p-6">
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Joined</p>
            <p className="font-medium text-sm md:text-base">
              {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Last Played</p>
            <p className="font-medium text-sm md:text-base">
              {userData?.updatedAt ? formatDate(userData.updatedAt) : "N/A"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Email</p>
            <p className="font-medium text-sm md:text-base">
              {userData?.email || "Email"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Email Status</p>
            <p className="font-medium text-sm md:text-base">
              {userData?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm md:text-base">Profile ID</p>
            <p className="font-medium text-sm md:text-base">
              {userData?.id || "ID"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
