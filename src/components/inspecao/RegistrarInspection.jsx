import { useState } from "react";
import { InspecoesService } from "../../services/LocacoesService";
import styles from "./registrarInspecao.module.css";
import MessageBox from "../erro/MensagemErro";

export default function RegistrarInspecao({
  locacaoId,
  inspecao,
  onConcluido,
}) {
  const [dataInspecao, setDataInspecao] = useState(
    inspecao?.data_inspecao || ""
  );
  const [descricao, setDescricao] = useState(inspecao?.descricao || "");
  const [danificado, setDanificado] = useState(inspecao?.danificado || false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const camposInvalidos = () => !dataInspecao || !descricao;

  const registrarInspecao = async (evento) => {
    evento.preventDefault();

    if (camposInvalidos()) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);
      let resposta;

      const dadosParaEnviar = {
        rentalId: locacaoId,
        data_inspecao: dataInspecao,
        descricao,
        danificado,
      };

      if (inspecao) {
        resposta = await InspecoesService.editar(inspecao.id, dadosParaEnviar);
      } else {
        resposta = await InspecoesService.add(dadosParaEnviar);
      }

      onConcluido(resposta.data);
    } catch (erro) {
      console.error("Erro ao salvar inspeção:", erro);
      const msg =
        erro.response?.data?.error ||
        "Erro ao salvar inspeção. Tente novamente.";

      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalTitle}>
        {inspecao ? "Editar Inspeção" : "Registrar Inspeção"}
      </h2>

      <MessageBox
        type="error"
        message={erro}
        duration={4000}
        onClose={() => setErro("")}
      />

      {erro && <div className={styles.erro}>{erro}</div>}

      <form onSubmit={registrarInspecao}>
        <div className={styles.campo}>
          <label>Data da Inspeção</label>
          <input
            type="date"
            value={dataInspecao}
            onChange={(e) => setDataInspecao(e.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva a inspeção..."
            required
          />
        </div>

        <div className={styles.campoCheckbox}>
          <label>
            <input
              type="checkbox"
              checked={danificado}
              onChange={(e) => setDanificado(e.target.checked)}
            />
            Danificado
          </label>
        </div>

        <div className={styles.botoes}>
          <button
            type="submit"
            className={styles.btnSalvar}
            disabled={carregando}
          >
            {carregando
              ? "Salvando..."
              : inspecao
              ? "Salvar Alterações"
              : "Salvar Inspeção"}
          </button>
        </div>
      </form>
    </div>
  );
}
