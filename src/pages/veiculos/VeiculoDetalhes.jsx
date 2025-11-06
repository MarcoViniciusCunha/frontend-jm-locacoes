import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VeiculosService } from "../../services/VeiculosService";
import { LocacoesService } from "../../services/LocacoesService";
import styles from "./VeiculoDetalhes.module.css";

export default function VeiculoDetalhes() {
  const { placa } = useParams();
  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [cpf, setCpf] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    carregarVeiculo();
  }, [placa]);

  const carregarVeiculo = async () => {
    try {
      const response = await VeiculosService.veiculos.buscarPorPlaca(placa);
      setVeiculo(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículo:", error);
      alert("Não foi possível carregar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        placa,
        cpf,
        startDate,
        endDate,
        price: parseFloat(price),
      };

      await LocacoesService.add(dados);
      alert("Locação cadastrada com sucesso!");
      setMostrarFormulario(false);

      setCpf("");
      setStartDate("");
      setEndDate("");
      setPrice("");
    } catch (error) {
      console.error("Erro ao cadastrar locação:", error);
      alert("Erro ao cadastrar locação.");
    }
  };

  const handleManutencao = async () => {
    try {
      const novoStatus =
        veiculo.status === "manutencao" ? "disponivel" : "manutencao";

      console.log("Atualizando veículo:", placa, "para status:", novoStatus);

      await VeiculosService.veiculos.editar(placa, { status: novoStatus });

      // atualiza instantaneamente
      setVeiculo((prev) => ({ ...prev, status: novoStatus }));

      alert(
        novoStatus === "manutencao"
          ? "Veículo enviado para manutenção!"
          : "Veículo retornou à atividade!"
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao alterar status do veículo.");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!veiculo) return <p>Veículo não encontrado.</p>;

  return (
    <div className={styles.veiculoDetalhes}>
      <h1>
        {veiculo.brand?.nome} {veiculo.model?.nome} ({veiculo.ano})
      </h1>
      <p>
        <strong>Placa:</strong> {veiculo.placa}
      </p>
      <p>
        <strong>Cor:</strong> {veiculo.color?.nome}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={
            veiculo.status === "manutencao"
              ? styles.statusManutencao
              : styles.statusNormal
          }
        >
          {veiculo.status}
        </span>
      </p>
      <p>
        <strong>Categoria:</strong> {veiculo.category?.nome}
      </p>
      <p>
        <strong>Seguro:</strong> {veiculo.insurance?.empresa}
      </p>
      <p>
        <strong>Validade do seguro:</strong> {veiculo.insurance?.validade}
      </p>
      <p>
        <strong>Descrição:</strong> {veiculo.descricao}
      </p>

      <div className={styles.botoes}>
        <Link to="/veiculos" className={styles.voltarBtn}>
          ← Voltar
        </Link>

        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className={styles.locarBtn}
        >
          {mostrarFormulario ? "Cancelar Locação" : "Cadastrar Locação"}
        </button>

        <button onClick={handleManutencao} className={styles.manutencaoBtn}>
          {veiculo.status === "manutencao" ? "Retornar" : "Manutenção"}
        </button>
      </div>

      {mostrarFormulario && (
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h3>Nova Locação</h3>

          <label>CPF do Cliente:</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <label>Data de Início:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <label>Data de Término:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <label>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <button type="submit" className={styles.enviarBtn}>
            Enviar Locação
          </button>
        </form>
      )}
    </div>
  );
}
