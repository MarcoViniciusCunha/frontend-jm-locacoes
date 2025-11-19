import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientesService } from "../../services/ClientesService";
import ClienteForm from "../../components/clientes/ClienteForm";
import styles from "./ClienteDetalhe.module.css";
import {
  FaArrowLeft,
  FaEdit,
  FaTrashAlt,
  FaSave,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(false);

  const carregarCliente = useCallback(async () => {
    try {
      const { data } = await ClientesService.getById(id);
      setCliente(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar cliente.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarCliente();
  }, [carregarCliente]);

  const salvarAlteracoes = async (dadosForm) => {
    try {
      await ClientesService.editar(id, dadosForm);
      await carregarCliente();
      setEditando(false);
      alert("Cliente atualizado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar: " + e.message);
    }
  };

  const excluirCliente = async () => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );
    if (!confirmar) return;

    try {
      await ClientesService.excluir(id);
      alert("Cliente excluído com sucesso!");
      navigate("/clientes");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir cliente: " + e.message);
    }
  };

  const voltar = () => navigate(-1);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <h1>
          <FaUserCircle /> {cliente?.nome}
        </h1>
      </div>

      <ClienteForm
        initialData={cliente}
        onSubmit={salvarAlteracoes}
        onCancel={() => setEditando(false)}
        disabled={!editando}
      />

      <div className={styles.buttonGroup}>
        {!editando ? (
          <>
            <button className={styles.backBtn} onClick={voltar}>
              <FaArrowLeft /> Voltar
            </button>

            <button
              className={styles.editBtn}
              onClick={() => setEditando(true)}
            >
              <FaEdit /> Editar
            </button>

            <button className={styles.deleteBtn} onClick={excluirCliente}>
              <FaTrashAlt /> Excluir
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.saveBtn}
              onClick={() =>
                document
                  .querySelector("form")
                  .dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  )
              }
            >
              <FaSave /> Salvar
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => setEditando(false)}
            >
              <FaTimesCircle /> Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteDetalhe;
