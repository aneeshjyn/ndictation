import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WordGame from "./WordGame";
import WordInput from "./WordInput";

const App = () => {
  const [wordsList, setWordsList] = useState(["happy", "pretty", "funny"]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WordGame wordsList={wordsList} />} />
        <Route path="/input" element={<WordInput setWordsList={setWordsList} />} />
      </Routes>
    </Router>
  );
};

export default App;
