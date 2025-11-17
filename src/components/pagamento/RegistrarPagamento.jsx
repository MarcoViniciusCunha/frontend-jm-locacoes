import { useState } from "react";
import { PaymentsService } from "../../services/LocacoesService";
import styles from "./registrarPagamento.module.css";

export default function RegistrarPagamento({ locacaoId, onConcluido }) {
  const [dataPagamento, setDataPagamento] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagto, setFormaPagto] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataPagamento || !valor || !formaPagto) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);
      await PaymentsService.add({
        rentalId: locacaoId,
        dataPagamento,
        valor,
        formaPagto,
        parcelas,
        status: "PAGO",
      });

      alert("Pagamento registrado com sucesso!");
      onConcluido(); // fecha modal + recarrega lista
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

      <form onSubmit={handleSubmit}>
        {/* DATA */}
        <div className={styles.campo}>
          <label>Data do Pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            required
          />
        </div>

        {/* VALOR */}
        <div className={styles.campo}>
          <label>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        {/* FORMA DE PAGAMENTO */}
        <div className={styles.campo}>
          <label>Forma de Pagamento</label>
          <select
            value={formaPagto}
            onChange={(e) => setFormaPagto(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="PIX">PIX</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
          </select>
        </div>

        {/* PARCELAS */}
        <div className={styles.campo}>
          <label>Parcelas</label>
          <input
            type="number"
            min="1"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
          />
        </div>

        {/* BOTÃO */}
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
