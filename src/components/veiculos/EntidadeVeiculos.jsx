import { useEffect, useState } from "react";
import styles from "./EntidadeVeiculos.module.css";

export default function CrudEntidade({ action, service, label, fields }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({});
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
  const [selectOptions, setSelectOptions] = useState({});

  // Carrega lista
  const lista = async () => {
    try {
      const res = await service.lista();
      setItens(res.data);
    } catch {
      alert("Erro ao listar " + label);
    }
  };

  useEffect(() => {
    if (action === "Lista") lista();
  }, [action, service]);

  // Carrega selects dinâmicos
  useEffect(() => {
    const load = async () => {
      const opts = {};

      for (const f of fields) {
        if (f.type === "select" && f.fetch) {
          const res = await f.fetch();
          opts[f.key] = res.data;
        }
      }

      setSelectOptions(opts);
    };

    load();
  }, [fields]);

  const renderField = (data, setData, field) => {
    // select
    if (field.type === "select") {
      const options = field.options || selectOptions[field.key] || [];
      return (
        <select
          value={data[field.key] || ""}
          onChange={(e) =>
            setData({ ...data, [field.key]: Number(e.target.value) })
          }
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

    // date
    if (field.key === "validade") {
      return (
        <input
          type="date"
          value={data[field.key] || ""}
          onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
        />
      );
    }

    // default text
    return (
      <input
        type="text"
        placeholder={field.label}
        value={data[field.key] || ""}
        onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
      />
    );
  };

  return (
    <div className={styles.container}>
      {/* CADASTRAR */}
      {action === "Cadastrar" && (
        <form className={styles.form}>
          {fields.map((f) => renderField(novoItem, setNovoItem, f))}

          <button
            type="button"
            onClick={async () => {
              await service.add(novoItem);
              alert("Criado!");
              setNovoItem({});
              lista();
            }}
          >
            Salvar
          </button>
        </form>
      )}

      {/* LISTA */}
      {action === "Lista" && (
        <ul className={styles.lista}>
          {itens.map((item) => {
            const isEdit = editItemId === item.id;

            return (
              <li key={item.id} className={isEdit ? styles.editando : ""}>
                {isEdit ? (
                  <>
                    <div className={styles.itemInfo}>
                      {fields.map((f) =>
                        renderField(editItemData, setEditItemData, f)
                      )}
                    </div>

                    <div className={styles.itemActions}>
                      <button
                        onClick={async () => {
                          await service.editar(item.id, editItemData);
                          alert("Atualizado!");
                          setEditItemId(null);
                          lista();
                        }}
                      >
                        Salvar
                      </button>

                      <button
                        className={styles.cancelar}
                        onClick={() => setEditItemId(null)}
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
                        fields.map((f) => (
                          <span key={f.key}>
                            {f.key === "companyId"
                              ? item.company?.name
                              : item[f.key]}
                          </span>
                        ))
                      )}
                    </div>

                    <div className={styles.itemActions}>
                      <button
                        onClick={() => {
                          setEditItemId(item.id);
                          setEditItemData({
                            ...item,
                            companyId: item.company?.id,
                          });
                        }}
                      >
                        Editar
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={async () => {
                          await service.excluir(item.id);
                          lista();
                        }}
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
