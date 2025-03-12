import Image from "next/image";
import profile1 from "@/assets/profile1.png";
import profile2 from "@/assets/profile2.png";

const Leaderboard = () => {
  const date = "17 Feb 2025 ";
  const time = "18:10";
  const user = {
    profile: profile1,
    name: "John Stones",
    points: 1200,
    played: 2,
    winRate: "100%",
    currentStreak: 1,
    maxStreak: 2,
  };

  const leaderboardData = [
    {
      image: profile2,
      username: "Emily Robert",
      points: 1200,
      played: 2,
      winRate: 100,
      currentStreak: 1,
      maxStreak: 2,
    },
    {
      image: profile2,
      username: "Michael Smith",
      points: 1150,
      played: 3,
      winRate: 90,
      currentStreak: 2,
      maxStreak: 3,
    },
    {
      image: profile2,
      username: "Sarah Johnson",
      points: 1100,
      played: 4,
      winRate: 85,
      currentStreak: 1,
      maxStreak: 2,
    },
    {
      image: profile2,
      username: "David Brown",
      points: 1050,
      played: 5,
      winRate: 80,
      currentStreak: 3,
      maxStreak: 4,
    },
    {
      image: profile2,
      username: "Jessica White",
      points: 1000,
      played: 6,
      winRate: 75,
      currentStreak: 2,
      maxStreak: 3,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className=" flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={user.profile}
              alt="Profile Picture"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.points} points</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0 md:grid-cols-4 text-center">
            <div>
              <p className="text-[#252525]">Played</p>
              <p className=" text-2xl font-[500] text-[#29296e]">
                {user.played}
              </p>
            </div>
            <div>
              <p className="text-[#252525]">Win rate</p>
              <p className="text-2xl font-[500] text-[#29296e]">
                {user.winRate}
              </p>
            </div>
            <div>
              <p className="text-[#252525]">Current streak</p>
              <p className="text-2xl font-[500] text-[#29296e]">
                {user.currentStreak}
              </p>
            </div>
            <div>
              <p className="text-[#252525]">Max streak</p>
              <p className="text-2xl font-[500] text-[#29296e]">
                {user.maxStreak}
              </p>
            </div>
          </div>
        </div>
        <div className="text-[#575757]  text-[16px] mt-2">
          Last Updated : {date} {time}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white shadow-md rounded-lg mt-6 p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-sm text-[#29296e]">
              <th className="p-3">Username</th>
              <th className="p-3">Points</th>
              <th className="p-3">Played</th>
              <th className="p-3">Win rate</th>
              <th className="p-3">Current streak</th>
              <th className="p-3">Max streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((player, index) => (
              <tr
                key={index}
                className="border-b text-[#414141] text-sm text-center hover:bg-gray-100"
              >
                <td className="p-3 flex items-center gap-2">
                  <Image
                    src={player.image}
                    alt="Profile"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  {player.username}
                </td>
                <td className="p-3 ">{player.points}</td>
                <td className="p-3">{player.played}</td>
                <td className="p-3">{player.winRate}%</td>
                <td className="p-3">{player.currentStreak}</td>
                <td className="p-3">{player.maxStreak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
