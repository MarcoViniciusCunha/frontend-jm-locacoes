import { useState } from "react";
import { TollService } from "../../services/LocacoesService";
import styles from "./TollModal.module.css";
import { FiX } from "react-icons/fi";
import MessageBox from "../erro/MensagemErro";
import useApiMessage from "../../hooks/UseApiError";

export default function TollModal({ onClose, onSuccess, placaVeiculo }) {
  const [placa] = useState(placaVeiculo || "");
  const [rodovia, setRodovia] = useState("");
  const [cidade, setCidade] = useState("");
  const [valor, setValor] = useState("");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mensagem,
    tipoMensagem,
    messageKey,
    showError,
    showSuccess,
    handleApiError,
    clearMessage,
  } = useApiMessage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit chamado", { placa, rodovia, cidade, valor, date });

    if (!placa || !rodovia || !cidade || !valor || !date) {
      console.log("Campos obrigatórios faltando");
      showError("Todos os campos são obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Enviando request...");
      const response = await TollService.add({
        placa,
        rodovia,
        cidade,
        valor: parseFloat(valor),
        date,
      });

      const novoToll = response.data;

      console.log("Request enviado com sucesso", novoToll);
      showSuccess("Pedágio cadastrado com sucesso!");

      if (onSuccess) onSuccess(novoToll);

      onClose();
    } catch (err) {
      console.log("Erro no request", err);
      handleApiError(err, "Erro ao cadastrar pedágio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");

  const maxDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Cadastrar Pedágio</h3>

        {mensagem && (
          <MessageBox
            type={tipoMensagem}
            message={mensagem}
            msgKey={messageKey}
            duration={4000}
            onClose={clearMessage}
          />
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Placa do veículo"
            value={placa}
            disabled
          />

          <input
            type="text"
            placeholder="Rodovia"
            value={rodovia}
            onChange={(e) => setRodovia(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            step="0.01"
          />
          <input
            type="datetime-local"
            placeholder="Data e hora"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={maxDate}
          />

          <div className={styles.buttons}>
            <button type="submit" disabled={isSubmitting}>
              Cadastrar
            </button>
            <button type="button" onClick={onClose}>
              <FiX /> Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
