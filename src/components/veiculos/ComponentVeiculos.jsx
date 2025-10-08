import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";

export default function ComponentVeiculos({ action, service, label }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);

  const anos = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);
  const statusOptions = ["Disponível", "Alugado", "Manutenção"];
  const statusMap = {
    Disponível: "DISPONIVEL",
    Alugado: "ALUGADO",
    Manutenção: "MANUTENCAO",
  };

  // Carrega opções e lista inicial
  useEffect(() => {
    const init = async () => {
      try {
        const [marcasRes, coresRes, categoriasRes, segurosRes, modelosRes] =
          await Promise.all([
            VeiculosService.marcas.lista(),
            VeiculosService.cores.lista(),
            VeiculosService.categorias.lista(),
            VeiculosService.seguros.lista(),
            VeiculosService.modelos.lista(),
          ]);

        setMarcas(marcasRes.data || []);
        setCores(coresRes.data || []);
        setCategorias(categoriasRes.data || []);
        setSeguros(segurosRes.data || []);
        setModelos(modelosRes.data || []);

        if (action !== "Cadastrar") await listaItens();
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [action]);

  const fields = [
    { key: "placa", label: "Placa" },
    { key: "idMarca", label: "Marca", type: "select", options: marcas },
    { key: "idModelo", label: "Modelo", type: "select", options: modelos },
    { key: "ano", label: "Ano", type: "select", options: anos },
    { key: "idCor", label: "Cor", type: "select", options: cores },
    { key: "status", label: "Status", type: "select", options: statusOptions },
    { key: "descricao", label: "Descrição" },
    {
      key: "idCategoria",
      label: "Categoria",
      type: "select",
      options: categorias,
    },
    { key: "idSeguro", label: "Seguro", type: "select", options: seguros },
  ];

  const editFields = fields;

  const listFields = ["placa", "brand", "model", "ano", "color", "status"];

  const getDisplayValue = (key, item) => {
    switch (key) {
      case "brand":
        return item.brand?.nome || "";
      case "model":
        return item.model?.nome || "";
      case "color":
        return item.color?.nome || "";
      case "category":
        return item.category?.nome || "";
      case "insurance":
        return item.insurance?.empresa || "";
      case "status":
        return item.status || "";
      default:
        return item[key] || "";
    }
  };

  const listaItens = async () => {
    try {
      const res = await service.lista();
      setItens(res.data || []);
    } catch (err) {
      console.error(err);
      alert(`Erro ao listar ${label}`);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...novoItem,
        status: statusMap[novoItem.status] || novoItem.status,
      };
      await service.add(payload);
      alert("Cadastro realizado com sucesso!");
      setNovoItem({});
      listaItens();
    } catch (err) {
      console.error(err);
      alert(`Erro ao adicionar ${label}.`);
    }
  };

  const handleEdit = async (id) => {
    try {
      const payload = {
        ...editItemData,
        status: statusMap[editItemData.status] || editItemData.status,
      };
      await service.editar(id, payload);
      alert("Edição concluída com sucesso!");
      setEditItemId(null);
      setEditItemData({});
      listaItens();
    } catch (err) {
      console.error(err);
      alert(`Erro ao editar ${label}.`);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm(`Confirmar exclusão de ${label}?`)) return;
    try {
      await service.excluir(id);
      alert("Exclusão bem-sucedida!");
      listaItens();
    } catch (err) {
      console.error(err);
      alert(`Erro ao excluir ${label}.`);
    }
  };

  if (loading) return <p>Carregando...</p>;

  // Render de cada ação
  if (action === "Cadastrar") {
    return (
      <form>
        {fields.map((field) =>
          field.type === "select" ? (
            <select
              key={field.key}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            >
              <option value="">Selecione {field.label}</option>
              {field.options?.map((opt) =>
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
          ) : field.key === "descricao" ? (
            <textarea
              key={field.key}
              placeholder={field.label}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            />
          ) : (
            <input
              key={field.key}
              type="text"
              placeholder={field.label}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            />
          )
        )}
        <button type="button" onClick={handleAdd}>
          Salvar
        </button>
      </form>
    );
  }

  if (action === "Lista" || action === "Editar" || action === "Excluir") {
    return (
      <ul>
        {itens?.map((item) => (
          <li key={item.placa || item.id}>
            {action === "Editar" && editItemId === item.placa ? (
              <>
                {editFields.map((field) =>
                  field.type === "select" ? (
                    <select
                      key={field.key}
                      value={editItemData[field.key] || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          [field.key]: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione {field.label}</option>
                      {field.options?.map((opt) =>
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
                  ) : field.key === "descricao" ? (
                    <textarea
                      key={field.key}
                      placeholder={field.label}
                      value={editItemData[field.key] || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <input
                      key={field.key}
                      type="text"
                      placeholder={field.label}
                      value={editItemData[field.key] || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  )
                )}
                <button onClick={() => handleEdit(item.placa)}>Salvar</button>
                <button onClick={() => setEditItemId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {listFields.map((key) => (
                  <span key={key}>{getDisplayValue(key, item)} </span>
                ))}
                {action === "Editar" && (
                  <button
                    onClick={() => {
                      setEditItemId(item.placa);
                      setEditItemData(
                        editFields.reduce(
                          (acc, f) => ({ ...acc, [f.key]: item[f.key] }),
                          {}
                        )
                      );
                    }}
                  >
                    Editar
                  </button>
                )}
                {action === "Excluir" && (
                  <button onClick={() => handleExcluir(item.placa)}>
                    Excluir
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
