import { useState } from "react";
import "./FlashCard.css";

const FlashCard = ({ question, answer, hint }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="front">
        <div>{question}</div>
        <small className="hint">Hint: {hint}</small>
      </div>
      <div className="back">{answer}</div>
    </div>
  );
};

export default FlashCard;
