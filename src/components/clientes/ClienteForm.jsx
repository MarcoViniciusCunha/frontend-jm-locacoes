import { useState, useEffect } from "react";
import styles from "./ClienteForm.module.css";
import { CepService } from "../../services/ClientesService";
import MessageBox from "../erro/MensagemErro";

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
  });

  const [originalData, setOriginalData] = useState({});
  const [enderecoManual, setEnderecoManual] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  // Funções de formatação
  const formatarCPF = (valor) => {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  };

  const formatarTelefone = (valor) => {
    valor = valor.replace(/\D/g, "");
    if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor;
  };

  const camposNumericos = ["cpf", "cnh", "telefone", "cep", "numero"];

  // Função para buscar endereço
  const buscarEndereco = async (cepLimpo) => {
    try {
      const { data } = await CepService.buscar(cepLimpo);

      if (data.erro) {
        limparEndereco();
        setEnderecoManual(true);
        setMensagem(
          data?.error || "CEP não encontrado. Digite o endereço manualmente."
        );
        setTipoMensagem("error");
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
      setMensagem(
        err.response?.data?.error ||
          "Não foi possível encontrar esse CEP ou a API está fora do ar. Preencha os campos manualmente."
      );
      setTipoMensagem("error");
    }
  };

  const limparEndereco = () => {
    setFormData((prev) => ({
      ...prev,
      logradouro: "",
      localidade: "",
      estado: "",
    }));
  };

  // Atualiza campos do form
  const atualizarCampo = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  // Inicializa dados
  useEffect(() => {
    if (!initialData) return;

    const cleanedData = {
      cpf: (initialData.cpf || "").replace(/\D/g, ""),
      cnh: (initialData.cnh || "").replace(/\D/g, ""),
      telefone: (initialData.telefone || "").replace(/\D/g, ""),
      logradouro: initialData.rua || "",
      localidade: initialData.cidade || "",
      estado: initialData.estado || "",
      ...initialData,
    };

    setOriginalData(cleanedData);

    setFormData({
      ...initialData,
      cpf: initialData.cpfMasked || formatarCPF(initialData.cpf || ""),
      cnh:
        initialData.cnhMasked ||
        (initialData.cnh ? "******" + initialData.cnh.slice(6) : ""),
      telefone:
        initialData.telefoneMasked ||
        formatarTelefone(initialData.telefone || ""),
      logradouro: initialData.rua || "",
      localidade: initialData.cidade || "",
      estado: initialData.estado || "",
      data_nasc: initialData.data_nasc || "",
    });
  }, [initialData]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (camposNumericos.includes(name)) {
      novoValor = value.replace(/\D/g, "");
    }

    if (name === "cpf") novoValor = formatarCPF(novoValor);
    if (name === "telefone") novoValor = formatarTelefone(novoValor);

    if (name === "cep") {
      const cepLimpo = novoValor;
      if (cepLimpo.length === 8) buscarEndereco(cepLimpo);
      else limparEndereco();
    }

    atualizarCampo(name, novoValor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dadosAlterados = {};

    Object.keys(formData).forEach((key) => {
      let valorAtual = formData[key];

      // Para CPF, CNH e telefone, use o valor limpo
      if (["cpf", "cnh", "telefone"].includes(key)) {
        valorAtual = valorAtual.replace(/\D/g, "");
      }

      if (
        ["cpf", "cnh", "telefone"].includes(key) &&
        valorAtual === (formData[key] || "").replace(/\D/g, "")
      ) {
        valorAtual = originalData[key];
      }

      if (valorAtual !== (originalData[key] ?? "")) {
        dadosAlterados[key] = valorAtual;
      }
    });

    onSubmit(dadosAlterados);
  };

  const handleCancel = () => {
    setFormData({
      ...initialData,
      cpf: initialData.cpfMasked || formatarCPF(initialData.cpf || ""),
      cnh:
        initialData.cnhMasked ||
        (initialData.cnh ? "******" + initialData.cnh.slice(6) : ""),
      telefone:
        initialData.telefoneMasked ||
        formatarTelefone(initialData.telefone || ""),
      logradouro: initialData.rua || "",
      localidade: initialData.cidade || "",
      estado: initialData.estado || "",
      data_nasc: initialData.data_nasc || "",
    });

    setEnderecoManual(false);
    setMensagem("");
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {[
        { name: "nome", placeholder: "Nome" },
        { name: "cpf", placeholder: "CPF", required: true },
        { name: "cnh", placeholder: "CNH", required: true },
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

      <MessageBox type={tipoMensagem} message={mensagem} />

      {/* Campos de endereço */}
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

      {/* Data de nascimento */}
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
              onClick={handleCancel}
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
