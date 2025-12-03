import { useEffect, useState } from "react";
import styles from "./MensagemErro.module.css";

export default function MessageBox({
  type = "info",
  message,
  duration = 4000,
  onClose,
}) {
  const [internalMessage, setInternalMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    setInternalMessage(message);

    const timer = setTimeout(() => {
      setInternalMessage("");
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!internalMessage) return null;

  return (
    <div className={`${styles.box} ${styles[type]}`}>{internalMessage}</div>
  );
}
