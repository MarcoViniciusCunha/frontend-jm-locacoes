import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentsService } from "../../services/LocacoesService";
import ClientesList from "../../components/clientes/ClientesList";
import MessageBox from "../../components/erro/MensagemErro";
import styles from "./pagamentos.module.css";
import { FiEye, FiSearch, FiX } from "react-icons/fi";

export default function Pagamentos() {
  const [listaPagamentos, setListaPagamentos] = useState([]);
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [filtros, setFiltros] = useState({
    customerId: "",
    customerNome: "",
    placa: "",
    status: "",
    formaPagto: "",
    data: "",
  });

  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navegar = useNavigate();

  const carregarPagamentos = async (page = 0) => {
    try {
      setEstaCarregando(true);
      setMensagemErro("");

      const params = {};
      for (const key in filtros) {
        if (filtros[key] !== "" && filtros[key] != null) {
          params[key] = filtros[key];
        }
      }
      params.page = page;
      params.size = 15;

      const resposta = await PaymentsService.filtrar(params);
      const data = resposta.data;

      setListaPagamentos(data.content || []);
      setPaginaAtual(data.number || 0);
      setTotalPaginas(data.totalPages || 0);
    } catch (erro) {
      console.error("Erro ao carregar pagamentos:", erro);
      setMensagemErro("Não foi possível carregar os pagamentos.");
    } finally {
      setEstaCarregando(false);
    }
  };

  useEffect(() => {
    carregarPagamentos(0);
  }, []);

  const buscarComFiltros = () => carregarPagamentos(0);

  const limparFiltros = () => {
    setFiltros({
      customerId: "",
      customerNome: "",
      placa: "",
      status: "",
      formaPagto: "",
      data: "",
    });
    carregarPagamentos(0);
  };

  const abrirLocacao = (item) => {
    navegar(`/locacoes/${item.rental.id}`);
  };

  const selecionarCliente = (cliente) => {
    setFiltros((prev) => ({
      ...prev,
      customerId: cliente.id,
      customerNome: cliente.nome,
    }));
    setMostrarClientes(false);
  };

  const nenhumEncontrado =
    !estaCarregando && listaPagamentos.length === 0 && !mensagemErro;

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Pagamentos</h1>

      {/* FILTROS */}
      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Cliente"
          value={filtros.customerNome}
          onClick={() => setMostrarClientes(true)}
          readOnly
        />

        <input
          type="text"
          placeholder="Placa do veículo"
          value={filtros.placa}
          onChange={(e) => setFiltros({ ...filtros, placa: e.target.value })}
        />

        <select
          value={filtros.status}
          onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
        >
          <option value="">Status...</option>
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
        </select>

        <select
          value={filtros.formaPagto}
          onChange={(e) =>
            setFiltros({ ...filtros, formaPagto: e.target.value })
          }
        >
          <option value="">Forma Pagto...</option>
          <option value="PIX">PIX</option>
          <option value="DEBITO">Débito</option>
          <option value="CREDITO">Crédito</option>
        </select>

        <input
          type="date"
          value={filtros.data}
          onChange={(e) => setFiltros({ ...filtros, data: e.target.value })}
        />

        <div className={styles.filtrosBotoes}>
          <button className={styles.btnBuscar} onClick={buscarComFiltros}>
            <FiSearch size={18} /> Buscar
          </button>
          <button className={styles.btnLimpar} onClick={limparFiltros}>
            <FiX size={18} /> Limpar
          </button>
        </div>
      </div>

      {/* MODAL DE CLIENTES */}
      {mostrarClientes && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Selecione o Cliente</h3>
            <ClientesList aoSelecionar={selecionarCliente} />
            <button
              className={styles.closeBtn}
              onClick={() => setMostrarClientes(false)}
            >
              <FiX /> Fechar
            </button>
          </div>
        </div>
      )}

      {/* MENSAGENS */}
      {mensagemErro && <MessageBox tipo="erro" mensagem={mensagemErro} />}
      {estaCarregando && <div className={styles.loading}>Carregando...</div>}
      {nenhumEncontrado && (
        <div className={styles.semDados}>Nenhum pagamento encontrado.</div>
      )}

      {/* LISTA DE PAGAMENTOS */}
      <div className={styles.lista}>
        {!estaCarregando &&
          listaPagamentos.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.topoCard}>
                <span className={styles.label}>Placa do veículo:</span>
                <span className={styles.placa}>{item.rental.vehiclePlaca}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Cliente:</span>
                <span>{item.rental.customerNome}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Data:</span>
                <span>{item.dataPagamento}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Status:</span>
                <span
                  className={`${styles.status} ${
                    item.status === "Pago" || item.status === "PAGO"
                      ? styles.pago
                      : styles.pendente
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Forma Pagto:</span>
                <span>{item.formaPagto}</span>
              </div>

              <div className={styles.botoes}>
                <button
                  className={styles.btnDetalhes}
                  onClick={() => abrirLocacao(item)}
                >
                  <FiEye size={18} /> Ver Locação
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* PAGINAÇÃO */}
      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          {/* Botão Anterior */}
          <button
            onClick={() => carregarPagamentos(paginaAtual - 1)}
            disabled={paginaAtual === 0}
            className={styles.paginationNav}
          >
            ← Anterior
          </button>

          {/* Botões numéricos */}
          {(() => {
            const maxButtons = 5;
            const pages = [];
            let start = Math.max(0, paginaAtual - Math.floor(maxButtons / 2));
            let end = start + maxButtons - 1;

            if (end >= totalPaginas) {
              end = totalPaginas - 1;
              start = Math.max(0, end - maxButtons + 1);
            }

            if (start > 0) {
              pages.push(
                <button
                  key="first"
                  className={styles.pageBtn}
                  onClick={() => carregarPagamentos(0)}
                >
                  1
                </button>
              );
              if (start > 1)
                pages.push(
                  <span key="dots1" className={styles.paginationEllipsis}>
                    ...
                  </span>
                );
            }

            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  className={`${styles.pageBtn} ${
                    i === paginaAtual ? styles.activePage : ""
                  }`}
                  onClick={() => carregarPagamentos(i)}
                >
                  {i + 1}
                </button>
              );
            }

            if (end < totalPaginas - 1) {
              if (end < totalPaginas - 2)
                pages.push(
                  <span key="dots2" className={styles.paginationEllipsis}>
                    ...
                  </span>
                );
              pages.push(
                <button
                  key="last"
                  className={styles.pageBtn}
                  onClick={() => carregarPagamentos(totalPaginas - 1)}
                >
                  {totalPaginas}
                </button>
              );
            }

            return pages;
          })()}

          {/* Botão Próxima */}
          <button
            onClick={() => carregarPagamentos(paginaAtual + 1)}
            disabled={paginaAtual + 1 === totalPaginas}
            className={styles.paginationNav}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
