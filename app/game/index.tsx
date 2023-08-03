"use client";

import { Board } from "./board";
import { Keyboard } from "./keyboard";
import { Token } from "./input";

export function Game() {
  const handleBackspace = () => {
    console.log("backspace");
  };
  const handleEnter = () => {
    console.log("enter");
  };
  const handleToken = (token: Token) => {
    console.log(token);
  };
  return (
    <>
      <Board
        state={[
          [
            { guess: "correct", token: 7 },
            { guess: "correct", token: 2 },
            { guess: "absent", token: "+" },
            { guess: "present", token: 1 },
            { guess: "present", token: 1 },
            { guess: "correct", token: "=" },
            { guess: "absent", token: 8 },
            { guess: "present", token: 3 },
          ],
          [
            { guess: null, token: 7 },
            { guess: null, token: 2 },
            { guess: null, token: "-" },
            null,
            null,
            null,
            null,
            null,
          ],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
        ]}
      />
      <Keyboard
        onBackspace={handleBackspace}
        onEnter={handleEnter}
        onToken={handleToken}
      />
    </>
  );
}
