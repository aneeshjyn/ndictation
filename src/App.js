import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Volume2 } from "lucide-react"; // Install with: npm install lucide-react

// List of words for the game
const wordsList = ["happy", "pretty", "funny"];

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // A-Z Letters

const WordGame = () => {
  const [word, setWord] = useState("");
  const [userWord, setUserWord] = useState([]);
  const [result, setResult] = useState(null);
  const [lastWord, setLastWord] = useState(""); // Track previous word

  const startGame = () => {
    let newWord;
    // Ensure the new word is different from the last word
    do {
      newWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    } while (newWord === lastWord && wordsList.length > 1);
    setWord(newWord.toUpperCase());
    setLastWord(newWord); // Update last word
    setUserWord(new Array(newWord.length).fill(""));
    setResult(null);

    speakWord(newWord);
  };

  const speakWord = (word) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US"; // Set language
      utterance.rate = 0.8; // Adjust speed (0.1 - 2)
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in your browser.");
    }
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
        className="w-10 h-10 border border-dashed flex items-center justify-center m-1 cursor-pointer"
        style={{ backgroundColor: isOver ? "lightgreen" : "white" }}
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

  const verifyWord = () => {
    if (userWord.join("") === word) {
      setResult("Correct!");
  
      setTimeout(() => {
        startGame(); // Start a new word
      }, 2000);
    } else {
      setResult("Try Again");
    }
  };
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 flex flex-col items-center">
        {/* Start Game Button */}
      <button onClick={startGame} className="p-2 bg-green-500 text-white rounded mt-4">
        Start Game
      </button>

      {/* Play Audio Button */}
      {word && (
        <button onClick={() => speakWord(word)} className="mt-2 flex items-center gap-2 p-2 bg-gray-200 rounded">
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
        {result && <p className="mt-2 text-lg">{result}</p>}
      </div>
    </DndProvider>
  );
};

export default WordGame;
