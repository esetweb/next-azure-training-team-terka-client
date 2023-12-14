
import styles from '../styles/Home.module.css';

export default function Header() {
    return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Team Terka</h1>
      <button className={styles.flexButton}>Cart</button>
    </header>
  );
};