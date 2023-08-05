"use client";

import { useCallback, useEffect } from "react";
import { Digit, Operator } from "../equation";
import { Board } from "./board";
import { Keyboard } from "./keyboard";
import { useStore } from "./store";

export function Game() {
  const handleEnter = useStore((state) => state.handleEnter);
  const handleBackspace = useStore((state) => state.handleBackspace);
  const handleToken = useStore((state) => state.handleToken);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEnter();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key >= "0" && e.key <= "9") {
        handleToken(parseInt(e.key) as Digit);
      } else if (["+", "-", "*", "/", "%", "^", "="].includes(e.key)) {
        handleToken(e.key as Operator);
      }
    },
    [handleBackspace, handleEnter, handleToken]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Board />
      <Keyboard
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        onToken={handleToken}
      />
    </>
  );
}
