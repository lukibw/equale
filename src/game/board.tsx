import { Tile } from "./tile";
import styles from "./board.module.css";

export function Board() {
  return (
    <div className={styles.board}>
      {[...Array(6)].map((_, i) => (
        <div
          className={styles.row}
          role="group"
          aria-label={`row ${i + 1}`}
          key={i}
        >
          {[...Array(8)].map((_, j) => {
            return <Tile row={i} column={j} key={j} />;
          })}
        </div>
      ))}
    </div>
  );
}
