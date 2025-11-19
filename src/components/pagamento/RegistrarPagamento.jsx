import { useState } from "react";
import { PaymentsService } from "../../services/LocacoesService";
import styles from "./registrarPagamento.module.css";

export default function RegistrarPagamento({ locacaoId, onConcluido }) {
  const [dataPagamento, setDataPagamento] = useState("");
  const [formaPagto, setFormaPagto] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [status, setStatus] = useState("");
  const [juros, setJuros] = useState(0); // NOVO: campo de juros (%)
  const [carregando, setCarregando] = useState(false);

  const camposInvalidos = () => !dataPagamento || !formaPagto || !status;

  const registrarPagamento = async (evento) => {
    evento.preventDefault();

    if (camposInvalidos()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      const dadosParaEnviar = {
        rentalId: locacaoId,
        dataPagamento,
        formaPagto,
        parcelas: Number(parcelas),
        status,
        juros: Number(juros) / 100, // converte % para decimal
      };

      const resposta = await PaymentsService.add(dadosParaEnviar);

      alert("Pagamento registrado com sucesso!");
      onConcluido(resposta.data); // retorna o pagamento criado
    } catch (erro) {
      console.error("Erro ao registrar pagamento:", erro);
      alert("Erro ao registrar pagamento.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Registrar Pagamento</h2>

      <form onSubmit={registrarPagamento}>
        <div className={styles.campo}>
          <label>Data do Pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label>Forma de Pagamento</label>
          <select
            value={formaPagto}
            onChange={(e) => setFormaPagto(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="PIX">PIX</option>
            <option value="DINHEIRO">Dinheiro</option>
            <option value="CREDITO">Crédito</option>
            <option value="DEBITO">Débito</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label>Parcelas</label>
          <input
            type="number"
            min="1"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="PAGO">Pago</option>
            <option value="PENDENTE">Pendente</option>
          </select>
        </div>

        <div className={styles.campo}>
          <label>Juros (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={juros}
            onChange={(e) => setJuros(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={styles.btnSalvar}
          disabled={carregando}
        >
          {carregando ? "Salvando..." : "Salvar Pagamento"}
        </button>
      </form>
    </div>
  );
}
