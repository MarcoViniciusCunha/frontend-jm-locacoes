import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocacoesService } from "../../services/LocacoesService";
import ClientesList from "../../components/clientes/ClientesList";
import styles from "./locacoes.module.css";
import { FiSearch, FiX, FiEye } from "react-icons/fi";
import { FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Locacoes = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState(null);

  const [filtros, setFiltros] = useState({ cpf: "", placa: "", status: "" });
  const [mostrarClientes, setMostrarClientes] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [qtdPaginas, setQtdPaginas] = useState(0);

  const navigate = useNavigate();

  const buscarLocacoes = async (params = {}, page = 0, size = 12) => {
    try {
      setIsLoading(true);

      const paramsLimpos = {};
      for (const key in params) {
        if (
          params[key] !== "" &&
          params[key] !== undefined &&
          params[key] !== null
        ) {
          paramsLimpos[key] = params[key];
        }
      }

      paramsLimpos.page = page;
      paramsLimpos.size = size;

      const response = await LocacoesService.filtrar(paramsLimpos);
      const data = response.data;

      setLocacoes(data.content || []);
      setPaginaAtual(data.number || 0);
      setQtdPaginas(data.totalPages || 0);

      setMensagemErro(null);
    } catch (error) {
      console.error("Erro ao buscar locações:", error);
      setMensagemErro("Não foi possível carregar as locações.");
    } finally {
      setIsLoading(false);
    }
  };

  const aplicarFiltros = (e) => {
    e.preventDefault();
    buscarLocacoes(filtros, 0);
  };

  useEffect(() => {
    buscarLocacoes();
  }, []);

  const selecionarCliente = (cliente) => {
    setFiltros((prev) => ({ ...prev, cpf: cliente.cpf }));
    setMostrarClientes(false);
  };

  const paginaAnterior = () => {
    if (paginaAtual > 0) {
      buscarLocacoes(filtros, paginaAtual - 1);
    }
  };

  const proximaPagina = () => {
    if (paginaAtual + 1 < qtdPaginas) {
      buscarLocacoes(filtros, paginaAtual + 1);
    }
  };

  if (isLoading)
    return <p className={styles.loading}>Carregando locações...</p>;
  if (mensagemErro) return <p className={styles.error}>{mensagemErro}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.filterForm} onSubmit={aplicarFiltros}>
        <div className={styles.filterRow}>
          <input
            type="text"
            placeholder="CPF"
            value={filtros.cpf}
            onClick={() => setMostrarClientes(!mostrarClientes)}
            readOnly
          />

          <input
            type="text"
            placeholder="Placa"
            value={filtros.placa}
            onChange={(e) => setFiltros({ ...filtros, placa: e.target.value })}
          />

          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="ativa">Ativa</option>
            <option value="devolvida">Devolvida</option>
            <option value="atrasada">Atrasada</option>
          </select>
        </div>

        <button type="submit" className={styles.filterButton}>
          <FiSearch /> Buscar
        </button>
      </form>

      {mostrarClientes && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Selecione o Cliente</h3>
            <ClientesList onSelect={selecionarCliente} />
            <button
              className={styles.closeBtn}
              onClick={() => setMostrarClientes(false)}
            >
              <FiX /> Fechar
            </button>
          </div>
        </div>
      )}

      {locacoes.length === 0 ? (
        <p className={styles.empty}>Nenhuma locação encontrada.</p>
      ) : (
        <>
          <div className={styles.grid}>
            {locacoes.map((loc) => (
              <div key={loc.id} className={styles.card}>
                <h2 className={styles.cardTitle}>
                  {loc.customerName} — {loc.placa}
                </h2>

                <p>
                  <strong>Modelo:</strong> {loc.modelo}
                </p>

                <p>
                  <strong>Período:</strong> {loc.startDate} → {loc.endDate}
                </p>

                <p className={styles.status}>
                  <strong>Status:</strong>{" "}
                  {loc.status === "DEVOLVIDA" ? (
                    <span
                      className={`${styles.statusValue} ${styles.devolvida}`}
                    >
                      <FaCheckCircle /> Devolvida
                    </span>
                  ) : loc.status === "ATRASADA" ? (
                    <span
                      className={`${styles.statusValue} ${styles.atrasada}`}
                    >
                      <FaExclamationCircle /> Atrasada
                    </span>
                  ) : (
                    <span className={`${styles.statusValue} ${styles.ativa}`}>
                      <FaClock /> Ativa
                    </span>
                  )}
                </p>

                <p className={styles.price}>
                  <strong>Preço:</strong> R$ {loc.price?.toFixed(2)}
                </p>

                <div className={styles.buttons}>
                  <button
                    className={`${styles.button} ${styles.details}`}
                    onClick={() => navigate(`/locacoes/${loc.id}`)}
                  >
                    <FiEye /> Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>

          {qtdPaginas > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={paginaAnterior}
                disabled={paginaAtual === 0}
                className={styles.pageBtn}
              >
                ← Anterior
              </button>

              {(() => {
                const maxButtons = 5;
                const paginas = [];

                let inicio = Math.max(
                  0,
                  paginaAtual - Math.floor(maxButtons / 2)
                );
                let fim = inicio + maxButtons - 1;

                if (fim >= qtdPaginas) {
                  fim = qtdPaginas - 1;
                  inicio = Math.max(0, fim - maxButtons + 1);
                }

                if (inicio > 0) {
                  paginas.push(
                    <button
                      key="first"
                      className={styles.pageBtn}
                      onClick={() => buscarLocacoes(filtros, 0)}
                    >
                      1
                    </button>
                  );
                  if (inicio > 1) paginas.push(<span key="dots1">...</span>);
                }

                for (let i = inicio; i <= fim; i++) {
                  paginas.push(
                    <button
                      key={i}
                      className={`${styles.pageBtn} ${
                        i === paginaAtual ? styles.activePage : ""
                      }`}
                      onClick={() => buscarLocacoes(filtros, i)}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (fim < qtdPaginas - 1) {
                  if (fim < qtdPaginas - 2)
                    paginas.push(<span key="dots2">...</span>);
                  paginas.push(
                    <button
                      key="last"
                      className={styles.pageBtn}
                      onClick={() => buscarLocacoes(filtros, qtdPaginas - 1)}
                    >
                      {qtdPaginas}
                    </button>
                  );
                }

                return paginas;
              })()}

              <button
                onClick={proximaPagina}
                disabled={paginaAtual + 1 === qtdPaginas}
                className={styles.pageBtn}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Locacoes;
