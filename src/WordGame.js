import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import correctSound from "./audio/correct.wav";
import incorrectSound from "./audio/incorrect.wav";

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const WordGame = ({ wordsList }) => {
  const [word, setWord] = useState("");
  const [userWord, setUserWord] = useState([]);
  const [result, setResult] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [feedbackClass, setFeedbackClass] = useState(""); // To trigger animations

  const startGame = () => {
    if (wordsList.length === usedWords.length) {
      setResult("Game Over! You've completed all the words.");
      return;
    }

    let newWord;
    do {
      newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    } while (usedWords.includes(newWord));

    setWord(newWord.toUpperCase());
    setUserWord(new Array(newWord.length).fill(""));
    setResult(null);
    setUsedWords([...usedWords, newWord]);
    setFeedbackClass(""); // Reset animations
    speakWord(newWord);
  };

  const speakWord = (word) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const verifyWord = () => {
    const isCorrect = userWord.join("") === word;

    if (isCorrect) {
      setResult("Correct!");
      setScore(score + 1);
      setFeedbackClass("animate-bounce text-green-500"); // Trigger bounce effect
      playSound(correctSound); // Play success sound
      setTimeout(startGame, 2000);
    } else {
      setResult("Try Again");
      setFeedbackClass("animate-shake text-red-500"); // Trigger shake effect
      playSound(incorrectSound); // Play error sound
    }
  };

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play();
  };

  const Letter = ({ letter }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "LETTER",
      item: { letter },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className="p-2 border rounded text-center m-1 bg-gray-300 cursor-pointer"
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {letter}
      </div>
    );
  };

  const DropSlot = ({ index }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: "LETTER",
      drop: (item) => handleDrop(item, index),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

    return (
      <div
        ref={drop}
        className={`w-10 h-10 border border-dashed flex items-center justify-center m-1 cursor-pointer ${
          isOver ? "bg-lightgreen" : "bg-white"
        }`}
        onClick={() => removeLetter(index)}
      >
        {userWord[index]}
      </div>
    );
  };

  const handleDrop = (item, index) => {
    if (userWord[index] === "") {
      let newUserWord = [...userWord];
      newUserWord[index] = item.letter;
      setUserWord(newUserWord);
    }
  };

  const removeLetter = (index) => {
    let newUserWord = [...userWord];
    newUserWord[index] = "";
    setUserWord(newUserWord);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 flex flex-col items-center">
        <button
          onClick={startGame}
          className="p-2 bg-green-500 text-white rounded mt-4"
        >
          Start Game
        </button>

        {word && (
          <button
            onClick={() => speakWord(word)}
            className="mt-2 flex items-center gap-2 p-2 bg-gray-200 rounded"
          >
            <Volume2 size={20} />
            Repeat Word
          </button>
        )}

        {/* Display All Alphabets */}
        <div className="flex flex-wrap w-64 justify-center mt-4">
          {ALPHABETS.map((letter, i) => (
            <Letter key={i} letter={letter} />
          ))}
        </div>

        {/* Drop Slots for Word */}
        <div className="flex mt-4">
          {userWord.map((_, i) => (
            <DropSlot key={i} index={i} />
          ))}
        </div>

        <button
          onClick={verifyWord}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Verify
        </button>

        {/* Feedback */}
        {result && (
          <p className={`mt-2 text-lg ${feedbackClass}`}>{result}</p>
        )}

        {/* Score Display */}
        <p className="mt-2 text-lg">Score: {score}</p>

        {/* Link to Input Page */}
        <Link to="/input" className="mt-4 text-blue-500 underline">
          Set Custom Words
        </Link>
      </div>
    </DndProvider>
  );
};

export default WordGame;
