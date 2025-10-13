import { useEffect, useState } from "react";

export default function CrudEntidade({ action, service, label, fields }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [optionsData, setOptionsData] = useState({});

  useEffect(() => {
    if (action !== "Cadastrar") listaItens();
  }, [action, service]);

  useEffect(() => {
    fields.forEach(async (field) => {
      if (field.type === "select" && field.loadOptions) {
        try {
          const res = await field.loadOptions();
          setOptionsData((prev) => ({
            ...prev,
            [field.key]: res.data.map((opt) => ({
              value: opt[field.optionValue],
              label: opt[field.optionLabel],
            })),
          }));
        } catch (err) {
          console.error(`Erro ao carregar opções para ${field.label}:`, err);
        }
      }
    });
  }, [fields]);

  const listaItens = async () => {
    try {
      const res = await service.lista();
      setItens(res.data);
    } catch (err) {
      console.error(err);
      alert(`Erro ao listar ${label}`);
    }
  };

  const handleAdd = async () => {
    try {
      console.log(novoItem);
      await service.add(novoItem);
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
      await service.editar(id, editItemData);
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

  if (action === "Cadastrar") {
    return (
      <form>
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <select
                key={field.key}
                value={novoItem[field.key] || ""}
                onChange={(e) =>
                  setNovoItem({ ...novoItem, [field.key]: e.target.value })
                }
              >
                <option value="">Selecione {field.label}</option>
                {(optionsData[field.key] || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.label}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            />
          );
        })}
        <button type="button" onClick={handleAdd}>
          Salvar
        </button>
      </form>
    );
  }

  // 🔹 Listagem
  if (action === "Lista") {
    return (
      <ul>
        {itens.map((item) => (
          <li key={item.id}>
            {fields.map((f) => (
              <span key={f.key}>{item[f.key]} </span>
            ))}
          </li>
        ))}
      </ul>
    );
  }

  // 🔹 Edição
  if (action === "Editar") {
    return (
      <ul>
        {itens.map((item) => (
          <li key={item.id}>
            {editItemId === item.id ? (
              <>
                {fields.map((f) =>
                  f.type === "select" ? (
                    <select
                      key={f.key}
                      value={editItemData[f.key] || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          [f.key]: e.target.value,
                        })
                      }
                    >
                      <option value="">Selecione {f.label}</option>
                      {(optionsData[f.key] || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      key={f.key}
                      type={f.type || "text"}
                      value={editItemData[f.key] || ""}
                      onChange={(e) =>
                        setEditItemData({
                          ...editItemData,
                          [f.key]: e.target.value,
                        })
                      }
                    />
                  )
                )}
                <button onClick={() => handleEdit(item.id)}>Salvar</button>
                <button onClick={() => setEditItemId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {fields.map((f) => (
                  <span key={f.key}>{item[f.key]} </span>
                ))}
                <button
                  onClick={() => {
                    setEditItemId(item.id);
                    setEditItemData(
                      fields.reduce((acc, f) => {
                        acc[f.key] = item[f.key];
                        return acc;
                      }, {})
                    );
                  }}
                >
                  Editar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // 🔹 Exclusão
  if (action === "Excluir") {
    return (
      <ul>
        {itens.map((item) => (
          <li key={item.id}>
            {fields.map((f) => (
              <span key={f.key}>{item[f.key]} </span>
            ))}
            <button onClick={() => handleExcluir(item.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
