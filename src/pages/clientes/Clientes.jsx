import { useEffect, useState } from "react";
import { ClientesService } from "../../services/ClientesService";
import { Link } from "react-router-dom";
import styles from "./Clientes.module.css";

const Clientes = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    listaItens();
  }, []);

  const listaItens = async () => {
    try {
      const res = await ClientesService.lista();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao listar clientes");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await ClientesService.getByName(name);
      setCustomers(res.data);
      setName("");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        alert(err.response.data.message || "Não existe cliente com esse nome.");
      } else {
        alert("Erro ao listar clientes");
      }

      setName("");
      listaItens();
    }
  };

  return (
    <div className={styles.container}>
      <form>
        <input
          type="text"
          placeholder="Digite o nome"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          Buscar
        </button>
      </form>
      <ul>
        <li className={styles.header}>
          <span className={styles.nome}>Clientes</span>
          <span className={styles.cpf}>CPF</span>
        </li>

        {customers.map((item) => (
          <li key={item.id}>
            <span className={styles.nome}>{item.nome}</span>
            <span className={styles.cpf}>{item.cpf}</span>
            <Link to={`/clientes/${item.id}`}>
              <button>Perfil</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
