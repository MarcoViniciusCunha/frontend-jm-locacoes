import { useEffect, useState } from "react";
import { MultasService } from "../../services/LocacoesService";
import ClientesList from "../../components/clientes/ClientesList";
import styles from "./MultasList.module.css";
import MessageBox from "../../components/erro/MensagemErro";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const MultasList = () => {
  const navigate = useNavigate();

  const [multas, setMultas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalClientes, setAbrirModalClientes] = useState(false);

  const [form, setForm] = useState({
    placa: "",
    descricao: "",
    valor: "",
    dataMulta: "",
  });

  const [filtros, setFiltros] = useState({
    placa: "",
    cpf: "",
    dataInicial: "",
    dataFinal: "",
  });

  useEffect(() => {
    carregarMultas();
  }, []);

  const carregarMultas = async (params = {}) => {
    try {
      setCarregando(true);

      const temFiltros = Object.keys(params).length > 0;

      const res = temFiltros
        ? await MultasService.filtrar(params)
        : await MultasService.lista();

      setMultas(res.data.content || res.data);
    } catch {
      setTipoMensagem("error");
      setMensagem("Erro ao carregar multas.");
    } finally {
      setCarregando(false);
    }
  };

  const lidarMudanca = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarMulta = async () => {
    if (!form.placa || !form.valor || !form.dataMulta) {
      setTipoMensagem("error");
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const resposta = await MultasService.add(form);

      setTipoMensagem("success");
      setMensagem("Multa registrada com sucesso!");

      setMultas((prev) => [...prev, resposta.data]);

      setForm({
        placa: "",
        descricao: "",
        valor: "",
        dataMulta: "",
      });

      setAbrirModal(false);
    } catch (e) {
      setTipoMensagem("error");
      setMensagem(e.response?.data?.error || "Erro ao registrar multa.");
    }
  };

  const aplicarFiltros = () => {
    const params = {};

    if (filtros.placa) params.placa = filtros.placa;
    if (filtros.cpf) params.cpf = filtros.cpf;
    if (filtros.dataInicial) params.dataInicial = filtros.dataInicial;
    if (filtros.dataFinal) params.dataFinal = filtros.dataFinal;

    carregarMultas(params);
  };

  const limparFiltros = () => {
    setFiltros({ placa: "", cpf: "", dataInicial: "", dataFinal: "" });
    carregarMultas();
  };

  const selecionarCliente = (cliente) => {
    setFiltros((prev) => ({ ...prev, cpf: cliente.cpf }));
    setAbrirModalClientes(false);
  };

  return (
    <div className={styles.pagina}>
      <div className={styles.cabecalho}>
        <h1>Multas</h1>

        <button
          className={styles.botaoRegistrar}
          onClick={() => setAbrirModal(true)}
        >
          Registrar Multa
        </button>
      </div>

      {/* FILTROS */}
      <div className={styles.filtros}>
        {/* PLACA */}
        <input
          type="text"
          placeholder="Placa"
          value={filtros.placa}
          onChange={(e) => setFiltros((f) => ({ ...f, placa: e.target.value }))}
        />

        {/* CLIENTE (CPF) */}
        <input
          type="text"
          placeholder="CPF do Cliente"
          value={filtros.cpf}
          readOnly
          onClick={() => setAbrirModalClientes(true)}
        />

        {/* DATA INICIAL */}
        <input
          type="date"
          value={filtros.dataInicial}
          onChange={(e) =>
            setFiltros((f) => ({ ...f, dataInicial: e.target.value }))
          }
        />

        {/* DATA FINAL */}
        <input
          type="date"
          value={filtros.dataFinal}
          onChange={(e) =>
            setFiltros((f) => ({ ...f, dataFinal: e.target.value }))
          }
        />

        <div className={styles.btnsFiltro}>
          <button className={styles.btnBuscar} onClick={aplicarFiltros}>
            <FiSearch size={18} /> Buscar
          </button>

          <button className={styles.btnLimpar} onClick={limparFiltros}>
            <FiX size={18} /> Limpar
          </button>
        </div>
      </div>

      <MessageBox type={tipoMensagem} message={mensagem} />

      {carregando ? (
        <div className={styles.carregando}>Carregando...</div>
      ) : multas.length === 0 ? (
        <p className={styles.semDados}>Nenhuma multa encontrada.</p>
      ) : (
        <div className={styles.lista}>
          {multas.map((m) => (
            <div key={m.id} className={styles.card}>
              <div className={styles.linha}>
                <span className={styles.label}>Placa:</span>
                <span className={styles.valor}>{m.rental?.vehiclePlaca}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Cliente:</span>
                <span className={styles.valor}>{m.rental?.customerNome}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Data:</span>
                <span className={styles.valor}>{m.data_multa}</span>
              </div>

              <div className={styles.botoesLinha}>
                <button
                  className={styles.botaoDetalhes}
                  onClick={() => navigate(`/locacoes/${m.rental?.id}`)}
                >
                  Ver Locação
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CLIENTES */}
      {abrirModalClientes && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <button
              className={styles.modalFechar}
              onClick={() => setAbrirModalClientes(false)}
            >
              X
            </button>

            <h2>Selecionar Cliente</h2>

            <ClientesList aoSelecionar={selecionarCliente} />
          </div>
        </div>
      )}

      {/* MODAL CADASTRO */}
      {abrirModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalConteudo}>
            <button
              className={styles.modalFechar}
              onClick={() => setAbrirModal(false)}
            >
              X
            </button>

            <h2>Registrar Nova Multa</h2>

            <div className={styles.formGrupo}>
              <label>Placa *</label>
              <input name="placa" value={form.placa} onChange={lidarMudanca} />
            </div>

            <div className={styles.formGrupo}>
              <label>Descrição</label>
              <input
                name="descricao"
                value={form.descricao}
                onChange={lidarMudanca}
              />
            </div>

            <div className={styles.formGrupo}>
              <label>Valor *</label>
              <input
                name="valor"
                type="number"
                value={form.valor}
                onChange={lidarMudanca}
              />
            </div>

            <div className={styles.formGrupo}>
              <label>Data da Multa *</label>
              <input
                name="dataMulta"
                type="date"
                value={form.dataMulta}
                onChange={lidarMudanca}
              />
            </div>

            <button className={styles.botaoSalvar} onClick={registrarMulta}>
              Salvar Multa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultasList;
