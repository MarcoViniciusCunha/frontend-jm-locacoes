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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericCep = value.replace(/\D/g, "");

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "cep") {
      if (numericCep.length === 8) {
        buscarEndereco(numericCep);
      } else if (numericCep.length < 8) {
        // Limpa logradouro e localidade quando o CEP é apagado ou incompleto
        setFormData((prev) => ({
          ...prev,
          logradouro: "",
          localidade: "",
        }));
      }
    }
  };

  const buscarEndereco = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro,
          localidade: data.localidade,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          logradouro: "",
          localidade: "",
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        disabled={disabled}
        required
      />
      <input
        type="text"
        name="cpf"
        placeholder="CPF"
        value={formData.cpf}
        onChange={handleChange}
        disabled={disabled}
        required
      />
      <input
        type="text"
        name="cnh"
        placeholder="CNH"
        value={formData.cnh}
        onChange={handleChange}
        disabled={disabled}
      />
      <input
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleChange}
        disabled={disabled}
      />
      <input
        type="text"
        name="telefone"
        placeholder="Telefone"
        value={formData.telefone}
        onChange={handleChange}
        disabled={disabled}
      />
      <input
        type="text"
        name="cep"
        placeholder="CEP"
        value={formData.cep}
        onChange={handleChange}
        disabled={disabled}
      />
      <input
        type="text"
        name="numero"
        placeholder="Número"
        value={formData.numero}
        onChange={handleChange}
        disabled={disabled}
      />

      <div className={styles.addressFields}>
        <input
          type="text"
          placeholder="Rua"
          value={formData.logradouro || ""}
          disabled
        />
        <input
          type="text"
          placeholder="Cidade"
          value={formData.localidade || ""}
          disabled
        />
      </div>

      <input
        type="date"
        name="data_nasc"
        value={formData.data_nasc}
        onChange={handleChange}
        disabled={disabled}
      />

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
