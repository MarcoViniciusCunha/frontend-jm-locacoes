import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import styles from "./ClientesList.module.css";

const ClientesList = ({ onSelect }) => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await ClientesService.lista();
        setClientes(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const filtrados = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      c.cpf?.includes(busca)
  );

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Buscar cliente por nome ou CPF..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className={styles.search}
      />

      {loading ? (
        <p>Carregando...</p>
      ) : filtrados.length > 0 ? (
        <ul className={styles.list}>
          {filtrados.map((c) => (
            <li
              key={c.id}
              className={styles.item}
              onClick={() => onSelect && onSelect(c)}
            >
              <span>{c.nome}</span>
              <span className={styles.cpf}>{c.cpf}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Nenhum cliente encontrado.</p>
      )}
    </div>
  );
};

export default ClientesList;
