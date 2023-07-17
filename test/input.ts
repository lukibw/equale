import { assert } from "chai";
import { verify, Token } from "../src/input";

const correct: Token[][] = [
  [4, "+", 5, "+", 6, "=", 1, 5],
  [1, 7, "-", 8, "-", 5, "=", 4],
  [1, 0, "+", 3, "-", 6, "=", 7],
  [3, "*", 3, "+", 5, "=", 1, 4],
  [2, 3, "*", 5, "=", 1, 1, 5],
  [3, 0, "/", 6, "-", 1, "=", 4],
  [5, 1, 2, "/", 8, "=", 6, 4],
  [1, 2, "%", 5, "+", 3, "=", 5],
  [1, 1, "-", 8, "%", 3, "=", 9],
  [2, "^", 3, "+", 4, "=", 1, 2],
  [3, "^", 4, "+", 9, "=", 9, 0],
];

const incorrect: Token[][] = [
  [7, "+", 2, "+", 9, "=", 1, 9],
  [1, 5, "-", 6, "-", 3, "=", 7],
  [1, 3, "+", 1, "-", 5, "=", 8],
  [4, "*", 3, "+", 7, "=", 2, 0],
  [5, 7, "*", 6, "=", 3, 4, 1],
  [5, 6, "/", 7, "-", 2, "=", 7],
  [3, 4, 3, "/", 7, "=", 4, 8],
  [1, 1, "%", 4, "+", 1, "=", 3],
  [1, 3, "-", 9, "%", 5, "=", 8],
  [3, "^", 3, "+", 3, "=", 2, 9],
  [4, "^", 2, "+", 4, "=", 2, 1],
  [7, 2, "/", 8, "=", 9],
  [9, "*", 7, "=", 6, 3],
  [5, "*", 2, "*", 9, "+", 9, "=", 9, 9],
  [2, "^", 5, "%", 9, "+", 1, 2, "=", 1, 7],
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
