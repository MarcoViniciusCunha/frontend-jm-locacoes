import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi"; // ✅ Ícone de busca do react-icons
import styles from "./Clientes.module.css";

const Clientes = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listaItens();
  }, []);

  const listaItens = async () => {
    try {
      setLoading(true);
      const res = await ClientesService.lista();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao listar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!name.trim()) return listaItens();

    try {
      setLoading(true);
      const res = await ClientesService.getByName(name.trim());
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        alert(err.response.data.message || "Nenhum cliente encontrado.");
      } else {
        alert("Erro ao buscar cliente.");
      }
      listaItens();
    } finally {
      setName("");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.icon} size={18} /> {/* Ícone aqui */}
          <input
            type="text"
            placeholder="Digite o nome do cliente..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      <ul>
        <li className={styles.header}>
          <span className={styles.nome}>Nome</span>
          <span className={styles.cpf}>CPF</span>
          <span className={styles.acoes}>Ações</span>
        </li>

        {customers.length === 0 ? (
          <p className={styles.empty}>Nenhum cliente encontrado.</p>
        ) : (
          customers.map((item) => (
            <li key={item.id}>
              <span className={styles.nome}>{item.nome}</span>
              <span className={styles.cpf}>{item.cpf}</span>
              <Link to={`/clientes/${item.id}`}>
                <button>Perfil</button>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Clientes;
