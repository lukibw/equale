import { useMemo } from "react";
import { useStore } from "./store";
import { operatorMap } from "./operator";
import styles from "./tile.module.css";

export interface TileProps {
  row: number;
  column: number;
}

export function Tile({ column, row }: TileProps) {
  const guess = useStore((state) => state.board[row][column]?.guess ?? null);
  const token = useStore((state) => state.board[row][column]?.token ?? null);

  const className = useMemo(() => {
    if (guess) {
      return `${styles.tile} ${styles[guess]}`;
    } else {
      return styles.tile;
    }
  }, [guess]);

  const ariaLabel = useMemo(() => {
    if (token === null) {
      return "empty";
    }
    let readable;
    if (typeof token === "number") {
      readable = token.toString();
    } else {
      readable = operatorMap[token].label;
    }
    if (guess === null) {
      return readable;
    }
    return `${readable} ${guess}`;
  }, [guess, token]);

  const content = useMemo(() => {
    if (token === null) {
      return null;
    }
    if (typeof token === "number") {
      return token;
    }
    const Operator = operatorMap[token].Icon;
    return <Operator />;
  }, [token]);

  return (
    <div
      role="img"
      aria-roledescription="tile"
      aria-live="polite"
      aria-label={ariaLabel}
      className={className}
    >
      {content}
    </div>
  );
}
