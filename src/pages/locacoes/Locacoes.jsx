import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocacoesService } from "../../services/LocacoesService";
import styles from "./locacoes.module.css";

const Locacoes = () => {
  const [locacoes, setLocacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState({ cpf: "", placa: "", status: "" });
  const navigate = useNavigate();

  const carregarLocacoes = async (params = {}) => {
    try {
      setLoading(true);
      const response = Object.keys(params).length
        ? await LocacoesService.filtrar(params)
        : await LocacoesService.lista();

      const data = response.data.content || response.data; // suporta paginação
      setLocacoes(data);
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
    carregarLocacoes(filtro);
  };

  const handleDevolver = async (id) => {
    if (!window.confirm("Confirmar devolução do veículo?")) return;
    try {
      await LocacoesService.devolver(id);
      await carregarLocacoes();
    } catch {
      alert("Erro ao registrar devolução.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta locação?")) return;
    try {
      await LocacoesService.excluir(id);
      await carregarLocacoes();
    } catch {
      alert("Erro ao excluir locação.");
    }
  };

  useEffect(() => {
    carregarLocacoes();
  }, []);

  if (loading) return <p className={styles.loading}>Carregando locações...</p>;
  if (erro) return <p className={styles.error}>{erro}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📋 Locações</h1>

      {/* 🔎 Formulário de Filtro */}
      <form className={styles.filterForm} onSubmit={handleFiltrar}>
        <input
          type="text"
          placeholder="CPF"
          value={filtro.cpf}
          onChange={(e) => setFiltro({ ...filtro, cpf: e.target.value })}
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
          <option value="ativo">Ativo</option>
          <option value="devolvido">Devolvido</option>
        </select>
        <button type="submit" className={styles.filterButton}>
          Filtrar
        </button>
      </form>

      {/* 🧾 Lista de Locações */}
      {locacoes.length === 0 ? (
        <p className={styles.empty}>Nenhuma locação encontrada.</p>
      ) : (
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
                {loc.returned ? "Devolvido ✅" : "Ativo 🚗"}
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
      )}
    </div>
  );
};

export default Locacoes;
