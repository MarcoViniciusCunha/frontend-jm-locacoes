import { useEffect, useState, useCallback } from "react";
import { ClientesService } from "../../services/ClientesService";
import { Link } from "react-router-dom";
import { FiSearch, FiUsers, FiUserPlus, FiFileText } from "react-icons/fi";
import { IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import ClienteForm from "../../components/clientes/ClienteForm";
import MessageBox from "../../components/erro/MensagemErro";
import styles from "./Clientes.module.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  const exibirMensagem = (tipo, texto) => {
    setTipoMensagem(tipo);
    setMensagem(texto);
  };

  const carregarClientes = useCallback(async () => {
    try {
      setCarregando(true);
      const { data } = await ClientesService.lista();
      setClientes(data);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.error || "Erro ao carregar clientes.";
      exibirMensagem("error", msg);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const buscarClientes = async (e) => {
    e.preventDefault();

    const termo = busca.trim();
    if (!termo) return carregarClientes();

    try {
      setCarregando(true);
      const { data } = await ClientesService.getByName(termo);
      setClientes(data);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.error || "Erro ao buscar clientes.";
      exibirMensagem("error", msg);
      carregarClientes();
    } finally {
      setBusca("");
      setCarregando(false);
    }
  };

  const adicionarCliente = async (novoCliente) => {
    try {
      await ClientesService.add(novoCliente);
      exibirMensagem("success", "Cliente cadastrado com sucesso!");
      setMostrarFormulario(false);
      carregarClientes();
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || "Erro ao cadastrar cliente.";
      exibirMensagem("error", msg);
    }
  };

  const abrirFormulario = () => setMostrarFormulario(true);
  const fecharFormulario = () => setMostrarFormulario(false);

  return (
    <div className={styles.container}>
      <div className={styles.titleBar}>
        <h2>
          <FiUsers /> Gestão de Clientes
        </h2>
      </div>

      <MessageBox type={tipoMensagem} message={mensagem} />

      {/* Barra superior */}
      <div className={styles.topBar}>
        {!mostrarFormulario ? (
          <>
            <form className={styles.searchForm} onSubmit={buscarClientes}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.icon} size={18} />

                <input
                  type="text"
                  placeholder="Digite o nome do cliente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <button type="submit" disabled={carregando}>
                {carregando ? "Buscando..." : "Buscar"}
              </button>
            </form>

            <button className={styles.addButton} onClick={abrirFormulario}>
              <IoMdAdd size={20} /> Novo Cliente
            </button>
          </>
        ) : (
          <button className={styles.backButton} onClick={fecharFormulario}>
            <IoMdArrowRoundBack size={20} /> Voltar
          </button>
        )}
      </div>

      {/* Lista */}
      {!mostrarFormulario && (
        <ul>
          <li className={styles.header}>
            <span className={styles.nome}>Nome</span>
            <span className={styles.cpf}>CPF</span>
            <span className={styles.acoes}>Ações</span>
          </li>

          {clientes.length === 0 ? (
            <p className={styles.empty}>Nenhum cliente encontrado.</p>
          ) : (
            clientes.map((cliente) => (
              <li key={cliente.id}>
                <span className={styles.nome}>{cliente.nome}</span>
                <span className={styles.cpf}>{cliente.cpf}</span>

                <Link to={`/clientes/${cliente.id}`}>
                  <button className={styles.profileBtn}>
                    <FiFileText size={15} /> Perfil
                  </button>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Formulário Novo Cliente */}
      {mostrarFormulario && (
        <div className={styles.formWrapper}>
          <h2>
            <FiUserPlus /> Novo Cliente
          </h2>

          <ClienteForm
            onSubmit={adicionarCliente}
            onCancel={fecharFormulario}
          />
        </div>
      )}
    </div>
  );
};

export default Clientes;
