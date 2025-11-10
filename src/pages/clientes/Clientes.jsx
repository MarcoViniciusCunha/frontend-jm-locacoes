import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import styles from "./Clientes.module.css";

const Clientes = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    email: "",
    telefone: "",
    cep: "",
    numero: "",
    data_nasc: "",
  });

  useEffect(() => {
    listaItens();
  }, []);

  const listaItens = async () => {
    try {
      setLoading(true);
      const res = await ClientesService.lista();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao listar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!name.trim()) return listaItens();

    try {
      setLoading(true);
      const res = await ClientesService.getByName(name.trim());
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        alert(err.response.data.message || "Nenhum cliente encontrado.");
      } else {
        alert("Erro ao buscar cliente.");
      }
      listaItens();
    } finally {
      setName("");
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await ClientesService.add(newCustomer);
      alert("Cliente cadastrado com sucesso!");
      setShowForm(false);
      setNewCustomer({
        nome: "",
        cpf: "",
        cnh: "",
        email: "",
        telefone: "",
        cep: "",
        numero: "",
        data_nasc: "",
      });
      listaItens();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cliente.");
    }
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Topo */}
      <div className={styles.topBar}>
        {!showForm ? (
          <>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.icon} size={18} />
                <input
                  type="text"
                  placeholder="Digite o nome do cliente..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </form>

            <button
              className={styles.addButton}
              onClick={() => setShowForm(true)}
            >
              <IoMdAdd size={20} /> Novo Cliente
            </button>
          </>
        ) : (
          <button
            className={styles.backButton}
            onClick={() => setShowForm(false)}
          >
            <IoMdArrowRoundBack size={20} /> Voltar
          </button>
        )}
      </div>

      {/* 🔹 Lista */}
      {!showForm && (
        <ul>
          <li className={styles.header}>
            <span className={styles.nome}>Nome</span>
            <span className={styles.cpf}>CPF</span>
            <span className={styles.acoes}>Ações</span>
          </li>

          {customers.length === 0 ? (
            <p className={styles.empty}>Nenhum cliente encontrado.</p>
          ) : (
            customers.map((item) => (
              <li key={item.id}>
                <span className={styles.nome}>{item.nome}</span>
                <span className={styles.cpf}>{item.cpf}</span>
                <Link to={`/clientes/${item.id}`}>
                  <button className={styles.profileBtn}>Perfil</button>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}

      {/* 🔹 Formulário */}
      {showForm && (
        <div className={styles.formWrapper}>
          <h2>Novo Cliente</h2>
          <form onSubmit={handleAddCustomer} className={styles.formAdd}>
            <input
              type="text"
              placeholder="Nome"
              value={newCustomer.nome}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, nome: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="CPF"
              value={newCustomer.cpf}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, cpf: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="CNH"
              value={newCustomer.cnh}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, cnh: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="E-mail"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Telefone"
              value={newCustomer.telefone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, telefone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CEP"
              value={newCustomer.cep}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, cep: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Número"
              value={newCustomer.numero}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, numero: e.target.value })
              }
            />
            <input
              type="date"
              value={newCustomer.data_nasc}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, data_nasc: e.target.value })
              }
            />

            <div className={styles.modalActions}>
              <button type="submit">Salvar</button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Clientes;
