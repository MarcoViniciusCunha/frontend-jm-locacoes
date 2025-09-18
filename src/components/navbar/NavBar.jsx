import "./NavBar.css";
import logo from "../../assets/logo.jpeg";
import { NavLink, Link } from "react-router-dom";

const NavBar = () => {
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
      </nav>
    </header>
  );
};

export default NavBar;
