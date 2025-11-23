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

import MessageBox from "../../components/erro/MensagemErro";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const exibirMensagem = (tipo, texto) => {
    setTipoMensagem(tipo);
    setMensagem(texto);
  };

  const carregarCliente = useCallback(async () => {
    try {
      const { data } = await ClientesService.getById(id);
      setCliente(data);
    } catch (e) {
      console.error(e);
      exibirMensagem("error", "Erro ao carregar cliente: " + e.message);
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
      exibirMensagem("success", "Cliente atualizado com sucesso!");
    } catch (e) {
      const msg = e.response?.data.error || "Erro ao salvar cliente";
      exibirMensagem("error", msg);
    }
  };

  const excluirCliente = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este cliente?")) return;

    try {
      await ClientesService.excluir(id);
      exibirMensagem("success", "Cliente excluído com sucesso!");

      setTimeout(() => navigate("/clientes"), 1200);
    } catch (e) {
      const msg = e.response?.data.error || "Erro ao excluir cliente";
      exibirMensagem("error", msg);
    }
  };

  const dispararSubmitDoForm = () => {
    const form = document.querySelector("form");
    if (form) {
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <h1>
          <FaUserCircle /> {cliente?.nome}
        </h1>
      </div>

      <MessageBox type={tipoMensagem} message={mensagem} />

      <ClienteForm
        initialData={cliente}
        onSubmit={salvarAlteracoes}
        onCancel={() => setEditando(false)}
        disabled={!editando}
      />

      <div className={styles.buttonGroup}>
        {!editando ? (
          <>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
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
            <button className={styles.saveBtn} onClick={dispararSubmitDoForm}>
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
