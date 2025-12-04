import { useEffect, useState } from "react";
import styles from "./MensagemErro.module.css";

export default function MessageBox({
  type = "info",
  message,
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const [internalMessage, setInternalMessage] = useState("");

  useEffect(() => {
    if (!message) {
      setVisible(false);
      setInternalMessage("");
      return;
    }

    setVisible(false);
    setInternalMessage("");

    const showTimer = setTimeout(() => {
      setInternalMessage(message);
      setVisible(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.box} ${styles[type]}`}>{internalMessage}</div>
  );
}
