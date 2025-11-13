import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocacoesService } from "../../services/LocacoesService";
import ClientesList from "../../components/clientes/ClientesList";
import styles from "./locacoes.module.css";
import {
  FiSearch,
  FiX,
  FiEye,
  FiCornerDownLeft,
  FiTrash2,
} from "react-icons/fi";
import { FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Locacoes = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState({ cpf: "", placa: "", status: "" });
  const [showClientes, setShowClientes] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navigate = useNavigate();

  const carregarLocacoes = async (params = {}, page = 0, size = 12) => {
    try {
      setLoading(true);

      const cleanParams = {};
      for (const key in params) {
        const value = params[key];
        if (value !== "" && value !== undefined && value !== null) {
          cleanParams[key] = value;
        }
      }

      // 🔹 adiciona paginação
      cleanParams.page = page;
      cleanParams.size = size;

      const response = await LocacoesService.filtrar(cleanParams);
      const data = response.data;

      setLocacoes(data.content || []);
      setPaginaAtual(data.number || 0);
      setTotalPaginas(data.totalPages || 0);
      console.log("Paginação recebida:", {
        paginaAtual: data.number,
        totalPaginas: data.totalPages,
        totalElementos: data.totalElements,
      });

      setErro(null);
    } catch (error) {
      console.error("Erro ao buscar locações:", error);
      setErro("Não foi possível carregar as locações.");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    carregarLocacoes(filtro, 0);
  };

  const handleDevolver = async (id) => {
    if (!window.confirm("Confirmar devolução do veículo?")) return;
    try {
      await LocacoesService.devolver(id);
      await carregarLocacoes(filtro, paginaAtual);
    } catch {
      alert("Erro ao registrar devolução.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta locação?")) return;
    try {
      await LocacoesService.excluir(id);
      await carregarLocacoes(filtro, paginaAtual);
    } catch {
      alert("Erro ao excluir locação.");
    }
  };

  useEffect(() => {
    carregarLocacoes();
  }, []);

  const handleSelectCliente = (cliente) => {
    setFiltro((prev) => ({ ...prev, cpf: cliente.cpf }));
    setShowClientes(false);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 0) {
      carregarLocacoes(filtro, paginaAtual - 1);
    }
  };

  const handleProximaPagina = () => {
    if (paginaAtual + 1 < totalPaginas) {
      carregarLocacoes(filtro, paginaAtual + 1);
    }
  };

  if (loading) return <p className={styles.loading}>Carregando locações...</p>;
  if (erro) return <p className={styles.error}>{erro}</p>;

  return (
    <div className={styles.container}>
      <form className={styles.filterForm} onSubmit={handleFiltrar}>
        <div className={styles.filterRow}>
          {/* 🔹 Input de CPF que abre a lista de clientes */}
          <input
            type="text"
            placeholder="CPF"
            value={filtro.cpf}
            onClick={() => setShowClientes(!showClientes)}
            readOnly
          />

          <input
            type="text"
            placeholder="Placa"
            value={filtro.placa}
            onChange={(e) => setFiltro({ ...filtro, placa: e.target.value })}
          />

          <select
            value={filtro.status}
            onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
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

      {/* 🔹 Modal de clientes */}
      {showClientes && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Selecione o Cliente</h3>
            <ClientesList onSelect={handleSelectCliente} />
            <button
              className={styles.closeBtn}
              onClick={() => setShowClientes(false)}
            >
              <FiX /> Fechar
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Lista de locações */}
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
                <p className={`${styles.status}`}>
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
                  {!loc.returned && (
                    <button
                      className={`${styles.button} ${styles.devolver}`}
                      onClick={() => handleDevolver(loc.id)}
                    >
                      <FiCornerDownLeft /> Devolver
                    </button>
                  )}
                  <button
                    className={`${styles.button} ${styles.excluir}`}
                    onClick={() => handleExcluir(loc.id)}
                  >
                    <FiTrash2 /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Paginação */}
          {totalPaginas > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 0}
                className={styles.pageBtn}
              >
                ← Anterior
              </button>

              {/* Paginação com limite de botões */}
              {(() => {
                const maxButtons = 5;
                const pages = [];

                let startPage = Math.max(
                  0,
                  paginaAtual - Math.floor(maxButtons / 2)
                );
                let endPage = startPage + maxButtons - 1;

                if (endPage >= totalPaginas) {
                  endPage = totalPaginas - 1;
                  startPage = Math.max(0, endPage - maxButtons + 1);
                }

                if (startPage > 0) {
                  pages.push(
                    <button
                      key="first"
                      className={styles.pageBtn}
                      onClick={() => carregarLocacoes(filtro, 0)}
                    >
                      1
                    </button>
                  );
                  if (startPage > 1) pages.push(<span key="dots1">...</span>);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`${styles.pageBtn} ${
                        i === paginaAtual ? styles.activePage : ""
                      }`}
                      onClick={() => carregarLocacoes(filtro, i)}
                    >
                      {i + 1}
                    </button>
                  );
                }

                if (endPage < totalPaginas - 1) {
                  if (endPage < totalPaginas - 2)
                    pages.push(<span key="dots2">...</span>);
                  pages.push(
                    <button
                      key="last"
                      className={styles.pageBtn}
                      onClick={() => carregarLocacoes(filtro, totalPaginas - 1)}
                    >
                      {totalPaginas}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={handleProximaPagina}
                disabled={paginaAtual + 1 === totalPaginas}
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
