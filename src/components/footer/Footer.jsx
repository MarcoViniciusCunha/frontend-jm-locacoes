import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {year} <span className={styles.brand}>JM Locações</span> — Todos
        os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
