import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PaymentsService } from "../../services/LocacoesService";
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
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [editando, setEditando] = useState(false);

  const [status, setStatus] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [formaPagto, setFormaPagto] = useState("");
  const [parcelas, setParcelas] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await PaymentsService.buscarPorId(id);
        setPg(resp.data);

        setStatus(resp.data.status);
        setDataPagamento(resp.data.dataPagamento);
        setFormaPagto(resp.data.formaPagto);
        setParcelas(resp.data.parcelas);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar pagamento.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id]);

  const handleExcluir = async () => {
    if (!window.confirm("Deseja realmente excluir este pagamento?")) return;
    try {
      await PaymentsService.excluir(id);
      navigate("/pagamentos");
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir pagamento.");
    }
  };

  const handleSalvar = async () => {
    const payload = {
      status,
      dataPagamento,
      formaPagto,
      parcelas,
    };

    try {
      await PaymentsService.editar(id, payload);
      alert("Pagamento atualizado!");

      setPg((p) => ({ ...p, ...payload }));
      setEditando(false);
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar.");
    }
  };

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (erro) return <div className={styles.erro}>{erro}</div>;
  if (!pg) return <div className={styles.erro}>Pagamento não encontrado.</div>;

  return (
    <div className={styles.container}>
      <button className={styles.btnVoltar} onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} />
        Voltar
      </button>

      <h1 className={styles.titulo}>Detalhes do Pagamento</h1>

      <div className={styles.card}>
        {/* Valor */}
        <div className={styles.linha}>
          <FiDollarSign size={20} />
          <span className={styles.valor}>R$ {pg.valor.toFixed(2)}</span>
        </div>

        {/* Status */}
        <div className={styles.grupo}>
          <span className={styles.label}>Status:</span>
          <span
            className={`${styles.status} ${
              pg.status === "Pago" ? styles.pago : styles.pendente
            }`}
          >
            {pg.status}
          </span>
        </div>

        {/* Data */}
        <div className={styles.grupo}>
          <FiCalendar />
          <span className={styles.label}>Data do pagamento:</span>
          <span>{pg.dataPagamento}</span>
        </div>

        {/* Forma pgto */}
        <div className={styles.grupo}>
          <FiCreditCard />
          <span className={styles.label}>Forma de pagamento:</span>
          <span>{pg.formaPagto}</span>
        </div>

        {/* Parcelas */}
        <div className={styles.grupo}>
          <FiHash />
          <span className={styles.label}>Parcelas:</span>
          <span>{pg.parcelas}</span>
        </div>

        <div className={styles.separador}></div>

        {/* Informações da locação */}
        <h2 className={styles.subtitulo}>
          <FiUser /> Informações da Locação
        </h2>

        <div className={styles.grupo}>
          <span className={styles.label}>Cliente:</span>
          <span>{pg.rental.customerNome}</span>
        </div>

        <div className={styles.grupo}>
          <span className={styles.label}>Placa:</span>
          <span>{pg.rental.vehiclePlaca}</span>
        </div>
      </div>

      {/* BOTÕES */}
      <div className={styles.acoes}>
        <button
          className={styles.btnEditar}
          onClick={() => setEditando(!editando)}
        >
          {editando ? "Cancelar" : "Editar"}
        </button>

        <button className={styles.btnExcluir} onClick={handleExcluir}>
          <FiTrash2 size={18} />
          Excluir
        </button>
      </div>

      {/* FORMULÁRIO DE EDIÇÃO */}
      {editando && (
        <div className={styles.formContainer}>
          <h2 className={styles.subtitulo}>Editar Pagamento</h2>

          {/* Status */}
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
          </select>

          {/* Data */}
          <label>Data de pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
          />

          {/* Forma pagamento */}
          <label>Forma de pagamento</label>
          <input
            type="text"
            value={formaPagto}
            onChange={(e) => setFormaPagto(e.target.value)}
          />

          {/* Parcelas */}
          <label>Parcelas</label>
          <input
            type="number"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
          />

          <div className={styles.btnSalvarContainer}>
            <button className={styles.btnSalvar} onClick={handleSalvar}>
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
