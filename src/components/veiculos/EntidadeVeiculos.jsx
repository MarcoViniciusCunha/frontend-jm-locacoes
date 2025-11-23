import { useEffect, useState } from "react";
import styles from "./EntidadeVeiculos.module.css";

export default function CrudEntidade({ action, service, label, fields }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [selectOptions, setSelectOptions] = useState({});

  const loadItems = async () => {
    try {
      const response = await service.lista();
      setItems(response.data);
    } catch {
      alert("Erro ao listar " + label);
    }
  };

  useEffect(() => {
    if (action === "Lista") loadItems();
  }, [action, service]);

  useEffect(() => {
    const loadSelects = async () => {
      const optionsMap = {};

      for (const field of fields) {
        if (field.type === "select" && field.fetch) {
          const response = await field.fetch();
          optionsMap[field.key] = response.data;
        }
      }

      setSelectOptions(optionsMap);
    };

    loadSelects();
  }, [fields]);

  const renderField = (state, setState, field) => {
    const updateField = (value) => setState({ ...state, [field.key]: value });

    if (field.type === "select") {
      const options = field.options || selectOptions[field.key] || [];

      return (
        <select
          value={state[field.key] || ""}
          onChange={(e) => updateField(Number(e.target.value))}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt[field.optionLabel || "name"]}
            </option>
          ))}
        </select>
      );
    }

    if (field.key === "validade") {
      return (
        <input
          type="date"
          value={state[field.key] || ""}
          onChange={(e) => updateField(e.target.value)}
        />
      );
    }

    return (
      <input
        type="text"
        placeholder={field.label}
        value={state[field.key] || ""}
        onChange={(e) => updateField(e.target.value)}
      />
    );
  };

  const handleCreate = async () => {
    await service.add(newItem);
    alert("Criado!");
    setNewItem({});
    loadItems();
  };

  const handleUpdate = async (id) => {
    await service.editar(id, editingData);
    alert("Atualizado!");
    setEditingId(null);
    loadItems();
  };

  const handleDelete = async (id) => {
    await service.excluir(id);
    loadItems();
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingData({
      ...item,
      companyId: item.company?.id,
    });
  };

  return (
    <div className={styles.container}>
      {/*CADASTRAR*/}
      {action === "Cadastrar" && (
        <form className={styles.form}>
          {fields.map((field) => renderField(newItem, setNewItem, field))}

          <button type="button" onClick={handleCreate}>
            Salvar
          </button>
        </form>
      )}

      {/*LISTAR / EDITAR / EXCLUIR*/}
      {action === "Lista" && (
        <ul className={styles.lista}>
          {items.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <li key={item.id} className={isEditing ? styles.editando : ""}>
                {/* EDITANDO */}
                {isEditing ? (
                  <>
                    <div className={styles.itemInfo}>
                      {fields.map((field) =>
                        renderField(editingData, setEditingData, field)
                      )}
                    </div>

                    <div className={styles.itemActions}>
                      <button onClick={() => handleUpdate(item.id)}>
                        Salvar
                      </button>
                      <button
                        className={styles.cancelar}
                        onClick={() => setEditingId(null)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.itemInfo}>
                      {label === "seguro" ? (
                        <>
                          <span>{item.company?.name}</span>
                          <span>
                            <strong>Validade:</strong>{" "}
                            {item.validade
                              ? new Date(item.validade).toLocaleDateString(
                                  "pt-BR"
                                )
                              : "—"}
                          </span>
                          <span>
                            <strong>Valor:</strong> {item.valor ?? "—"}
                          </span>
                        </>
                      ) : (
                        fields.map((field) => (
                          <span key={field.key}>
                            {field.key === "companyId"
                              ? item.company?.name
                              : item[field.key]}
                          </span>
                        ))
                      )}
                    </div>

                    {/* BOTÕES */}
                    <div className={styles.itemActions}>
                      <button onClick={() => startEditing(item)}>Editar</button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
