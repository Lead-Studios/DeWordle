"use client";
import { createContext, useState, useEffect } from "react";
import { useGetWord, useValidateGuess } from "@/app/hooks/useGetWord";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [targetWord, setTargetWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [userData, setUserData] = useState({});

  // Get user data from local storage
  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const [gridData, setGridData] = useState(
    Array(30)
      .fill()
      .map(() => ({ char: "", status: "" }))
  );

  const { mutate: fetchWord, isLoading: wordLoading } = useGetWord();
  const { mutate: validateGuess, isLoading: validationLoading } =
    useValidateGuess();

  useEffect(() => {
    fetchWord(undefined, {
      onSuccess: (response) => {
        const word = response.data.word;
        console.log("Word set in context:", word);
        setTargetWord(word.toUpperCase());
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Error fetching word:", error);
        setMessage("Error loading game. Please try again.");
        setIsLoading(false);
      },
    });
  }, [fetchWord]);

  const validateCurrentWord = async () => {
    if (currentCol !== 5) {
      setMessage("Word must be 5 letters");
      return false;
    }

    const startIdx = currentRow * 5;
    const currentWord = gridData
      .slice(startIdx, startIdx + 5)
      .map((cell) => cell.char)
      .join("");

    let remainingLetters = [...targetWord];
    const newGridData = [...gridData];

    // First pass: Mark correct letters (green)
    for (let i = 0; i < 5; i++) {
      const cellIndex = startIdx + i;
      const guessedLetter = currentWord[i];

      if (guessedLetter === targetWord[i]) {
        newGridData[cellIndex].status = "correct";
        remainingLetters[i] = null; // Mark this position as used
      }
    }

    // Second pass: Mark present letters (orange)
    for (let i = 0; i < 5; i++) {
      const cellIndex = startIdx + i;
      const guessedLetter = currentWord[i];

      // Skip letters that were already marked as correct
      if (newGridData[cellIndex].status === "correct") continue;

      const letterPosition = remainingLetters.indexOf(guessedLetter);
      if (letterPosition !== -1) {
        newGridData[cellIndex].status = "present";
        remainingLetters[letterPosition] = null; // Mark this letter as used
      } else {
        newGridData[cellIndex].status = "absent";
      }
    }

    setGridData(newGridData);

    // Check if the word is correct
    const isCorrect = currentWord === targetWord;
    if (isCorrect) {
      setMessage("Congratulations! You got it right!");
      setGameOver(true);
      return true;
    }

    // Check if game is over (all rows used)
    if (currentRow === 5) {
      setMessage(`Game over! The word was ${targetWord}`);
      setGameOver(true);
    }

    return false;
  };

  // Reset the game
  const resetGame = () => {
    setCurrentRow(0);
    setCurrentCol(0);
    setGridData(
      Array(30)
        .fill()
        .map(() => ({ char: "", status: "" }))
    );
    setMessage("");
    setGameOver(false);
    setIsLoading(true);

    fetchWord(undefined, {
      onSuccess: (response) => {
        const word = response.data.word;
        setTargetWord(word.toUpperCase());
        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Error fetching word:", error);
        setMessage("Error loading game. Please try again.");
        setIsLoading(false);
      },
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRow,
        setCurrentRow,
        currentCol,
        setCurrentCol,
        gridData,
        setGridData,
        targetWord,
        isLoading: isLoading || wordLoading || validationLoading,
        message,
        setMessage,
        gameOver,
        validateCurrentWord,
        resetGame,
        userData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
