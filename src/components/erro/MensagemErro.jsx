import styles from "./MensagemErro.module.css";

export default function MessageBox({ type = "info", message }) {
  if (!message) return null;

  return <div className={`${styles.box} ${styles[type]}`}>{message}</div>;
}
