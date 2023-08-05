import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.container}>
      <h1 className={styles.header}>404</h1>
      <p className={styles.paragraph}>This page could not be found.</p>
      <Link href="/" className={styles.link}>
        Homepage
      </Link>
    </main>
  );
}
