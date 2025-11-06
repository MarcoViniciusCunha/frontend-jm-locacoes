import styles from "./NavBar.module.css";
import logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Você tem certeza de que deseja sair?"
    );
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <header className={styles.cabecalho}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logo} alt="Logo JM Locações" className={styles.logo} />
        </Link>
      </div>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/locacoes"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Locações
        </NavLink>
        <NavLink
          to="/veiculos"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Veículos
        </NavLink>
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Clientes
        </NavLink>
        <NavLink
          to="/pagamentos"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          Pagamentos
        </NavLink>
      </nav>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Sair
      </button>
    </header>
  );
};

export default NavBar;
