import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocacoesService } from "../../services/LocacoesService";
import RegistrarPagamento from "../../components/pagamento/RegistrarPagamento";
import styles from "./locacaoDetalhe.module.css";

import {
  FiUser,
  FiTruck,
  FiCalendar,
  FiPrinter,
  FiCornerDownLeft,
  FiTrash2,
} from "react-icons/fi";

export default function LocacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dadosLocacao, setDadosLocacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // NOVO: controla exibição da janela/modal
  const [abrirModalPagamento, setAbrirModalPagamento] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await LocacoesService.buscarPorId(id);
        setDadosLocacao(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar locação:", erro);
      } finally {
        setCarregando(false);
      }
    };

    if (id) carregar();
  }, [id]);

  const lidarDevolucao = async () => {
    try {
      await LocacoesService.devolver(id);
      alert("Veículo devolvido com sucesso!");
      navigate("/locacoes");
    } catch {
      alert("Erro ao devolver veículo");
    }
  };

  if (carregando) return <div className={styles.carregando}>Carregando...</div>;

  if (!dadosLocacao)
    return (
      <div>
        <div>Locação não encontrada</div>
        <button onClick={() => navigate("/locacoes")}>Voltar</button>
      </div>
    );

  let status = "Ativa";

  if (dadosLocacao.returned) {
    status = "Devolvido";
  } else {
    const hoje = new Date();
    const fim = new Date(dadosLocacao.endDate);

    if (hoje > fim) {
      status = "Atrasada";
    }
  }

  const lidarExclusao = async () => {
    if (!window.confirm("Deseja realmente excluir esta locação?")) return;

    try {
      await LocacoesService.excluir(id);
      alert("Locação excluída com sucesso!");
      navigate("/locacoes");
    } catch {
      alert("Erro ao excluir locação.");
    }
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.conteudo}>
        <button
          onClick={() => navigate("/locacoes")}
          className={styles.botaoVoltar}
        >
          ← Voltar
        </button>

        <div className={styles.cabecalho}>
          <h1>Detalhes da Locação</h1>
          <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>
            {status}
          </span>
        </div>

        <div className={styles.grid}>
          {/* CLIENTE */}
          <div className={styles.card}>
            <h2 className={styles.cardTitulo}>
              <FiUser className={styles.iconeTitulo} /> Cliente
            </h2>

            <div className={styles.linha}>
              <span className={styles.label}>CNH:</span>
              <span className={styles.valor}>{dadosLocacao.customerCnh}</span>
            </div>

            <div className={styles.linha}>
              <span className={styles.label}>Nome:</span>
              <span className={styles.valor}>{dadosLocacao.customerName}</span>
            </div>
          </div>

          {/* VEÍCULO */}
          <div className={styles.card}>
            <h2 className={styles.cardTitulo}>
              <FiTruck className={styles.iconeTitulo} /> Veículo
            </h2>

            <div className={styles.linha}>
              <span className={styles.label}>Placa:</span>
              <span className={styles.valorDestaque}>{dadosLocacao.placa}</span>
            </div>

            <div className={styles.linha}>
              <span className={styles.label}>Marca/Modelo:</span>
              <span className={styles.valor}>
                {dadosLocacao.vehicleMarca} {dadosLocacao.modelo}
              </span>
            </div>

            <div className={styles.linha}>
              <span className={styles.label}>Ano:</span>
              <span className={styles.valor}>{dadosLocacao.vehicleAno}</span>
            </div>
          </div>

          {/* PERÍODO */}
          <div className={styles.card}>
            <h2 className={styles.cardTitulo}>
              <FiCalendar className={styles.iconeTitulo} /> Período
            </h2>

            <div className={styles.linha}>
              <span className={styles.label}>Início:</span>
              <span className={styles.valor}>{dadosLocacao.startDate}</span>
            </div>

            <div className={styles.linha}>
              <span className={styles.label}>Fim:</span>
              <span className={styles.valor}>{dadosLocacao.endDate}</span>
            </div>

            <div className={styles.linha}>
              <span className={styles.label}>Total:</span>
              <span className={styles.valorTotal}>R$ {dadosLocacao.price}</span>
            </div>
          </div>
        </div>

        <div className={styles.acoes}>
          <button
            className={styles.botaoImprimir}
            onClick={() => window.print()}
          >
            <FiPrinter className={styles.iconeBotao} /> Imprimir Contrato
          </button>

          {!dadosLocacao.returned && (
            <button className={styles.botaoDevolver} onClick={lidarDevolucao}>
              <FiCornerDownLeft className={styles.iconeBotao} /> Registrar
              Devolução
            </button>
          )}

          <button className={styles.botaoExcluir} onClick={lidarExclusao}>
            <FiTrash2 className={styles.iconeBotao} /> Excluir Locação
          </button>
        </div>

        {/* PAGAMENTOS */}
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.cardTituloLinha}>
              <h2 className={styles.cardTitulo}>Pagamento</h2>

              {/* BOTÃO QUE ABRE O MODAL */}
              <button
                className={styles.botaoRegistrarPgto}
                onClick={() => setAbrirModalPagamento(true)}
              >
                Registrar Pagamento
              </button>
            </div>

            {dadosLocacao.payments?.length > 0 ? (
              dadosLocacao.payments.map((pg) => (
                <div key={pg.id} className={styles.linhaGrupo}>
                  <div className={styles.linha}>
                    <span className={styles.label}>Data:</span>
                    <span className={styles.valor}>{pg.dataPagamento}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Valor:</span>
                    <span className={styles.valor}>R$ {pg.valor}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Forma:</span>
                    <span className={styles.valor}>{pg.formaPagto}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Status:</span>
                    <span className={styles.valor}>{pg.status}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Parcelas:</span>
                    <span className={styles.valor}>{pg.parcelas}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.semPagamentos}>
                Nenhum pagamento registrado.
              </p>
            )}
          </div>
        </div>

        {/* MODAL DE PAGAMENTO */}
        {abrirModalPagamento && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalConteudo}>
              <button
                className={styles.modalFechar}
                onClick={() => setAbrirModalPagamento(false)}
              >
                X
              </button>

              <RegistrarPagamento
                locacaoId={id}
                onConcluido={(novoPagamento) => {
                  setAbrirModalPagamento(false);
                  setDadosLocacao((prev) => ({
                    ...prev,
                    payments: [...(prev.payments || []), novoPagamento],
                  }));
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
