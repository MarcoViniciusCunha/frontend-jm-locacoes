import { FiAlertCircle } from "react-icons/fi";
import styles from "./ConfirmModal.module.css";

export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <FiAlertCircle className={styles.icon} />
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            {title}
          </button>
        </div>
      </div>
    </div>
  );
}
