import { Token, Guess } from "./types";

export const compare = (answer: Token[], input: Token[]) => {
  const result = Array<Guess>(8).fill("absent");
  const taken = Array<boolean>(8).fill(false);
  input.forEach((token, i) => {
    if (token === answer[i]) {
      result[i] = "correct";
      taken[i] = true;
    }
  });
  input.forEach((token, i) => {
    if (result[i] === "correct") {
      return;
    }
    const index = answer.findIndex(
      (answerToken, j) => token === answerToken && !taken[j]
    );
    if (index !== -1) {
      result[i] = "present";
      taken[index] = true;
    }
  });
  return result;
};
