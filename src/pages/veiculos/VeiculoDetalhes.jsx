import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VeiculosService } from "../../services/VeiculosService";
import { LocacoesService } from "../../services/LocacoesService";
import styles from "./VeiculoDetalhes.module.css";
import ClientesList from "../../components/clientes/ClientesList";

export default function VeiculoDetalhes() {
  const { placa } = useParams();
  const navigate = useNavigate();
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);

  // Campos de locação
  const [cpf, setCpf] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");

  // Campos de edição
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("");
  const [ano, setAno] = useState("");
  const [valorDiario, setValorDiario] = useState("");

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [seguro, setSeguro] = useState("");

  // Listas
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);

  useEffect(() => {
    carregarVeiculo();
    carregarListas();
  }, [placa]);

  const carregarListas = async () => {
    try {
      const [marcasRes, modelosRes, coresRes, categoriasRes, segurosRes] =
        await Promise.all([
          VeiculosService.marcas.lista(),
          VeiculosService.modelos.lista(),
          VeiculosService.cores.lista(),
          VeiculosService.categorias.lista(),
          VeiculosService.seguros.lista(),
        ]);

      setMarcas(marcasRes.data);
      setModelos(modelosRes.data);
      setCores(coresRes.data);
      setCategorias(categoriasRes.data);
      setSeguros(segurosRes.data);
    } catch (error) {
      console.error("Erro ao carregar listas:", error);
    }
  };

  const carregarVeiculo = async () => {
    try {
      const response = await VeiculosService.veiculos.buscarPorPlaca(placa);
      const v = response.data;
      setVeiculo(v);
      setDescricao(v.descricao || "");
      setStatus(v.status || "DISPONIVEL");
      setAno(v.ano || "");
      setValorDiario(v.valorDiario || "");
      setMarca(v.brand?.id || "");
      setModelo(v.model?.id || "");
      setCor(v.color?.id || "");
      setCategoria(v.category?.id || "");
      setSeguro(v.insurance?.id || "");
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
        veiculo.status === "MANUTENCAO" ? "DISPONIVEL" : "MANUTENCAO";

      await VeiculosService.veiculos.editar(placa, { status: novoStatus });
      setVeiculo((prev) => ({ ...prev, status: novoStatus }));

      alert(
        novoStatus === "MANUTENCAO"
          ? "Veículo enviado para manutenção!"
          : "Veículo retornou à atividade!"
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao alterar status do veículo.");
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const dadosAtualizados = {
        descricao,
        status,
        ano: parseInt(ano),
        valorDiario: parseFloat(valorDiario),
        id_brand: parseInt(marca),
        id_modelo: parseInt(modelo),
        id_cor: parseInt(cor),
        id_categoria: parseInt(categoria),
        id_seguro: parseInt(seguro),
      };

      await VeiculosService.veiculos.editar(placa, dadosAtualizados);

      alert("Veículo atualizado com sucesso!");
      setMostrarEdicao(false);
      carregarVeiculo();
    } catch (error) {
      console.error("Erro ao editar veículo:", error);
      alert("Erro ao editar veículo.");
    }
  };

  const handleExcluir = async () => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        await VeiculosService.veiculos.excluir(placa);
        alert("Veículo excluído com sucesso!");
        navigate("/veiculos");
      } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        alert("Erro ao excluir veículo.");
      }
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
            veiculo.status === "MANUTENCAO"
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
      <p>
        <strong>Valor diário:</strong> R$ {veiculo.valorDiario}
      </p>

      <div className={styles.botoes}>
        <Link to="/veiculos" className={styles.voltarBtn}>
          ← Voltar
        </Link>

        {/* Botão de cadastrar locação */}
        <button
          onClick={() => {
            if (!mostrarEdicao) {
              setMostrarFormulario(!mostrarFormulario);
            } else {
              setMostrarEdicao(false); // fecha edição se estiver aberta
              setMostrarFormulario(true); // abre locação
            }
          }}
          className={`${styles.locarBtn} ${
            mostrarEdicao ? styles.btnDesabilitado : ""
          }`}
          disabled={mostrarEdicao}
        >
          {mostrarFormulario ? "Cancelar Locação" : "Cadastrar Locação"}
        </button>

        <button onClick={handleManutencao} className={styles.manutencaoBtn}>
          {veiculo.status === "MANUTENCAO" ? "Retornar" : "Manutenção"}
        </button>

        {/* Botão de editar */}
        <button
          onClick={() => {
            if (!mostrarFormulario) {
              setMostrarEdicao(!mostrarEdicao);
            } else {
              setMostrarFormulario(false); // fecha locação se estiver aberta
              setMostrarEdicao(true); // abre edição
            }
          }}
          className={styles.editarBtn}
        >
          {mostrarEdicao ? "Cancelar Edição" : "Editar"}
        </button>

        <button onClick={handleExcluir} className={styles.excluirBtn}>
          Excluir
        </button>
      </div>

      {mostrarFormulario && (
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h3>Nova Locação</h3>
          <label>CPF do Cliente:</label>
          <div className={styles.campoCpf}>
            <input
              type="text"
              value={cpf ? `${cpf}` : "Selecione o cliente..."}
              readOnly
              onFocus={() => setShowCustomerList(true)}
              onBlur={() => setTimeout(() => setShowCustomerList(false), 200)}
              className={cpf ? styles.inputSelecionado : ""}
              required
            />

            {showCustomerList && (
              <div className={styles.listaClientesWrapper}>
                <ClientesList
                  onSelect={(cliente) => {
                    setCpf(cliente.cpf);
                    setShowCustomerList(false);
                  }}
                />
              </div>
            )}
          </div>

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
          <button type="submit" className={styles.enviarBtn}>
            Enviar Locação
          </button>
        </form>
      )}

      {mostrarEdicao && (
        <form className={styles.formulario} onSubmit={handleEditar}>
          <h3>Editar Veículo</h3>

          <label>Marca:</label>
          <select
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>

          <label>Modelo:</label>
          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {modelos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>

          <label>Cor:</label>
          <select value={cor} onChange={(e) => setCor(e.target.value)} required>
            <option value="">Selecione...</option>
            {cores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <label>Categoria:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <label>Seguro:</label>
          <select
            value={seguro}
            onChange={(e) => setSeguro(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {seguros.map((s) => (
              <option key={s.id} value={s.id}>
                {s.empresa}
              </option>
            ))}
          </select>

          <label>Ano:</label>
          <input
            type="number"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            required
          />

          <label>Valor Diário (R$):</label>
          <input
            type="number"
            step="0.01"
            value={valorDiario}
            onChange={(e) => setValorDiario(e.target.value)}
            required
          />

          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="DISPONIVEL">Disponível</option>
            <option value="ALUGADO">Alugado</option>
            <option value="MANUTENCAO">Manutenção</option>
          </select>

          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <button type="submit" className={styles.enviarBtn}>
            Salvar Alterações
          </button>
        </form>
      )}
    </div>
  );
}
