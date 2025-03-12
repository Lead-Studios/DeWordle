import React from "react";
import Image from "next/image";
import share from "@/assets/share.png";
import avatar from "@/assets/avatar.png";

const LeaderBoardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = {
    played: 2,
    winPercentage: 100,
    currentStreak: 1,
    maxStreak: 2,
    points: 1200,
  };

  const leaderboard = [
    {
      username: "theJohnDoe",
      avatar: avatar,
      points: 1200,
    },
    {
      username: "janeDoe",
      avatar: avatar,
      points: 1150,
    },
    {
      username: "mikeSmith",
      avatar: avatar,
      points: 1100,
    },
    {
      username: "lisaJones",
      avatar: avatar,
      points: 1080,
    },
    {
      username: "alexBrown",
      avatar: avatar,
      points: 1050,
    },
    {
      username: "sarahWhite",
      avatar: avatar,
      points: 1030,
    },
    {
      username: "chrisGreen",
      avatar: avatar,
      points: 1000,
    },
    {
      username: "natalieBlack",
      avatar: avatar,
      points: 980,
    },
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-background shadow-lg px-6 pb-5 w-[80%] sm:w-[50%] lg:w-[40%]">
        <div className="p-4 flex text-black text-foreground justify-between items-center">
          <h2 className="text-lg font-bold">Statistics</h2>
          <button onClick={onClose} className="text-xl font-bold">
            &times;
          </button>
        </div>

        <div className="p-4 bg-[#fafafc] bg-background shadow-lg rounded-[16px]">
          <div className="grid grid-cols-4 text-center gap-4">
            <div>
              <p className="text-4xl font-medium text-[#29296e] text-foreground">
                {stats.played}
              </p>
              <p className="text-gray-500 text-sm text-foreground">Played</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-[#29296e] text-foreground">
                {stats.winPercentage}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-30">win %</p>
            </div>
            <div>
              <p className="text-4xl font-medium text-[#29296e] text-foreground">
                {stats.currentStreak}
              </p>
              <p className="text-gray-500 text-sm text-foreground">
                Current Streak
              </p>
            </div>
            <div>
              <p className="text-4xl font-medium text-[#29296e] text-foreground">
                {stats.maxStreak}
              </p>
              <p className="text-gray-500 text-sm text-foreground">
                Max Streak
              </p>
            </div>
          </div>
          <p className="mt-4 text-black text-foreground">
            Points{" "}
            <span className="text-[#29296e] text-foreground font-bold">
              {stats.points} pst
            </span>
          </p>
        </div>

        <div className="overflow-y-scroll no-scrollbar max-h-60 rounded-[16px] mt-4 bg-[#fafafc] bg-background px-4 border-collapse border border-[#dbe2e7] dark:border-[#444]">
          <table className="w-full text-left  ">
            <thead className="bg-[#fafafc] bg-background border-b border-[#dbe2e7] dark:border-[#444]">
              <tr className="text-[#29296e] text-foreground">
                <th className="p-2">Username</th>
                <th className="p-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, index) => (
                <tr
                  key={index}
                  className="p-2 hover:bg-[#29296e] hover:text-white dark:hover:bg-[#444] text-foreground text-[#29296e]  border-b border-[#dbe2e7] dark:border-[#444]"
                >
                  <td className="p-2 flex items-center gap-2">
                    <span className="text-sm font-medium">{index + 1}</span>
                    <Image src={avatar} alt="avatar" width={30} />
                    {player.username}
                  </td>
                  <td className="p-2">{player.points} pst</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="relative">
          <button className="absolute bottom-2 right-0">
            <Image src={share} alt="share" width={50} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardModal;
