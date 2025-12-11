import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { VeiculosService } from "../../services/VeiculosService";
import { LocacoesService } from "../../services/LocacoesService";
import MessageBox from "../../components/erro/MensagemErro";
import styles from "./VeiculoDetalhes.module.css";
import ClientesList from "../../components/clientes/ClientesList";
import DatePicker from "react-datepicker";
import ConfirmModal from "../../components/erro/ConfirmModal";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiTool,
  FiClipboard,
  FiSend,
} from "react-icons/fi";

export default function VeiculoDetalhes() {
  const { placa } = useParams();
  const navigate = useNavigate();
  const customerRef = useRef(null);
  const [showCustomerList, setShowCustomerList] = useState(false);

  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEdicao, setMostrarEdicao] = useState(false);

  // Campos de locação
  const [clienteId, setClienteId] = useState("");
  const [cpf, setCpf] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const [locacoesExistentes, setLocacoesExistentes] = useState([]);
  const [abrirConfirmExcluir, setAbrirConfirmExcluir] = useState(false);

  const [msg, setMsg] = useState({ type: "", text: "" });
  const hoje = new Date();

  useEffect(() => {
    carregarVeiculo();
    carregarListas();
  }, [placa]);

  useEffect(() => {
    const carregarLocacoes = async () => {
      try {
        const res = await LocacoesService.filtrar({ placa });
        setLocacoesExistentes(res.data.content || []);
      } catch (err) {
        console.error("Erro ao buscar locações:", err);
      }
    };
    carregarLocacoes();
  }, [placa]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (customerRef.current && !customerRef.current.contains(event.target)) {
        setShowCustomerList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const normalizeStatus = (status) => {
    switch (status) {
      case "Disponível":
        return "DISPONIVEL";
      case "Alugado":
        return "ALUGADO";
      case "Manutenção":
        return "MANUTENCAO";
      default:
        return status?.toUpperCase() || "DISPONIVEL";
    }
  };

  const carregarVeiculo = async () => {
    try {
      const response = await VeiculosService.veiculos.buscarPorPlaca(placa);
      const v = response.data;
      const statusNormalized = normalizeStatus(v.status);

      setVeiculo({ ...v, status: statusNormalized });
      setStatus(statusNormalized);
      setDescricao(v.descricao || "");
      setAno(v.ano || "");
      setValorDiario(v.valorDiario || "");
      setMarca(v.brand?.id || "");
      setModelo(v.model?.id || "");
      setCor(v.color?.id || "");
      setCategoria(v.category?.id || "");
      setSeguro(v.insurance?.id?.toString() || "");
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
        customerId: clienteId,
        startDate,
        endDate,
        price: parseFloat(price),
      };

      await LocacoesService.add(dados);
      showMessage("success", "Locação cadastrada com sucesso");
      setMostrarFormulario(false);
      setCpf("");
      setStartDate("");
      setEndDate("");
      setPrice("");
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.error || "Erro ao cadastrar locação.";
      showMessage("error", msg);
    }
  };

  const handleManutencao = async () => {
    try {
      const novoStatus =
        veiculo.status === "MANUTENCAO" ? "DISPONIVEL" : "MANUTENCAO";

      const response = await VeiculosService.veiculos.editar(placa, {
        status: novoStatus,
      });

      setVeiculo((prev) => ({ ...prev, status: novoStatus }));

      showMessage(
        "info",
        response.data.message ||
          (novoStatus === "MANUTENCAO"
            ? "Veículo enviado para manutenção!"
            : "Veículo retornou à atividade!")
      );
    } catch (error) {
      const backendMsg =
        error.response?.data?.message || "Erro ao alterar status do veículo.";
      showMessage("error", backendMsg);
    }
  };

  const statusMap = {
    DISPONIVEL: { label: "DISPONÍVEL", style: styles.statusDisponivel },
    ALUGADO: { label: "ALUGADO", style: styles.statusAlugado },
    MANUTENCAO: { label: "MANUTENÇÃO", style: styles.statusManutencao },
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

      showMessage("success", "Veículo atualizado com sucesso!");
      setMostrarEdicao(false);
      carregarVeiculo();
    } catch (e) {
      const backendMsg = e.response?.data?.message || "Erro ao editar veículo.";
      showMessage("error", backendMsg);
    }
  };

  const handleExcluir = async () => {
    setAbrirConfirmExcluir(true);
  };

  const confirmarExcluir = async () => {
    try {
      await VeiculosService.veiculos.excluir(placa);
      showMessage("success", "Veículo excluído com sucesso!");
      navigate("/veiculos");
    } catch (e) {
      const msg = e.response?.data?.message || "Erro ao excluir veículo.";
      showMessage("error", msg);
    } finally {
      setAbrirConfirmExcluir(false);
    }
  };

  const showMessage = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 4000); // desaparece depois de 4s
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
          className={`${styles.statusBadge} ${
            statusMap[veiculo.status]?.style
          }`}
        >
          {statusMap[veiculo.status]?.label || veiculo.status}
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

      <MessageBox type={msg.type} message={msg.text} />

      <div className={styles.botoes}>
        <Link
          to="/veiculos"
          className={`${styles.btnAcao} ${styles.voltarBtn}`}
        >
          <FiArrowLeft /> Voltar
        </Link>

        <button
          onClick={() => {
            if (!mostrarEdicao) {
              setMostrarFormulario(!mostrarFormulario);
            } else {
              setMostrarEdicao(false);
              setMostrarFormulario(true);
            }
          }}
          className={`${styles.btnAcao} ${styles.locarBtn} ${
            mostrarEdicao ? styles.btnDesabilitado : ""
          }`}
          disabled={mostrarEdicao}
        >
          <FiClipboard />
          {mostrarFormulario ? "Cancelar Locação" : "Cadastrar Locação"}
        </button>

        <button
          onClick={handleManutencao}
          className={`${styles.btnAcao} ${styles.manutencaoBtn}`}
        >
          <FiTool />
          {veiculo.status === "MANUTENCAO" ? "Retornar" : "Manutenção"}
        </button>

        <button
          onClick={() => {
            if (!mostrarFormulario) {
              setMostrarEdicao(!mostrarEdicao);
            } else {
              setMostrarFormulario(false);
              setMostrarEdicao(true);
            }
          }}
          className={`${styles.btnAcao} ${styles.editarBtn}`}
        >
          <FiEdit />
          {mostrarEdicao ? "Cancelar" : "Editar"}
        </button>

        <button
          onClick={handleExcluir}
          className={`${styles.btnAcao} ${styles.excluirBtn}`}
        >
          <FiTrash2 /> Excluir
        </button>
        {abrirConfirmExcluir && (
          <ConfirmModal
            title="Confirmar Exclusão"
            message="Deseja realmente excluir este veículo?"
            onCancel={() => setAbrirConfirmExcluir(false)}
            onConfirm={confirmarExcluir}
          />
        )}
      </div>

      {mostrarFormulario && (
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <h3>
            <FiClipboard /> Nova Locação
          </h3>
          <label>CPF do Cliente:</label>
          <div ref={customerRef} className={styles.campoCpf}>
            <input
              type="text"
              value={cpf}
              placeholder="Selecione o cliente..."
              readOnly
              onFocus={() => setShowCustomerList(true)}
              required
            />

            {showCustomerList && (
              <div className={styles.listaClientesWrapper}>
                <ClientesList
                  aoSelecionar={(cliente) => {
                    setClienteId(cliente.id);
                    setCpf(cliente.cpfMasked);
                    setShowCustomerList(false);
                  }}
                />
              </div>
            )}
          </div>

          <label>Data de Início:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={hoje}
            excludeDateIntervals={locacoesExistentes.map((loc) => ({
              start: new Date(loc.startDate),
              end: new Date(loc.endDate),
            }))}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data de início"
            required
          />

          <label>Data de Término:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || hoje}
            excludeDateIntervals={locacoesExistentes.map((loc) => ({
              start: new Date(loc.startDate),
              end: new Date(loc.endDate),
            }))}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecione a data de término"
            required
          />

          <button type="submit" className={styles.enviarBtn}>
            <FiSend /> Enviar Locação
          </button>
        </form>
      )}

      {mostrarEdicao && (
        <form className={styles.formulario} onSubmit={handleEditar}>
          <h3>
            <FiEdit /> Editar Veículo
          </h3>

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
              <option key={s.id} value={s.id.toString()}>
                {s.company.name} {s.validade}
              </option>
            ))}
            {veiculo.insurance &&
              !seguros.some((s) => s.id === veiculo.insurance.id) && (
                <option value={veiculo.insurance.id.toString()}>
                  {veiculo.insurance.company.name} -{" "}
                  {veiculo.insurance.validade}
                </option>
              )}
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
            <FiSend /> Salvar Alterações
          </button>
        </form>
      )}
    </div>
  );
}
