import { useState, useEffect } from "react";
import styles from "./ClienteForm.module.css";
import { CepService } from "../../services/ClientesService";

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
    estado: "",
    ...initialData,
  });

  const [enderecoManual, setEnderecoManual] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const atualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const limparEndereco = () => {
    setFormData((prev) => ({
      ...prev,
      logradouro: "",
      localidade: "",
      estado: "",
    }));
  };

  const buscarEndereco = async (cepLimpo) => {
    try {
      const { data } = await CepService.buscar(cepLimpo);

      if (data.erro) {
        limparEndereco();
        setEnderecoManual(true);
        return;
      }

      setEnderecoManual(false);
      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro,
        localidade: data.localidade,
        estado: data.uf,
      }));
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      limparEndereco();
      setEnderecoManual(true);
    }
  };

  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, ""); // só números
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === "cpf") {
      novoValor = formatarCPF(value);
    }

    if (name === "cep") {
      const cepNumero = value.replace(/\D/g, "");
      novoValor = cepNumero;

      if (cepNumero.length === 8) {
        buscarEndereco(cepNumero);
      } else {
        limparEndereco();
      }
    }

    atualizarCampo(name, novoValor);
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

      {enderecoManual && (
        <p className={styles.alertManual}>
          CEP não encontrado. Preencha o endereço manualmente.
        </p>
      )}

      {/* Campos de endereço retornados do CEP */}
      <div className={styles.addressFields}>
        <input
          type="text"
          placeholder="Rua"
          name="logradouro"
          value={formData.logradouro}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
        <input
          type="text"
          placeholder="Cidade"
          name="localidade"
          value={formData.localidade}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
        <input
          type="text"
          placeholder="Estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
      </div>

      {/* Data */}
      <div className={styles.dateWrapper}>
        <label className={styles.dateLabel}>Data de nascimento</label>
        <input
          type="date"
          name="data_nasc"
          value={formData.data_nasc}
          onChange={handleChange}
          disabled={disabled}
          className={styles.dateInput}
        />
      </div>

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
