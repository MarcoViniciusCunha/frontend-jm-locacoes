import { useState } from "react";
import { PaymentsService } from "../../services/LocacoesService";
import styles from "./registrarPagamento.module.css";
import MessageBox from "../erro/MensagemErro";

export default function RegistrarPagamento({ locacaoId, onConcluido }) {
  const [dataPagamento, setDataPagamento] = useState("");
  const [formaPagto, setFormaPagto] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [status, setStatus] = useState("");
  const [juros, setJuros] = useState(0);
  const [usarJuros, setUsarJuros] = useState(false); // <<< checkbox
  const [carregando, setCarregando] = useState(false);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const exibirMensagem = (tipo, texto) => {
    setTipoMensagem(tipo);
    setMensagem(texto);
  };

  const camposInvalidos = () => !dataPagamento || !formaPagto || !status;

  const registrarPagamento = async (evento) => {
    evento.preventDefault();

    if (camposInvalidos()) {
      exibirMensagem("error", "Preencha todos os campos obrigatórios.");
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
        juros: usarJuros ? Number(juros) / 100 : 0, // <<< só envia juros se ativado
      };

      const resposta = await PaymentsService.add(dadosParaEnviar);

      exibirMensagem("success", "Pagamento registrado com sucesso!");
      onConcluido(resposta.data);
    } catch (err) {
      console.error("Erro ao registrar pagamento:", err);

      exibirMensagem(
        "error",
        err.response?.data?.error ||
          "Erro ao registrar pagamento. Tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Registrar Pagamento</h2>

      <MessageBox type={tipoMensagem} message={mensagem} />

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

        <div className={`${styles.campo} ${styles.checkbox}`}>
          <input
            type="checkbox"
            checked={usarJuros}
            onChange={() => {
              setUsarJuros((prev) => !prev);
              if (usarJuros) setJuros(0);
            }}
          />
          <label>Aplicar juros</label>
        </div>

        {/* Campo de juros habilitado somente se a checkbox estiver marcada */}
        {usarJuros && (
          <div className={styles.campo}>
            <label>Juros (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={juros}
              onChange={(e) => setJuros(e.target.value)}
              required={usarJuros}
            />
          </div>
        )}

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
