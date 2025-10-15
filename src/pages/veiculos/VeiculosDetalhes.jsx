import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  anos,
  statusMap,
  VeiculosService,
} from "../../services/VeiculosService";
import styles from "../clientes/ClienteDetalhe.module.css";

const VeiculosDetalhes = () => {
  const { placa } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});

  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);

  const statusOptions = ["Disponível", "Alugado", "Manutenção"];
  const campos = [
    { label: "Placa", key: "placa", type: "text" },
    { label: "Marca", key: "brand.id", type: "select", options: marcas },
    { label: "Modelo", key: "model.id", type: "select", options: modelos },
    { label: "Ano", key: "ano", type: "select", options: anos },
    { label: "Cor", key: "color.id", type: "select", options: cores },
    {
      label: "Categoria",
      key: "category.id",
      type: "select",
      options: categorias,
    },
    { label: "Seguro", key: "insurance.id", type: "select", options: seguros },
    { label: "Status", key: "status", type: "select", options: statusOptions },
    { label: "Descrição", key: "descricao", type: "textarea" },
  ];

  const fetchVehicle = async () => {
    try {
      const [vehicleRes, marcasRes, coresRes, categoriasRes, segurosRes] =
        await Promise.all([
          VeiculosService.veiculos.individual(placa),
          VeiculosService.marcas.lista(),
          VeiculosService.cores.lista(),
          VeiculosService.categorias.lista(),
          VeiculosService.seguros.lista(),
        ]);

      setVehicle(vehicleRes.data);
      setMarcas(marcasRes.data || []);
      setCores(coresRes.data || []);
      setCategorias(categoriasRes.data || []);
      setSeguros(segurosRes.data || []);
      setEditItemData({
        placa: vehicleRes.data.placa,
        "brand.id": vehicleRes.data.brand?.id || "",
        "model.id": vehicleRes.data.model?.id || "",
        ano: vehicleRes.data.ano || "",
        "color.id": vehicleRes.data.color?.id || "",
        "category.id": vehicleRes.data.category?.id || "",
        "insurance.id": vehicleRes.data.insurance?.id || "",
        status: vehicleRes.data.status || "",
        descricao: vehicleRes.data.descricao || "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os modelos quando a marca mudar
  useEffect(() => {
    if (!editItemData["brand.id"]) return;

    const fetchModelos = async () => {
      try {
        const res = await VeiculosService.marcas.listaModelosPorMarca(
          editItemData["brand.id"]
        );
        setModelos(res.data || []);
        setEditItemData((prev) => ({ ...prev, "model.id": "" }));
      } catch (err) {
        console.error(err);
        setModelos([]);
      }
    };

    fetchModelos();
  }, [editItemData["brand.id"]]);

  useEffect(() => {
    fetchVehicle();
  }, [placa]);

  const handleEdit = async (id) => {
    try {
      const payload = {
        placa: editItemData.placa,
        idMarca: editItemData["brand.id"] || null,
        idModelo: editItemData["model.id"] || null,
        idCor: editItemData["color.id"] || null,
        idCategoria: editItemData["category.id"] || null,
        idSeguro: editItemData["insurance.id"] || null,
        ano: editItemData.ano,
        status: statusMap[editItemData.status] || editItemData.status,
        descricao: editItemData.descricao,
      };
      await VeiculosService.veiculos.editar(id, payload);
      alert("Edição concluída com sucesso!");
      setEditItemId(null);
      fetchVehicle();
    } catch (err) {
      console.error(err);
      alert("Erro ao editar veículo.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Confirmar exclusão do veículo?")) return;
    try {
      await VeiculosService.veiculos.excluir(id);
      alert("Exclusão bem-sucedida!");
      navigate("/veiculos");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir veículo.");
    }
  };

  const getValue = (obj, path) => {
    if (!obj) return "";
    return path.split(".").reduce((acc, part) => acc?.[part], obj) || "";
  };

  const getDisplayValue = (vehicle, campo) => {
    const value = getValue(vehicle, campo.key);
    // Se for select de objetos, pegar o nome correspondente
    if (campo.type === "select" && campo.options?.length) {
      const found = campo.options.find((opt) =>
        typeof opt === "object" ? opt.id === value : opt === value
      );
      if (found) return found.nome ?? found.empresa ?? found;
    }
    return value;
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Detalhes do Veículo</h1>
      {campos.map((campo) => (
        <div key={campo.key} className={styles.formGroup}>
          <label>{campo.label}:</label>
          {editItemId === vehicle.placa ? (
            campo.type === "textarea" ? (
              <textarea
                value={editItemData[campo.key] || ""}
                onChange={(e) =>
                  setEditItemData({
                    ...editItemData,
                    [campo.key]: e.target.value,
                  })
                }
              />
            ) : campo.type === "select" ? (
              <select
                value={editItemData[campo.key] || ""}
                onChange={(e) =>
                  setEditItemData({
                    ...editItemData,
                    [campo.key]: e.target.value,
                  })
                }
              >
                <option value="">Selecione</option>
                {campo.options?.map((opt) =>
                  opt ? (
                    typeof opt === "object" ? (
                      <option key={opt.id} value={opt.id}>
                        {opt.nome ?? opt.empresa}
                      </option>
                    ) : (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    )
                  ) : null
                )}
              </select>
            ) : (
              <input
                type="text"
                value={editItemData[campo.key] || ""}
                onChange={(e) =>
                  setEditItemData({
                    ...editItemData,
                    [campo.key]: e.target.value,
                  })
                }
              />
            )
          ) : (
            getDisplayValue(vehicle, campo)
          )}
        </div>
      ))}

      <div className={styles.buttonGroup}>
        {editItemId === vehicle.placa ? (
          <>
            <button
              className={styles.saveBtn}
              onClick={() => handleEdit(vehicle.placa)}
            >
              Salvar
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setEditItemId(null)}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.editBtn}
              onClick={() => setEditItemId(vehicle.placa)}
            >
              Editar
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => handleExcluir(vehicle.placa)}
            >
              Excluir
            </button>
            <button onClick={() => navigate(-1)}>Voltar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default VeiculosDetalhes;
