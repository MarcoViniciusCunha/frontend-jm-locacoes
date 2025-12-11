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
import ConfirmModal from "../../components/erro/ConfirmModal";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

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
    setMensagem("");
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

  const abrirConfirmacao = (title, message, acao) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setOnConfirmAction(() => acao);
    setConfirmModalOpen(true);
  };

  const desativarCliente = async () => {
    try {
      await ClientesService.desativar(id);
      exibirMensagem("success", "Cliente desativado com sucesso!");
      await carregarCliente();
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Erro ao desativar cliente.";
      exibirMensagem("error", msg);
    }
  };

  const ativarCliente = async () => {
    try {
      await ClientesService.ativar(id);
      exibirMensagem("success", "Cliente reativado com sucesso!");
      await carregarCliente();
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Erro ao reativar cliente.";
      exibirMensagem("error", msg);
    }
  };

  const excluirCliente = async () => {
    try {
      await ClientesService.excluir(id);
      exibirMensagem("success", "Cliente excluído com sucesso!");
      setTimeout(() => navigate("/clientes"), 1200);
    } catch (e) {
      const msg = e.response?.data.error || "Erro ao excluir cliente";
      exibirMensagem("error", msg);
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

      <div className={styles.statusContainer}>
        <div
          className={
            cliente?.ativo ? styles.statusAtivo : styles.statusDesativado
          }
        >
          {cliente?.ativo ? "ATIVO" : "DESATIVADO"}
        </div>
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

            {cliente?.ativo && (
              <button
                className={styles.editBtn}
                onClick={() => setEditando(true)}
              >
                <FaEdit /> Editar
              </button>
            )}

            {cliente?.ativo ? (
              <button
                className={styles.deactivateBtn}
                onClick={() =>
                  abrirConfirmacao(
                    "Desativar Cliente",
                    "Deseja realmente desativar este cliente? Ele não poderá mais realizar locações.",
                    desativarCliente
                  )
                }
              >
                <FaTimesCircle /> Desativar
              </button>
            ) : (
              <button
                className={styles.activateBtn}
                onClick={() =>
                  abrirConfirmacao(
                    "Ativar Cliente",
                    "Deseja realmente reativar este cliente?",
                    ativarCliente
                  )
                }
              >
                <FaSave /> Ativar
              </button>
            )}

            <button
              className={styles.deleteBtn}
              onClick={() =>
                abrirConfirmacao(
                  "Excluir Cliente",
                  "Tem certeza que deseja excluir este cliente?",
                  excluirCliente
                )
              }
            >
              <FaTrashAlt /> Excluir
            </button>
          </>
        ) : null}
      </div>

      {/* Modal de confirmação */}
      {confirmModalOpen && (
        <ConfirmModal
          title={confirmTitle}
          message={confirmMessage}
          onConfirm={() => {
            onConfirmAction();
            setConfirmModalOpen(false);
          }}
          onCancel={() => setConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ClienteDetalhe;
