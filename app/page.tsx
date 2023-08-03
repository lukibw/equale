import styles from "./page.module.css";
import { Game } from "./game";

export default function Page() {
  return (
    <main className={styles.container}>
      <h1 className={styles.header}>Equale</h1>
      <Game />
    </main>
  );
}
