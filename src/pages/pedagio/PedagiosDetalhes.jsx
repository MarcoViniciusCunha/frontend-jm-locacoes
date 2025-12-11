import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TollService } from "../../services/LocacoesService";
import MessageBox from "../../components/erro/MensagemErro";
import ConfirmModal from "../../components/erro/ConfirmModal";
import styles from "./PedagioDetalhes.module.css";
import {
  FiArrowLeft,
  FiTrash2,
  FiEdit,
  FiHash,
  FiCalendar,
  FiMap,
} from "react-icons/fi";

export default function PedagiosDetalhes() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [pedagio, setPedagio] = useState(null);
  const [estaCarregando, setEstaCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);
  const [editando, setEditando] = useState(false);
  const [abrirConfirmExcluir, setAbrirConfirmExcluir] = useState(false);

  const [dadosEdicao, setDadosEdicao] = useState({
    rodovia: "",
    cidade: "",
    valor: "",
    date: "",
  });

  useEffect(() => {
    carregarPedagio();
  }, [id]);

  const carregarPedagio = async () => {
    try {
      setEstaCarregando(true);
      setMensagem(null);

      const resposta = await TollService.buscarPorId(id);
      const t = resposta.data;

      setPedagio(t);
      setDadosEdicao({
        rodovia: t.rodovia,
        cidade: t.cidade,
        valor: t.valor,
        date: t.date.slice(0, 16),
      });
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao carregar pedágio." });
    } finally {
      setEstaCarregando(false);
    }
  };

  const atualizarCampo = (campo, valor) => {
    setDadosEdicao((prev) => ({ ...prev, [campo]: valor }));
  };

  const excluirPedagio = async () => {
    try {
      await TollService.excluir(id);
      setMensagem({
        type: "success",
        message: "Pedágio excluído com sucesso!",
      });
      setTimeout(() => navegar(-1), 1500);
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao excluir pedágio." });
    } finally {
      setAbrirConfirmExcluir(false);
    }
  };

  const salvarAlteracoes = async () => {
    try {
      await TollService.editar(id, dadosEdicao);
      setPedagio((p) => ({ ...p, ...dadosEdicao }));
      setEditando(false);
      setMensagem({
        type: "success",
        message: "Pedágio atualizado com sucesso!",
      });
    } catch (erro) {
      console.error(erro);
      setMensagem({ type: "error", message: "Erro ao salvar alterações." });
    }
  };

  if (estaCarregando)
    return <div className={styles.loading}>Carregando...</div>;
  if (!pedagio)
    return <MessageBox type="error" message="Pedágio não encontrado." />;

  return (
    <div className={styles.container}>
      <button className={styles.btnVoltar} onClick={() => navegar(-1)}>
        <FiArrowLeft size={20} /> Voltar
      </button>

      <h1 className={styles.titulo}>Detalhes do Pedágio</h1>

      {mensagem && (
        <MessageBox type={mensagem.type} message={mensagem.message} />
      )}

      <div className={styles.card}>
        <div className={styles.grupo}>
          <FiMap />
          <span className={styles.label}>Rodovia:</span>
          <span>{pedagio.rodovia}</span>
        </div>

        <div className={styles.grupo}>
          <span className={styles.label}>Cidade:</span>
          <span>{pedagio.cidade}</span>
        </div>

        <div className={styles.grupo}>
          <FiHash />
          <span className={styles.label}>Valor:</span>
          <span>R$ {pedagio.valor.toFixed(2)}</span>
        </div>

        <div className={styles.grupo}>
          <FiCalendar />
          <span className={styles.label}>Data e hora:</span>
          <span>
            {new Date(pedagio.date).toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className={styles.acoes}>
        <button
          className={styles.btnEditar}
          onClick={() => setEditando(!editando)}
        >
          {editando ? (
            "Cancelar"
          ) : (
            <>
              <FiEdit /> Editar
            </>
          )}
        </button>

        <button
          className={styles.btnExcluir}
          onClick={() => setAbrirConfirmExcluir(true)}
        >
          <FiTrash2 size={18} /> Excluir
        </button>
      </div>

      {editando && (
        <div className={styles.formContainer}>
          <h2 className={styles.subtitulo}>Editar Pedágio</h2>

          <label>Rodovia</label>
          <input
            type="text"
            value={dadosEdicao.rodovia}
            onChange={(e) => atualizarCampo("rodovia", e.target.value)}
          />

          <label>Cidade</label>
          <input
            type="text"
            value={dadosEdicao.cidade}
            onChange={(e) => atualizarCampo("cidade", e.target.value)}
          />

          <label>Valor</label>
          <input
            type="number"
            step="0.01"
            value={dadosEdicao.valor}
            onChange={(e) =>
              atualizarCampo("valor", parseFloat(e.target.value))
            }
          />

          <label>Data</label>
          <input
            type="datetime-local"
            value={dadosEdicao.date}
            onChange={(e) =>
              setDadosEdicao({ ...dadosEdicao, date: e.target.value })
            }
          />

          <div className={styles.btnSalvarContainer}>
            <button className={styles.btnSalvar} onClick={salvarAlteracoes}>
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO */}
      {abrirConfirmExcluir && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message="Deseja realmente excluir este pedágio?"
          onCancel={() => setAbrirConfirmExcluir(false)}
          onConfirm={excluirPedagio}
        />
      )}
    </div>
  );
}
