import { useState } from "react";
import { PaymentsService } from "../../services/LocacoesService";
import styles from "./registrarPagamento.module.css";
import MessageBox from "../erro/MensagemErro";
import useApiMessage from "../../hooks/UseApiError";
import TollModal from "../toll/TollModal";

export default function RegistrarPagamento({
  locacaoId,
  placaVeiculo,
  onConcluido,
}) {
  const [dataPagamento, setDataPagamento] = useState("");
  const [formaPagto, setFormaPagto] = useState("");
  const [parcelas, setParcelas] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [modalTollAberto, setModalTollAberto] = useState(false);

  const { mensagem, tipoMensagem, messageKey, handleApiError, showSuccess } =
    useApiMessage();

  const camposInvalidos = () => !dataPagamento || !formaPagto;

  const registrarPagamento = async (evento) => {
    evento.preventDefault();

    if (camposInvalidos()) {
      handleApiError(null, "Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      const dadosParaEnviar = {
        rentalId: locacaoId,
        dataPagamento,
        formaPagto,
        parcelas: Number(parcelas),
      };

      const resposta = await PaymentsService.add(dadosParaEnviar);

      showSuccess("Pagamento registrado com sucesso!");
      onConcluido(resposta.data);
    } catch (err) {
      console.error("Erro ao registrar pagamento:", err);
      handleApiError(err, "Erro ao registrar pagamento. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>Registrar Pagamento</h2>

      <MessageBox
        type={tipoMensagem}
        message={mensagem}
        msgKey={messageKey}
        duration={4000}
        onClose={() => {}}
      />

      <form onSubmit={registrarPagamento}>
        <div className={styles.campo}>
          <label>Data do Pagamento</label>
          <input
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
            required
            max={new Date().toISOString().slice(0, 10)} // bloqueia datas futuras
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
        <div className={styles.topActions}>
          <button
            type="button"
            className={styles.tollButton}
            onClick={() => setModalTollAberto(true)}
          >
            Cadastrar Pedágio
          </button>
        </div>
        {modalTollAberto && (
          <TollModal
            placaVeiculo={placaVeiculo}
            onClose={() => setModalTollAberto(false)}
          />
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
