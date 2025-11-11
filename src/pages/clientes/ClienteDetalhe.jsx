import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClientesService } from "../../services/ClientesService";
import ClienteForm from "../../components/clientes/ClienteForm";
import styles from "./ClienteDetalhe.module.css";
import { FaArrowLeft } from "react-icons/fa";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

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

  const handleSave = async (data) => {
    try {
      await ClientesService.editar(id, data);
      await fetchCliente();
      setEditing(false);
      alert("Cliente atualizado com sucesso!");
    } catch (err) {
      console.error(err);
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>{customer.nome}</h1>

      <ClienteForm
        initialData={customer}
        onSubmit={handleSave}
        onCancel={() => setEditing(false)}
        disabled={!editing}
      />

      <div className={styles.buttonGroup}>
        {!editing ? (
          <>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <FaArrowLeft style={{ marginRight: "6px" }} />
              Voltar
            </button>
            <button className={styles.editBtn} onClick={() => setEditing(true)}>
              Editar
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Excluir
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.cancelBtn}
              onClick={() => setEditing(false)}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteDetalhe;
