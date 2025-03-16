import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const WordInput = ({ setWordsList }) => {
  const [newWords, setNewWords] = useState("");
  const navigate = useNavigate();

  const handleSaveWords = () => {
    const wordArray = newWords.split(",").map(word => word.trim()).filter(word => word);
    setWordsList(wordArray);
    navigate("/");
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-lg">Enter Words (comma-separated)</h2>
      <textarea 
        value={newWords}
        onChange={(e) => setNewWords(e.target.value)}
        className="border p-2 w-64 mt-2"
        placeholder="happy, pretty, funny"
      />
      <button onClick={handleSaveWords} className="p-2 bg-green-500 text-white rounded mt-4">
        Save & Start Game
      </button>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Back to Game
      </Link>
    </div>
  );
};

export default WordInput;
