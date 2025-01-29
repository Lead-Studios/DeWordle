export const helpContent = {
    gettingStarted: [
      {
        title: "Creating Your Account",
        content:
          "Sign up with your email or social media account to get started. Complete your profile to personalize your experience.",
      },
      {
        title: "Basic Navigation",
        content:
          "Use the top navigation bar to move between different sections. The sidebar contains quick access to your favorite features.",
      },
      {
        title: "First Steps",
        content:
          "Start by exploring the song library, create your first playlist, or join a music quiz to test your knowledge.",
      },
    ],
    features: [
      {
        type: "header",
        title: "How To Play",
        subtitle: "Guess the Wordle in 6 tries.",
      },
      {
        type: "rules",
        items: [
          "Each guess must be a valid 5-letter word.",
          "The color of the tiles will change to show how close your guess was to the word.",
        ],
      },
      {
        type: "examples",
        title: "Examples",
        items: [
          {
            word: ["W", "O", "R", "D", "Y"],
            correctIndex: 0,
            explanation: " is in the word and in the correct spot.",
          },
          {
            word: ["L", "I", "G", "H", "T"],
            presentIndex: 1,
            explanation: " is in the word but in the wrong spot.",
          },
          {
            word: ["R", "O", "G", "U", "E"],
            absentIndex: 3,
            // correctIndex: 0,
            explanation: " is not in the word in any spot.",
          },
        ],
      },
      {
        type: "footer",
        content:
          "A new puzzle is released daily at midnight. If you haven't already, you can sign up for our daily reminder email.",
      },
    ],
    troubleshooting: [
      {
        title: "Connection Issues",
        content:
          "If you're experiencing connection problems, check your internet connection and try refreshing the page.",
      },
      {
        title: "Audio Problems",
        content: "Ensure your device's volume is turned on and you've granted necessary permissions for audio playback.",
      },
      {
        title: "Account Recovery",
        content: "Forgot your password? Use the 'Forgot Password' link on the login page to reset it via email.",
      },
    ],
  }
  
  