import styles from "./NavBar.module.css";
import logo from "../../assets/logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function BarraNavegacao() {
  const { logout } = useAuthContext();
  const navegar = useNavigate();

  const confirmarLogout = () => {
    const desejaSair = window.confirm("Você tem certeza de que deseja sair?");
    if (!desejaSair) return;

    logout();
    navegar("/login");
  };

  const gerarClasseLink = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.cabecalho}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logo} alt="Logo JM Locações" className={styles.logo} />
        </Link>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" className={gerarClasseLink}>
          Home
        </NavLink>

        <NavLink to="/locacoes" className={gerarClasseLink}>
          Locações
        </NavLink>

        <NavLink to="/veiculos" className={gerarClasseLink}>
          Veículos
        </NavLink>

        <NavLink to="/clientes" className={gerarClasseLink}>
          Clientes
        </NavLink>

        <NavLink to="/pagamentos" className={gerarClasseLink}>
          Pagamentos
        </NavLink>
      </nav>

      <button onClick={confirmarLogout} className={styles.logoutButton}>
        Sair
      </button>
    </header>
  );
}
