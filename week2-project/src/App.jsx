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
  const [history, setHistory] = useState([0]); // start with first card
  const [historyIndex, setHistoryIndex] = useState(0);

  const nextCard = () => {
    if (historyIndex < history.length - 1) {
      // move forward in history
      setHistoryIndex(historyIndex + 1);
    } else if (history.length < cards.length) {
      // pick a random card not yet in history
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * cards.length);
      } while (history.includes(newIndex));
      setHistory([...history, newIndex]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const previousCard = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const currentCard = cards[history[historyIndex]];

  return (
    <div className="App">
      <h1>The Fruit Card Guesser</h1>
      <p>Let's see how great you are with knowing the fruit!</p>
      <p>
        Card {historyIndex + 1} of {cards.length}
      </p>

      <FlashCard
        question={currentCard.question}
        answer={currentCard.answer}
        hint={currentCard.hint}
      />

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
