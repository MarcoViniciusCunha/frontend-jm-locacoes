import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientesService } from "../../services/ClientesService";
import styles from "./ClienteDetalhe.module.css";
import { FaArrowLeft } from "react-icons/fa";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  const camposEditaveis = [
    "nome",
    "cpf",
    "cnh",
    "email",
    "telefone",
    "cep",
    "data_nasc",
  ];

  const fetchCliente = async () => {
    try {
      const res = await ClientesService.getById(id);
      setCustomer(res.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await ClientesService.editar(id, customer);
      await fetchCliente();
      setEditing(false);
      alert("Cliente atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await ClientesService.excluir(id);
        alert("Cliente excluído com sucesso!");
        navigate("/clientes");
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir cliente: " + err.message);
      }
    }
  };

  const clickCancel = async () => {
    setEditing(false);
    await fetchCliente();
  };
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>{customer.nome}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {camposEditaveis.map((key) => (
          <div className={styles.formGroup} key={key}>
            <label>{key}</label>
            <input
              type={key === "data_nasc" ? "date" : "text"}
              name={key}
              value={customer[key]}
              disabled={!editing}
              onChange={handleChange}
            />
          </div>
        ))}
      </form>

      <div className={styles.buttonGroup}>
        {!editing ? (
          <>
            <button className={styles.backBtn} onClick={handleBack}>
              <FaArrowLeft style={{ marginRight: "6px" }} />
              Voltar
            </button>
            <button className={styles.editBtn} onClick={handleEditClick}>
              Editar
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Excluir
            </button>
          </>
        ) : (
          <>
            <button className={styles.backBtn} onClick={handleBack}>
              Voltar
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              Salvar
            </button>
            <button className={styles.cancelBtn} onClick={clickCancel}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteDetalhe;
