import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentsService } from "../../services/LocacoesService";
import MessageBox from "../../components/erro/MensagemErro";
import styles from "./PagamentosDetalhes.module.css";
import {
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiArrowLeft,
  FiTrash2,
  FiCreditCard,
  FiHash,
} from "react-icons/fi";

export default function PagamentosDetalhes() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [pagamento, setPagamento] = useState(null);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [editando, setEditando] = useState(false);

  const [dadosEdicao, setDadosEdicao] = useState({
    status: "",
    dataPagamento: "",
    formaPagto: "",
    parcelas: "",
  });

  useEffect(() => {
    carregarPagamento();
  }, [id]);

  const carregarPagamento = async () => {
    try {
      setEstaCarregando(true);
      setMensagem(null);

      const resposta = await PaymentsService.buscarPorId(id);
      const p = resposta.data;

      setPagamento(p);
      setDadosEdicao({
        status: p.status,
        dataPagamento: p.dataPagamento,
        formaPagto: p.formaPagto,
        parcelas: p.parcelas,
      });
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao carregar pagamento." });
    } finally {
      setEstaCarregando(false);
    }
  };

  const atualizarCampo = (campo, valor) => {
    setDadosEdicao((prev) => ({ ...prev, [campo]: valor }));
  };

  const excluirPagamento = async () => {
    const confirmado = window.confirm(
      "Deseja realmente excluir este pagamento?"
    );
    if (!confirmado) return;

    try {
      await PaymentsService.excluir(id);
      setMensagem({
        type: "success",
        message: "Pagamento excluído com sucesso!",
      });
      setTimeout(() => navegar("/pagamentos"), 1500);
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao excluir pagamento." });
    }
  };

  const salvarAlteracoes = async () => {
    try {
      await PaymentsService.editar(id, dadosEdicao);
      setPagamento((p) => ({ ...p, ...dadosEdicao }));
      setEditando(false);
      setMensagem({
        type: "success",
        message: "Pagamento atualizado com sucesso!",
      });
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao salvar alterações." });
    }
  };

  if (estaCarregando)
    return <div className={styles.loading}>Carregando...</div>;
  if (!pagamento)
    return <MessageBox type="error" message="Pagamento não encontrado." />;

  return (
    <div className={styles.container}>
      {/* BOTÃO VOLTAR */}
      <button className={styles.btnVoltar} onClick={() => navegar(-1)}>
        <FiArrowLeft size={20} /> Voltar
      </button>

      <h1 className={styles.titulo}>Detalhes do Pagamento</h1>

      {mensagem && (
        <MessageBox type={mensagem.type} message={mensagem.message} />
      )}

      <div className={styles.card}>
        {/* Valor */}
        <div className={styles.linha}>
          <FiDollarSign size={20} />
          <span className={styles.valor}>R$ {pagamento.valor.toFixed(2)}</span>
        </div>

        {/* Status */}
        <div className={styles.grupo}>
          <span className={styles.label}>Status:</span>
          <span
            className={`${styles.status} ${
              pagamento.status === "Pago" || pagamento.status === "PAGO"
                ? styles.pago
                : styles.pendente
            }`}
          >
            {pagamento.status}
          </span>
        </div>

        {/* Data */}
        <div className={styles.grupo}>
          <FiCalendar />
          <span className={styles.label}>Data do pagamento:</span>
          <span>{pagamento.dataPagamento}</span>
        </div>

        {/* Forma pgto */}
        <div className={styles.grupo}>
          <FiCreditCard />
          <span className={styles.label}>Forma de pagamento:</span>
          <span>{pagamento.formaPagto}</span>
        </div>

        {/* Parcelas */}
        <div className={styles.grupo}>
          <FiHash />
          <span className={styles.label}>Parcelas:</span>
          <span>{pagamento.parcelas}</span>
        </div>

        <div className={styles.separador}></div>

        {/* Info locação */}
        <h2 className={styles.subtitulo}>
          <FiUser /> Informações da Locação
        </h2>

        <div className={styles.grupo}>
          <span className={styles.label}>Cliente:</span>
          <span>{pagamento.rental.customerNome}</span>
        </div>

        <div className={styles.grupo}>
          <span className={styles.label}>Placa:</span>
          <span>{pagamento.rental.vehiclePlaca}</span>
        </div>
      </div>

      {/* BOTÕES AÇÕES */}
      <div className={styles.acoes}>
        <button
          className={styles.btnEditar}
          onClick={() => setEditando(!editando)}
        >
          {editando ? "Cancelar" : "Editar"}
        </button>

        <button className={styles.btnExcluir} onClick={excluirPagamento}>
          <FiTrash2 size={18} /> Excluir
        </button>
      </div>

      {/* FORMULÁRIO DE EDIÇÃO */}
      {editando && (
        <div className={styles.formContainer}>
          <h2 className={styles.subtitulo}>Editar Pagamento</h2>

          <label>Status</label>
          <select
            value={dadosEdicao.status}
            onChange={(e) => atualizarCampo("status", e.target.value)}
          >
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
          </select>

          <label>Data de pagamento</label>
          <input
            type="date"
            value={dadosEdicao.dataPagamento}
            onChange={(e) => atualizarCampo("dataPagamento", e.target.value)}
          />

          <label>Forma de pagamento</label>
          <input
            type="text"
            value={dadosEdicao.formaPagto}
            onChange={(e) => atualizarCampo("formaPagto", e.target.value)}
          />

          <label>Parcelas</label>
          <input
            type="number"
            value={dadosEdicao.parcelas}
            onChange={(e) => atualizarCampo("parcelas", e.target.value)}
          />

          <div className={styles.btnSalvarContainer}>
            <button className={styles.btnSalvar} onClick={salvarAlteracoes}>
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
