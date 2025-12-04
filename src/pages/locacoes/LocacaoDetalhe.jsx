import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  InspecoesService,
  LocacoesService,
} from "../../services/LocacoesService";
import RegistrarPagamento from "../../components/pagamento/RegistrarPagamento";
import styles from "./locacaoDetalhe.module.css";
import MessageBox from "../../components/erro/MensagemErro";
import { api } from "../../utils/config";

import {
  FiUser,
  FiTruck,
  FiCalendar,
  FiPrinter,
  FiCornerDownLeft,
  FiTrash2,
} from "react-icons/fi";
import RegistrarInspecao from "../../components/inspecao/RegistrarInspection";

export default function LocacaoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dadosLocacao, setDadosLocacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const [abrirModalPagamento, setAbrirModalPagamento] = useState(false);
  const [abrirModalInspecao, setAbrirModalInspecao] = useState(false);
  const [editarInspecao, setEditarInspecao] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await LocacoesService.buscarPorId(id);
        setDadosLocacao(resposta.data);
      } catch (e) {
        setTipoMensagem("error");
        setMensagem(
          e.response?.data?.error || "Erro ao carregar dados da locação."
        );
      } finally {
        setCarregando(false);
      }
    };

    if (id) carregar();
  }, [id]);

  const lidarDevolucao = async () => {
    try {
      await LocacoesService.devolver(id);
      setTipoMensagem("success");
      setMensagem("Veículo devolvido com sucesso!");
    } catch (error) {
      setTipoMensagem("error");
      setMensagem(error.response?.data?.error || "Erro ao devolver o veículo.");
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

  const status = dadosLocacao.status;

  const statusClass = status
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");

  const lidarExclusao = async () => {
    if (!window.confirm("Deseja realmente excluir esta locação?")) return;

    try {
      await LocacoesService.excluir(id);
      setTipoMensagem("success");
      setMensagem("Locação excluída com sucesso!");
      navigate("/locacoes");
    } catch (error) {
      setTipoMensagem("error");
      setMensagem(error.response?.data?.error || "Erro ao excluir a locação.");
    }
  };

  const baixarContrato = async () => {
    try {
      const response = await api.get(`/contrato/${id}`, {
        responseType: "blob", // IMPORTANTE
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Abre o PDF em nova aba
      window.open(url, "_blank");
    } catch (error) {
      setTipoMensagem("error");
      setMensagem(error.response?.data?.error || "Erro ao gerar o contrato.");
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
          <span className={`${styles.status} ${styles[statusClass]}`}>
            {status}
          </span>
        </div>

        <MessageBox type={tipoMensagem} message={mensagem} />

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
          <button className={styles.botaoImprimir} onClick={baixarContrato}>
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

                  <button
                    className={styles.botaoDetalhesPagto}
                    onClick={() => navigate(`/pagamentos/${pg.id}`)}
                  >
                    Detalhes
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.semPagamentos}>
                Nenhum pagamento registrado.
              </p>
            )}
          </div>
        </div>

        {/* MULTAS */}
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.cardTituloLinha}>
              <h2 className={styles.cardTitulo}>Multas</h2>
            </div>

            {dadosLocacao.fines?.length > 0 ? (
              dadosLocacao.fines.map((multa) => (
                <div key={multa.id} className={styles.linhaGrupo}>
                  <div className={styles.linha}>
                    <span className={styles.label}>Data:</span>
                    <span className={styles.valor}>{multa.data_multa}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Valor:</span>
                    <span className={styles.valor}>R$ {multa.valor}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Descrição:</span>
                    <span className={styles.valor}>{multa.descricao}</span>
                  </div>

                  <button
                    className={styles.botaoDetalhesPagto}
                    onClick={() => navigate(`/multas/${multa.id}`)}
                  >
                    Detalhes
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.semPagamentos}>Nenhuma multa registrada.</p>
            )}
          </div>
        </div>

        {/* INSPEÇÕES */}
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <div className={styles.cardTituloLinha}>
              <h2 className={styles.cardTitulo}>Inspeções</h2>

              <button
                className={styles.botaoRegistrarPgto}
                onClick={() => setAbrirModalInspecao(true)}
              >
                Registrar Inspeção
              </button>
            </div>

            {dadosLocacao.inspections?.length > 0 ? (
              dadosLocacao.inspections.map((insp) => (
                <div key={insp.id} className={styles.linhaGrupo}>
                  <div className={styles.linha}>
                    <span className={styles.label}>Data:</span>
                    <span className={styles.valor}>{insp.data_inspecao}</span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Status:</span>
                    <span className={styles.valor}>
                      {insp.danificado ? "Danificado" : "Sem danos"}
                    </span>
                  </div>

                  <div className={styles.linha}>
                    <span className={styles.label}>Observações:</span>
                    <span className={styles.valor}>{insp.descricao}</span>
                  </div>

                  <div className={styles.linhaBotoes}>
                    <button
                      className={styles.botaoEditarInspecao}
                      onClick={() => {
                        setEditarInspecao(insp);
                        setAbrirModalInspecao(true);
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className={styles.botaoExcluirInspecao}
                      onClick={async () => {
                        if (!window.confirm("Deseja excluir esta inspeção?"))
                          return;
                        try {
                          await InspecoesService.excluir(insp.id);
                          setDadosLocacao((prev) => ({
                            ...prev,
                            inspections: prev.inspections.filter(
                              (i) => i.id !== insp.id
                            ),
                          }));
                          setTipoMensagem("success");
                          setMensagem("Inspeção excluída com sucesso!");
                        } catch {
                          setTipoMensagem("error");
                          setMensagem("Erro ao excluir inspeção.");
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.semPagamentos}>
                Nenhuma inspeção registrada.
              </p>
            )}
          </div>
        </div>

        {/* MODAL DE PAGAMENTO */}
        {abrirModalPagamento && (
          <div
            className={styles.modalOverlay}
            onClick={() => setAbrirModalPagamento(false)}
          >
            <div
              className={styles.modalConteudo}
              onClick={(e) => e.stopPropagation()}
            >
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

        {/* MODAL DE INSPEÇÃO */}
        {abrirModalInspecao && (
          <div
            className={styles.modalOverlay}
            onClick={() => {
              setAbrirModalInspecao(false);
              setEditarInspecao(null);
            }}
          >
            <div
              className={styles.modalConteudo}
              onClick={(e) => e.stopPropagation()}
            >
              <RegistrarInspecao
                locacaoId={id}
                inspecao={editarInspecao}
                onConcluido={(novaInspecao) => {
                  setAbrirModalInspecao(false);
                  setDadosLocacao((prev) => {
                    const list = prev.inspections || [];
                    if (editarInspecao) {
                      return {
                        ...prev,
                        inspections: list.map((i) =>
                          i.id === novaInspecao.id ? novaInspecao : i
                        ),
                      };
                    } else {
                      return { ...prev, inspections: [...list, novaInspecao] };
                    }
                  });
                  setEditarInspecao(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
