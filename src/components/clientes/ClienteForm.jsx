import { useState, useEffect } from "react";
import styles from "./ClienteForm.module.css";
import { CepService } from "../../services/ClientesService";
import MessageBox from "../erro/MensagemErro";

export default function ClienteForm({
  initialData = null,
  onSubmit,
  onCancel,
  disabled = false,
}) {
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");
  const [enderecoManual, setEnderecoManual] = useState(false);
  const [editados, setEditados] = useState({});

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
  });

  const maskCPF = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const maskTelefone = (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

  const limpar = (v) => v.replace(/\D/g, "");

  const buscarCep = async (cep) => {
    try {
      const { data } = await CepService.buscar(cep);

      if (data.erro) {
        setMensagem("CEP não encontrado. Preencha manualmente.");
        setTipoMensagem("error");
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
    } catch {
      setMensagem("Erro ao buscar CEP. Preencha manualmente.");
      setTipoMensagem("error");
      setEnderecoManual(true);
    }
  };

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      nome: initialData.nome || "",
      cpf: initialData.cpfMasked || maskCPF(initialData.cpf || ""),
      cnh: initialData.cnhMasked || "",
      email: initialData.email || "",
      telefone:
        initialData.telefoneMasked || maskTelefone(initialData.telefone || ""),
      cep: initialData.cep || "",
      numero: initialData.numero || "",
      data_nasc: initialData.data_nasc || "",
      logradouro: initialData.rua || "",
      localidade: initialData.cidade || "",
      estado: initialData.estado || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "cpf") v = maskCPF(value);
    if (name === "telefone") v = maskTelefone(value);
    if (["cep", "cnh", "numero"].includes(name)) v = limpar(value);

    if (name === "cep" && v.length === 8) buscarCep(v);

    setEditados((prev) => ({ ...prev, [name]: true }));

    setFormData((prev) => ({ ...prev, [name]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {};

    Object.keys(editados).forEach((campo) => {
      let valor = formData[campo];

      if (campo === "cpf") valor = limpar(valor);
      if (campo === "telefone") valor = limpar(valor);

      payload[campo] = valor;
    });

    onSubmit(payload);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* CAMPOS PRINCIPAIS */}
      {[
        { name: "nome", placeholder: "Nome" },
        { name: "cpf", placeholder: "CPF" },
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
          value={formData[campo.name]}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      ))}

      <MessageBox type={tipoMensagem} message={mensagem} />

      {/* ENDEREÇO */}
      <div className={styles.addressFields}>
        <input
          type="text"
          name="logradouro"
          placeholder="Rua"
          value={formData.logradouro}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
        <input
          type="text"
          name="localidade"
          placeholder="Cidade"
          value={formData.localidade}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
        <input
          type="text"
          name="estado"
          placeholder="UF"
          value={formData.estado}
          onChange={handleChange}
          disabled={!enderecoManual || disabled}
        />
      </div>

      {/* DATA NASC */}
      <div className={styles.dateWrapper}>
        <label>Data de Nascimento</label>
        <input
          type="date"
          name="data_nasc"
          value={formData.data_nasc}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* BOTÕES */}
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
}
