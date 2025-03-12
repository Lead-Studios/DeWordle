"use client";
import { useState, useEffect } from "react";
import { Share2, Trophy, Clock, Flame } from "lucide-react";

export default function DailyChallenge() {
  // State for the game
  const [word, setWord] = useState("REACT");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [timeLeft, setTimeLeft] = useState(0);
  const [stats, setStats] = useState({
    streak: 5,
    fastestTime: "00:42",
    totalWins: 28,
  });

  // Calculate time until next challenge
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();
      setTimeLeft(difference);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time left as HH:MM:SS
  const formatTimeLeft = () => {
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle guess submission
  const handleSubmit = () => {
    e.preventDefault();

    if (guess.length === 5 && guesses.length < 6) {
      setGuesses([...guesses, guess.toUpperCase()]);
      setGuess("");

      if (guess.toUpperCase() === word) {
        setGameStatus("won");
      } else if (guesses.length === 5) {
        setGameStatus("lost");
      }
    }
  };

  // Share results
  const shareResults = () => {
    const text = `Daily Challenge #123\n${
      gameStatus === "won"
        ? `I solved today's word in ${guesses.length} tries!`
        : "I couldn't solve today's challenge."
    }\nPlay at: example.com/daily`;

    if (navigator.share) {
      navigator.share({
        title: "My Daily Challenge Results",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="m-6">
      {/* Header */}
      <div className="text-center p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Daily Challenge
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          A new word every day. How fast can you solve it?
        </p>
      </div>

      {/* Game */}
      <div className="flex flex-col lg:flex-row justify-evenly space-y--4 gap-4">
        {/* Game Status */}
        <div className="Game-status">
          <div className="mb-6">
            {gameStatus === "playing" ? (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 text-center font-medium">
                  Guess today's 5-letter word! You have 6 attempts.
                </p>
              </div>
            ) : gameStatus === "won" ? (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  Congratulations! You solved today's challenge in{" "}
                  {guesses.length} tries!
                </p>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-center font-medium">
                  Better luck tomorrow! The word was: {word}
                </p>
              </div>
            )}
          </div>

          {/* Word Display */}
          <div className="mb-6">
            {guesses.map((guessWord, guessIndex) => (
              <div key={guessIndex} className="flex justify-center gap-1 mb-1">
                {guessWord.split("").map((letter, letterIndex) => {
                  let bgColor = "bg-gray-200 dark:bg-gray-700";
                  let textColor = "text-gray-800 dark:text-gray-200";

                  if (letter === word[letterIndex]) {
                    bgColor = "bg-green-500 dark:bg-green-600";
                    textColor = "text-white";
                  } else if (word.includes(letter)) {
                    bgColor = "bg-yellow-500 dark:bg-yellow-600";
                    textColor = "text-white";
                  }

                  return (
                    <div
                      key={letterIndex}
                      className={`w-12 h-12 flex items-center justify-center ${bgColor} ${textColor} font-bold text-xl rounded`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Empty rows for remaining guesses */}
            {Array.from({ length: Math.max(0, 6 - guesses.length) }).map(
              (_, rowIndex) => (
                <div
                  key={`empty-${rowIndex}`}
                  className="flex justify-center gap-1 mb-1"
                >
                  {Array.from({ length: 5 }).map((_, cellIndex) => (
                    <div
                      key={`empty-${rowIndex}-${cellIndex}`}
                      className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold text-xl rounded border border-gray-300 dark:border-gray-700"
                    >
                      {rowIndex === 0 && guess[cellIndex]
                        ? guess[cellIndex].toUpperCase()
                        : ""}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Input Form */}
          {gameStatus === "playing" && (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value.slice(0, 5))}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter 5-letter word"
                  maxLength={5}
                  pattern="[A-Za-z]{5}"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Guess
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Next Challenge Timer */}
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Next Challenge In
          </h2>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatTimeLeft()}
          </div>
        </div>

        <div className="Stats">
          {/* Stats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Your Stats
            </h2>
            <div className="flex flex-col md:flex-row md:justify-around  gap-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                  {stats.streak}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Win Streak
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                  {stats.fastestTime}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Fastest Solve
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">
                  {stats.totalWins}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Total Wins
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Today's Leaderboard
            </h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <div className="col-span-1 p-3 text-center">#</div>
                <div className="col-span-7 p-3">Player</div>
                <div className="col-span-4 p-3 text-right">Time</div>
              </div>
              {[
                { rank: 1, name: "Alex", time: "00:32" },
                { rank: 2, name: "Taylor", time: "00:45" },
                { rank: 3, name: "Jordan", time: "01:12" },
              ].map((player) => (
                <div
                  key={player.rank}
                  className="grid grid-cols-12 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className="col-span-1 p-3 text-center font-semibold">
                    {player.rank}
                  </div>
                  <div className="col-span-7 p-3">{player.name}</div>
                  <div className="col-span-4 p-3 text-right">{player.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="max-w-md m-auto">
        <button
          onClick={shareResults}
          className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <Share2 className="h-5 w-5" />
          Share Your Results
        </button>
      </div>
    </div>
  );
}
