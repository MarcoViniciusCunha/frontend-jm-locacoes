import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocacoesService } from "../../services/LocacoesService";
import ClientesList from "../../components/clientes/ClientesList";
import styles from "./locacoes.module.css";

const Locacoes = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState({ cpf: "", placa: "", status: "" });
  const [showClientes, setShowClientes] = useState(false);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const navigate = useNavigate();

  const carregarLocacoes = async (params = {}, page = 0, size = 10) => {
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
          Filtrar
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
              Fechar
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
                <p>
                  <strong>Status:</strong>{" "}
                  {loc.status === "DEVOLVIDA"
                    ? "Devolvida ✅"
                    : loc.status === "ATRASADA"
                    ? "Atrasada ⏰"
                    : "Ativa 🚗"}
                </p>
                <p className={styles.price}>
                  <strong>Preço:</strong> R$ {loc.price?.toFixed(2)}
                </p>

                <div className={styles.buttons}>
                  <button
                    className={`${styles.button} ${styles.details}`}
                    onClick={() => navigate(`/locacoes/${loc.id}`)}
                  >
                    Ver detalhes
                  </button>
                  {!loc.returned && (
                    <button
                      className={`${styles.button} ${styles.devolver}`}
                      onClick={() => handleDevolver(loc.id)}
                    >
                      Devolver
                    </button>
                  )}
                  <button
                    className={`${styles.button} ${styles.excluir}`}
                    onClick={() => handleExcluir(loc.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Paginação */}
          {totalPaginas >= 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePaginaAnterior}
                disabled={paginaAtual === 0}
              >
                ← Anterior
              </button>

              <span>
                Página {paginaAtual + 1} de {totalPaginas}
              </span>

              <button
                onClick={handleProximaPagina}
                disabled={paginaAtual + 1 === totalPaginas}
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
