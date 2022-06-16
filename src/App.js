import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const alphabets = "abcdefghijklmnopqrstuvwxyz";
  const [randomChar, setRandomChar] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [miliSeconds, setMiliSeconds] = useState(0);
  const [counter, setCounter] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setMiliSeconds(miliSeconds + 1);
      if (miliSeconds === 99) {
        setSeconds(seconds + 1);
        setMiliSeconds(0);
      }
    }, 10);

    return () => clearInterval(timerRef.current);
  });

  useEffect(() => {
    generateRandomChar();
  }, []);

  const generateRandomChar = () => {
    setRandomChar(alphabets[Math.floor(Math.random() * alphabets.length)]);
  };

  const handleChange = useCallback(
    (e) => {
      if (e.key === randomChar) {
        setCounter(counter + 1);
        generateRandomChar();
      } else {
        if (miliSeconds > 50) {
          setMiliSeconds(miliSeconds % 100);
          setSeconds(seconds + 1);
        } else setMiliSeconds(miliSeconds + 50);
      }
    },
    [counter, seconds, miliSeconds, randomChar]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleChange);

    return () => {
      document.removeEventListener("keydown", handleChange);
    };
  }, [handleChange]);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (counter > 19) {
      document.removeEventListener("keydown", handleChange);
      stopTimer();
      if (!localStorage.getItem("bestScore")) {
        localStorage.setItem("bestScore", seconds * 100 + miliSeconds);
        setRandomChar("Success!");
      } else if (
        localStorage.getItem("bestScore") >
        seconds * 100 + miliSeconds
      ) {
        localStorage.setItem("bestScore", seconds * 100 + miliSeconds);
        setRandomChar("Success!");
      } else if (
        localStorage.getItem("bestScore") <
        seconds * 100 + miliSeconds
      ) {
        setRandomChar("Failure:(");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, randomChar, seconds]);

  return (
    <div className="app">
      <p style={{ marginBottom: "5px" }}>Type The Alphabet</p>
      <p>Typing game to see how fast you type. Timer starts when you do :)</p>
      <div className="card">
        <p className="char">{randomChar.toUpperCase()}</p>
      </div>

      <p>
        Time : {seconds}.{miliSeconds}
      </p>
      <p>
        my best time : {(localStorage.getItem("bestScore") / 100).toFixed(2)}{" "}
      </p>
    </div>
  );
};

export default App;
