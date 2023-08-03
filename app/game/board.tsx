import { Token } from "./input";
import styles from "./board.module.css";
import { operatorMap } from "./operator";

export interface BoardTileData {
  token: Token;
  guess: "correct" | "present" | "absent" | null;
}

export type BoardTileState = BoardTileData | null;

const getTileAriaLabel = (state: BoardTileState) => {
  if (!state) {
    return "empty";
  }
  const { guess, token } = state;
  let readable;
  if (typeof token === "number") {
    readable = token.toString();
  } else {
    readable = operatorMap[token].label;
  }
  if (!guess) {
    return readable;
  }
  return `${readable} ${guess}`;
};

const getTileContent = (state: BoardTileState) => {
  if (!state) {
    return null;
  }
  const { token } = state;
  if (typeof token === "number") {
    return token;
  }
  const Operator = operatorMap[token].Icon;
  return <Operator />;
};

const getTileClassName = (state: BoardTileState) => {
  if (state?.guess) {
    return `${styles.tile} ${styles[state.guess]}`;
  } else {
    return styles.tile;
  }
};

export type BoardState = BoardTileState[][];

export interface BoardProps {
  state: BoardState;
}

export function Board({ state }: BoardProps) {
  return (
    <div className={styles.container}>
      {state.map((row, index) => (
        <div
          className={styles.row}
          role="group"
          aria-label={`row ${index + 1}`}
          key={index}
        >
          {row.map((state, index) => {
            return (
              <div
                className={getTileClassName(state)}
                role="img"
                aria-roledescription="tile"
                aria-live="polite"
                aria-label={getTileAriaLabel(state)}
                key={index}
              >
                {getTileContent(state)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
