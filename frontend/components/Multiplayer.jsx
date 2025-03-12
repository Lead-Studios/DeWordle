"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Share2, RefreshCw } from "lucide-react";

export default function DewordleMultiplayer() {
  const [gameState, setGameState] = useState("create");
  const [player1, setPlayer1] = useState({
    name: "Player 1",
    guesses: [],
    score: 0,
  });
  const [player2, setPlayer2] = useState({
    name: "Player 2",
    guesses: [],
    score: 0,
  });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [word, setWord] = useState("REACT");
  const [guess, setGuess] = useState("");
  const [winner, setWinner] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (gameState === "play") {
      const timer = setInterval(() => {
        simulateOpponentGuess();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [gameState]); // Removed unnecessary dependency: currentPlayer

  const startGame = () => {
    setGameState("play");
    setPlayer1({ ...player1, guesses: [] });
    setPlayer2({ ...player2, guesses: [] });
    setCurrentPlayer(1);
    setWinner(null);
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.length !== 5) return;

    const newGuess = guess.toUpperCase();
    const currentPlayerObj = currentPlayer === 1 ? player1 : player2;
    const updatedGuesses = [...currentPlayerObj.guesses, newGuess];
    const score = calculateScore(newGuess);

    if (currentPlayer === 1) {
      setPlayer1({
        ...player1,
        guesses: updatedGuesses,
        score: player1.score + score,
      });
    } else {
      setPlayer2({
        ...player2,
        guesses: updatedGuesses,
        score: player2.score + score,
      });
    }

    setGuess("");
    checkGameEnd(newGuess, updatedGuesses.length);
    switchPlayer();
  };

  const calculateScore = (guess) => {
    let score = 0;
    for (let i = 0; i < 5; i++) {
      if (guess[i] === word[i]) {
        score += 2;
      } else if (word.includes(guess[i])) {
        score += 1;
      }
    }
    return score;
  };

  const checkGameEnd = (guess, guessCount) => {
    if (guess === word || guessCount === 6) {
      const winner =
        player1.score > player2.score ? player1.name : player2.name;
      setWinner(winner);
      setGameState("results");
    }
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const simulateOpponentGuess = () => {
    if (currentPlayer === 2 && gameState === "play") {
      const opponentGuess = generateRandomGuess();
      const updatedGuesses = [...player2.guesses, opponentGuess];
      const score = calculateScore(opponentGuess);
      setPlayer2({
        ...player2,
        guesses: updatedGuesses,
        score: player2.score + score,
      });
      checkGameEnd(opponentGuess, updatedGuesses.length);
      switchPlayer();
      showReactionEmoji();
    }
  };

  const generateRandomGuess = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array(5)
      .fill()
      .map(() => letters[Math.floor(Math.random() * 26)])
      .join("");
  };

  const showReactionEmoji = () => {
    const emojis = ["🔥", "😂", "😱", "🤔", "👍", "🎉"];
    setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    setShowEmoji(true);
    setTimeout(() => setShowEmoji(false), 2000);
  };

  const shareResults = () => {
    const text = `I just ${
      winner === player1.name ? "won" : "played"
    } a Dewordle multiplayer game!\n${player1.name}: ${player1.score} pts\n${
      player2.name
    }: ${player2.score} pts\nCan you beat me? Play at: example.com/dewordle`;
    if (navigator.share) {
      navigator.share({ title: "Dewordle Multiplayer Results", text: text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  const renderGameBoard = (playerObj) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{playerObj.name}</h3>
      <div className="grid grid-cols-5 gap-1">
        {Array(6)
          .fill()
          .map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {Array(5)
                .fill()
                .map((_, colIndex) => {
                  const letter = playerObj.guesses[rowIndex]?.[colIndex] || "";
                  let bgColor = "bg-gray-200 dark:bg-gray-700";
                  if (letter) {
                    if (letter === word[colIndex]) {
                      bgColor = "bg-green-500";
                    } else if (word.includes(letter)) {
                      bgColor = "bg-yellow-500";
                    } else {
                      bgColor = "bg-gray-400 dark:bg-gray-600";
                    }
                  }
                  return (
                    <div
                      key={colIndex}
                      className={`w-10 h-10 ${bgColor} flex items-center justify-center text-white font-bold rounded`}
                    >
                      {letter}
                    </div>
                  );
                })}
            </React.Fragment>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-80 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Dewordle Multiplayer
        </h1>

        {gameState === "create" && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Challenge a Friend</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Start a new game and challenge your friend to solve the word!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Start New Game
            </button>
          </div>
        )}

        {gameState === "play" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">
                Current Turn:{" "}
                {currentPlayer === 1 ? player1.name : player2.name}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {player1.name}: {player1.score}
                </span>
                <span className="text-gray-500">vs</span>
                <span className="font-medium">
                  {player2.name}: {player2.score}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {renderGameBoard(player1)}
              {renderGameBoard(player2)}
            </div>

            {currentPlayer === 1 && (
              <form onSubmit={handleGuess} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value.toUpperCase())}
                    maxLength={5}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your guess"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Guess
                  </button>
                </div>
              </form>
            )}

            {currentPlayer === 2 && (
              <div className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Waiting for {player2.name} to make a guess...
              </div>
            )}

            {showEmoji && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
                {emoji}
              </div>
            )}
          </div>
        )}

        {gameState === "results" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {winner === player1.name ? "You Won!" : "Game Over!"}
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="text-center">
                <p className="font-semibold">{player1.name}</p>
                <p className="text-2xl font-bold">{player1.score}</p>
              </div>
              <div className="text-4xl font-bold text-gray-400">vs</div>
              <div className="text-center">
                <p className="font-semibold">{player2.name}</p>
                <p className="text-2xl font-bold">{player2.score}</p>
              </div>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              The word was: <span className="font-bold">{word}</span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={startGame}
                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Rematch
              </button>
              <button
                onClick={shareResults}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
