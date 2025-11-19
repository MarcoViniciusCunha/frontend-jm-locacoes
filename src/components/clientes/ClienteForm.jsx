import { useState, useEffect } from "react";
import styles from "./ClienteForm.module.css";

const ClienteForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  disabled = false,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    email: "",
    telefone: "",
    cep: "",
    numero: "",
    data_nasc: "",
    logradouro: "",
    localidade: "",
    ...initialData,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const atualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const limparEndereco = () => {
    setFormData((prev) => ({
      ...prev,
      logradouro: "",
      localidade: "",
    }));
  };

  const buscarEndereco = async (cepLimpo) => {
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        limparEndereco();
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro,
        localidade: data.localidade,
      }));
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    atualizarCampo(name, value);

    if (name === "cep") {
      const cepNumero = value.replace(/\D/g, "");

      if (cepNumero.length === 8) {
        buscarEndereco(cepNumero);
      } else {
        limparEndereco();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {[
        { name: "nome", placeholder: "Nome", required: true },
        { name: "cpf", placeholder: "CPF", required: true },
        { name: "cnh", placeholder: "CNH" },
        { name: "email", placeholder: "E-mail", type: "email" },
        { name: "telefone", placeholder: "Telefone" },
        { name: "cep", placeholder: "CEP" },
        { name: "numero", placeholder: "Número" },
      ].map((campo) => (
        <input
          key={campo.name}
          type={campo.type || "text"}
          name={campo.name}
          placeholder={campo.placeholder}
          required={campo.required}
          value={formData[campo.name]}
          onChange={handleChange}
          disabled={disabled}
        />
      ))}

      {/* Campos de endereço retornados do CEP */}
      <div className={styles.addressFields}>
        <input
          type="text"
          placeholder="Rua"
          value={formData.logradouro}
          disabled
        />
        <input
          type="text"
          placeholder="Cidade"
          value={formData.localidade}
          disabled
        />
      </div>

      {/* Data */}
      <input
        type="date"
        name="data_nasc"
        value={formData.data_nasc}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Botões */}
      {!disabled && (
        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>
            Salvar
          </button>

          {onCancel && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onCancel}
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default ClienteForm;
