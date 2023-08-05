import { create } from "zustand";
import { Token, Guess, generate, verify, compare } from "../equation";

export enum Message {
  TooShort,
  Invalid,
  Correct,
  End,
}

export const ROWS = 6;
export const COLUMNS = 8;

export interface TileData {
  token: Token;
  guess: Guess | null;
}

export type TileState = TileData | null;

export type BoardState = TileState[][];

export interface Store {
  answer: Token[];
  board: BoardState;
  row: number | null;
  column: number | null;
  msg: Message | null;
  handleBackspace(): void;
  handleEnter(): void;
  handleToken(token: Token): void;
}

const createBoard = () => {
  const board: BoardState = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLUMNS; j++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
};

const createAnswer = () => {
  return generate((min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  });
};

const copy = (prev: BoardState) => {
  const next: BoardState = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLUMNS; j++) {
      row.push(prev[i][j]);
    }
    next.push(row);
  }
  return next;
};

const isCorrect = (guesses: Guess[]) => {
  return (
    guesses.filter((guess) => guess === "correct").length === guesses.length
  );
};

export const useStore = create<Store>((set) => {
  return {
    answer: createAnswer(),
    board: createBoard(),
    column: 0,
    row: 0,
    msg: null,

    handleBackspace() {
      set(({ board, row, column }) => {
        if (row === null || column === 0) {
          return {};
        }
        const next = copy(board);
        if (column === null) {
          next[row][COLUMNS - 1] = null;
          return { board: next, column: COLUMNS - 1, msg: null };
        } else {
          next[row][column - 1] = null;
          return { board: next, column: column - 1, msg: null };
        }
      });
    },
    handleEnter() {
      set(({ board, column, row, answer }) => {
        if (row === null) {
          return {};
        }
        if (column !== null) {
          return { msg: Message.TooShort };
        }
        const equation: Token[] = [];
        for (const tile of board[row]) {
          equation.push(tile!.token);
        }
        if (!verify(equation)) {
          return { msg: Message.Invalid };
        }
        const next = copy(board);
        const guesses = compare(answer, equation);
        guesses.forEach((guess, i) => {
          next[row][i]!.guess = guess;
        });
        if (isCorrect(guesses)) {
          return { board: next, msg: Message.Correct };
        } else if (row === ROWS - 1) {
          return { board: next, row: null, msg: Message.End };
        } else {
          return { board: next, row: row + 1, column: 0, msg: null };
        }
      });
    },
    handleToken(token: Token) {
      set(({ board, row, column }) => {
        if (row === null || column === null) {
          return {};
        }
        const next = copy(board);
        next[row][column] = { token, guess: null };
        return {
          board: next,
          column: column === COLUMNS - 1 ? null : column + 1,
          msg: null,
        };
      });
    },
  };
});
