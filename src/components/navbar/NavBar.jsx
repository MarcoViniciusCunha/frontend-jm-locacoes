import "./NavBar.css";
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
    <header className="cabecalho">
      <Link to="/">
        <img src={logo} alt="Logo JM Locações" />
      </Link>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/locacoes">Locações</NavLink>
        <NavLink to="/veiculos">Veículos</NavLink>
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/seguros">Seguros</NavLink>
        <NavLink to="/pagamentos">Pagamentos</NavLink>
        <NavLink to="/multas">Multas</NavLink>
        <NavLink to="/inspecao">Inspeção</NavLink>
        <NavLink to="/manutencao">Manutenção</NavLink>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </nav>
    </header>
  );
};

export default NavBar;
