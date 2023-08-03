import { Digit, Operator, Token } from "./input";
import styles from "./keyboard.module.css";
import { BackspaceIcon } from "./icon";
import { operatorMap } from "./operator";

export interface KeyboardProps {
  onToken: (token: Token) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export function Keyboard({ onBackspace, onEnter, onToken }: KeyboardProps) {
  return (
    <div className={styles.container} role="group" aria-label="keyboard">
      <div className={styles.row}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
          <button
            onClick={() => onToken(digit as Digit)}
            key={digit}
            className={styles.button}
          >
            {digit}
          </button>
        ))}
      </div>
      <div className={styles.row}>
        <button
          onClick={onEnter}
          className={`${styles.button} ${styles.enter}`}
        >
          ENTER
        </button>
        {Object.entries(operatorMap).map(([operator, { Icon, label }]) => (
          <button
            onClick={() => onToken(operator as Operator)}
            key={operator}
            className={styles.button}
            aria-label={label}
          >
            <Icon />
          </button>
        ))}
        <button
          onClick={onBackspace}
          className={styles.button}
          aria-label="backspace"
        >
          <BackspaceIcon />
        </button>
      </div>
    </div>
  );
}
