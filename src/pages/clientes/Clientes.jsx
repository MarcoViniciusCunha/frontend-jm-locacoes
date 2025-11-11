import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import ClienteForm from "../../components/clientes/ClienteForm";
import styles from "./Clientes.module.css";

const Clientes = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
      alert("Erro ao buscar cliente.");
      listaItens();
    } finally {
      setName("");
      setLoading(false);
    }
  };

  const handleAddCustomer = async (data) => {
    try {
      await ClientesService.add(data);
      alert("Cliente cadastrado com sucesso!");
      setShowForm(false);
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

      {/* 🔹 Formulário Novo Cliente */}
      {showForm && (
        <div className={styles.formWrapper}>
          <h2>Novo Cliente</h2>
          <ClienteForm
            onSubmit={handleAddCustomer}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Clientes;
