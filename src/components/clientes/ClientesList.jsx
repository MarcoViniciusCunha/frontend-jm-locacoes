import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import styles from "./ClientesList.module.css";

export default function ListaClientes({ aoSelecionar }) {
  const [clientes, setClientes] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const resposta = await ClientesService.lista();
      setClientes(resposta.data || []);
    } catch (erro) {
      console.error("Erro ao carregar clientes:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const filtrarClientes = () => {
    const textoBusca = termoBusca.toLowerCase();

    return clientes.filter(
      (cliente) =>
        cliente.nome?.toLowerCase().includes(textoBusca) ||
        cliente.cpf?.includes(termoBusca)
    );
  };

  const clientesFiltrados = filtrarClientes();

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Buscar cliente por nome ou CPF..."
        value={termoBusca}
        onChange={(e) => setTermoBusca(e.target.value)}
        className={styles.search}
      />

      {carregando ? (
        <p>Carregando...</p>
      ) : clientesFiltrados.length > 0 ? (
        <ul className={styles.list}>
          {clientesFiltrados.map((cliente) => (
            <li
              key={cliente.id}
              className={styles.item}
              onClick={() => aoSelecionar && aoSelecionar(cliente)}
            >
              <span>{cliente.nome}</span>
              <span className={styles.cpf}>{cliente.cpf}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Nenhum cliente encontrado.</p>
      )}
    </div>
  );
}
