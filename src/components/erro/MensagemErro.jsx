import { useEffect, useState } from "react";
import styles from "./MensagemErro.module.css";

export default function MessageBox({
  type = "info",
  message,
  msgKey,
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, msgKey, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`${styles.box} ${styles[type]} ${
        visible ? styles.show : styles.hide
      }`}
    >
      {message}
    </div>
  );
}
