import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import styles from "./ClientesList.module.css";
import MessageBox from "../erro/MensagemErro";
import useApiMessage from "../../hooks/UseApiError";

export default function ListaClientes({ aoSelecionar }) {
  const [clientes, setClientes] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const { mensagem, tipoMensagem, messageKey, handleApiError } =
    useApiMessage();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const resposta = await ClientesService.lista();
      setClientes(resposta.data || []);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      handleApiError(
        err,
        "Não foi possível carregar a lista de clientes. Tente novamente."
      );
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
      <MessageBox
        type={tipoMensagem}
        message={mensagem}
        msgKey={messageKey}
        duration={4000}
        onClose={() => {}} // pode deixar vazio
      />

      <input
        type="text"
        placeholder="Buscar cliente pelo nome"
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
              <span className={styles.cpf}>{cliente.cpfMasked}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Nenhum cliente encontrado.</p>
      )}
    </div>
  );
}
