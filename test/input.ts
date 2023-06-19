import { assert } from "chai";
import { verify, Token } from "../src/input";

const correct: Token[][] = [
  [2, "+", 2, "=", 4],
  [5, "-", 3, "=", 2],
  [7, "*", 2, "=", 1, 4],
  [1, 5, "/", 3, "=", 5],
  [1, 2, "%", 5, "=", 2],
  [2, "^", 3, "=", 8],
  [5, "+", 4, "-", 3, "=", 6],
  [2, "*", 3, "+", 1, "=", 7],
  [4, "*", 3, "/", 2, "=", 6],
  [1, 2, "-", 1, 0, "/", 5, "=", 1, 0],
  [1, 3, "%", 2, "*", 6, "=", 6],
  [1, 1, "%", 3, "^", 2, "=", 2],
  [2, "^", 2, "^", 2, "=", 1, 6],
];

const incorrect: Token[][] = [
  [2, "+", 2, "=", 3],
  [5, "*", 2, "-", 4, "=", 5],
  [2, "^", 3, "%", 3, "=", 1],
  ["+", 3, "-", 2, "=", 1],
  ["*", 2, "*", 2, "%", 3, "=", 1],
  [5, "+", "+", 4, "=", 9],
  [3, "*", 3, "-", "-", 2, "=", 7],
  [2, "+", "^", "%", "=", 2],
  [9, "=", 9],
  [6, "="],
  ["+", "-"],
  ["=", 8],
  ["="],
  [1, 2],
  [],
];

const toString = (tokens: Token[]) => {
  let s = "";
  for (let i = 0; i < tokens.length; i++) {
    if (
      i === 0 ||
      (typeof tokens[i] === "number" && typeof tokens[i - 1] === "number")
    ) {
      s += tokens[i];
    } else {
      s += " ";
      s += tokens[i];
    }
  }
  return s;
};

describe("verify", function () {
  for (const tokens of correct) {
    it(`'${toString(tokens)}' is correct`, function () {
      assert.equal(verify(tokens), true);
    });
  }
  for (const tokens of incorrect) {
    it(`'${toString(tokens)}' is incorrect`, function () {
      assert.equal(verify(tokens), false);
    });
  }
});
