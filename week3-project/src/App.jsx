import { useState } from "react";
import FlashCard from "./components/FlashCard";
import "./App.css";

const cards = [
  {
    question: "🍎 What fruit is this?",
    answer: "Apple",
    hint: "Keeps the doctor away",
  },
  {
    question: "🍌 What fruit is this?",
    answer: "Banana",
    hint: "Monkeys love it",
  },
  {
    question: "🍇 What fruit is this?",
    answer: "Grapes",
    hint: "Can be made into wine",
  },
  {
    question: "🍍 What fruit is this?",
    answer: "Pineapple",
    hint: "Spiky outside, sweet inside",
  },
  {
    question: "🍊 What fruit is this?",
    answer: "Orange",
    hint: "Rich in vitamin C",
  },
  {
    question: "🍉 What fruit is this?",
    answer: "Watermelon",
    hint: "Juicy and eaten in summer",
  },
  {
    question: "🥭 What fruit is this?",
    answer: "Mango",
    hint: "King of fruits in India",
  },
  {
    question: "🍓 What fruit is this?",
    answer: "Strawberry",
    hint: "Red with tiny seeds on the outside",
  },
  {
    question: "🥝 What fruit is this?",
    answer: "Kiwi",
    hint: "Brown fuzzy skin, green inside",
  },
];

const App = () => {
  const [history, setHistory] = useState([0]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [guessInput, setGuessInput] = useState("");
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const currentCard = cards[history[historyIndex]];

  const handleGuess = () => {
    const userGuess = guessInput.trim().toLowerCase();
    const correctAnswer = currentCard.answer.toLowerCase();

    if (userGuess === correctAnswer) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
      if (score + 1 > maxScore) setMaxScore(score + 1);
    } else {
      setFeedback("❌ Wrong! Try Again.");
      setScore(0);
    }

    setGuessInput("");
  };

  const nextCard = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    } else if (history.length < cards.length) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * cards.length);
      } while (history.includes(newIndex));
      setHistory([...history, newIndex]);
      setHistoryIndex(historyIndex + 1);
    }
    setFeedback("");
  };

  const previousCard = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setFeedback("");
    }
  };

  return (
    <div className="App">
      <h1>The Fruit Card Guesser</h1>
      <p>Let's see how great you are with knowing the fruit!</p>
      <p>
        Card {historyIndex + 1} of {cards.length}
      </p>
      <p>
        Current Streak: {score}, Longest Streak: {maxScore}
      </p>

      <FlashCard
        question={currentCard.question}
        answer={currentCard.answer}
        hint={currentCard.hint}
      />

      <div className="guess-section">
        <p>Guess the answer here:</p>
        <div className="guess-row">
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Type your guess"
            className={
              feedback.includes("Correct")
                ? "correct-input"
                : feedback.includes("Wrong")
                ? "wrong-input"
                : ""
            }
          />
          <button onClick={handleGuess}>Submit Guess</button>
        </div>
        <p>{feedback}</p>
      </div>

      <div className="controls">
        <button onClick={previousCard} disabled={historyIndex === 0}>
          Previous
        </button>
        <button
          onClick={nextCard}
          disabled={
            history.length === cards.length &&
            historyIndex === history.length - 1
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
