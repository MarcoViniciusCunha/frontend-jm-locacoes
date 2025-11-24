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
    cpf: "",
    placa: "",
    status: "",
    formaPagto: "",
    data: "",
  });

  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navegar = useNavigate();

  // Carregar pagamentos com filtros e paginação
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
      params.size = 60;

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
    setFiltros({ cpf: "", placa: "", status: "", formaPagto: "", data: "" });
    carregarPagamentos(0);
  };

  const abrirLocacao = (item) => {
    navegar(`/locacoes/${item.rental.id}`);
  };

  const selecionarCliente = (cliente) => {
    setFiltros((prev) => ({ ...prev, cpf: cliente.cpf }));
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
          placeholder="CPF do cliente"
          value={filtros.cpf}
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
          <option value="PAGO">Pago</option>
          <option value="PENDENTE">Pendente</option>
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
        <div className={styles.paginacao}>
          <button
            disabled={paginaAtual === 0}
            onClick={() => carregarPagamentos(paginaAtual - 1)}
          >
            ⬅ Anterior
          </button>
          <span>
            Página {paginaAtual + 1} de {totalPaginas}
          </span>
          <button
            disabled={paginaAtual + 1 >= totalPaginas}
            onClick={() => carregarPagamentos(paginaAtual + 1)}
          >
            Próxima ➡
          </button>
        </div>
      )}
    </div>
  );
}
