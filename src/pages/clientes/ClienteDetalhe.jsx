import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClientesService } from "../../services/ClientesService";

const ClienteDetalhe = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
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
      setEditing(false);
      alert("Cliente atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{customer.nome}</h1>
      <form>
        {Object.entries(customer).map(([key, value]) => (
          <div key={key}>
            <label>{key}</label>
            {key === "data_nasc" ? (
              <input
                type="date"
                name={key}
                value={value}
                disabled={!editing}
                onChange={handleChange}
              />
            ) : (
              <input
                type="text"
                name={key}
                value={value}
                disabled={!editing}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
      </form>

      {!editing ? (
        <button onClick={handleEditClick}>Editar</button>
      ) : (
        <button onClick={handleSave}>Salvar</button>
      )}
    </div>
  );
};

export default ClienteDetalhe;
