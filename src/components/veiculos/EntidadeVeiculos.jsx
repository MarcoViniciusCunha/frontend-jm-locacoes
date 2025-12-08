import { useEffect, useState } from "react";
import styles from "./EntidadeVeiculos.module.css";
import MessageBox from "../erro/MensagemErro";

export default function CrudEntidade({ action, service, label, fields }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [selectOptions, setSelectOptions] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const loadItems = async () => {
    try {
      const response = await service.lista();
      setItems(response.data);
    } catch (err) {
      setMensagem(err.response?.data?.error || "Erro ao listar " + label);
      setTipoMensagem("error");
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
          onChange={(e) => {
            const val = e.target.value;
            updateField(val === "" ? null : Number(val));
          }}
        >
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt[field.optionLabel] ??
                opt.name ??
                opt.nome ??
                opt.label ??
                "—"}
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
    try {
      await service.add(newItem);
      setMensagem(`${label} criado com sucesso!`);
      setTipoMensagem("success");

      setNewItem({});
      loadItems();
    } catch (err) {
      setMensagem(err.response?.data?.error || `Erro ao criar ${label}`);
      setTipoMensagem("error");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await service.editar(id, editingData);
      setMensagem(`${label} atualizado com sucesso!`);
      setTipoMensagem("success");

      setEditingId(null);
      loadItems();
    } catch (err) {
      setMensagem(err.response?.data?.error || `Erro ao atualizar ${label}`);
      setTipoMensagem("error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await service.excluir(id);
      setMensagem(`${label} excluído com sucesso!`);
      setTipoMensagem("success");

      loadItems();
    } catch (err) {
      setMensagem(err.response?.data?.error || `Erro ao excluir ${label}`);
      setTipoMensagem("error");
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingData({
      ...item,
      companyId: item.company?.id,
    });
  };

  return (
    <>
      <MessageBox type={tipoMensagem} message={mensagem} />
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
                        <button onClick={() => startEditing(item)}>
                          Editar
                        </button>

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
    </>
  );
}
