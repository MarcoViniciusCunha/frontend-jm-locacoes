import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MultasService } from "../../services/LocacoesService";
import styles from "./MultaDetalhe.module.css";
import { FaArrowLeft, FaSave, FaTrashAlt } from "react-icons/fa";

const MultaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [multa, setMulta] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    placa: "",
    cliente: "",
    dataMulta: "",
    valor: "",
    descricao: "",
  });

  // ---------------------------
  // BUSCAR MULTA POR ID
  // ---------------------------
  const carregarMulta = async () => {
    try {
      const { data } = await MultasService.buscarPorId(id);
      setMulta(data);

      setForm({
        placa: data.placa || "",
        cliente: data.cliente?.nome || "",
        dataMulta: data.dataMulta || "",
        valor: data.valor || "",
        descricao: data.descricao || "",
      });
    } catch (e) {
      console.log(e);
      alert("Erro ao carregar multa");
    }
  };

  useEffect(() => {
    carregarMulta();
  }, [id]);

  // ---------------------------
  // EDITAR MULTA
  // ---------------------------
  const salvarAlteracoes = async () => {
    try {
      await MultasService.editar(id, form);
      alert("Multa atualizada!");
      setEditando(false);
      carregarMulta();
    } catch (error) {
      console.log(error);
      alert("Erro ao atualizar multa");
    }
  };

  // ---------------------------
  // EXCLUIR MULTA
  // ---------------------------
  const excluirMulta = async () => {
    if (!window.confirm("Tem certeza que deseja excluir esta multa?")) return;

    try {
      await MultasService.excluir(id);
      alert("Multa excluída!");
      navigate("/multas");
    } catch (error) {
      console.log(error);
      alert("Erro ao excluir multa");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!multa) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <FaArrowLeft /> Voltar
      </button>

      <h2>Detalhes da Multa</h2>

      <div className={styles.form}>
        <label>
          Data da Multa:
          <input
            name="dataMulta"
            type="date"
            value={form.dataMulta}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label>
          Valor:
          <input
            name="valor"
            type="number"
            value={form.valor}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>

        <label>
          Descrição:
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            disabled={!editando}
          />
        </label>
      </div>

      <div className={styles.buttons}>
        {!editando ? (
          <button className={styles.saveBtn} onClick={() => setEditando(true)}>
            <FaSave /> Editar
          </button>
        ) : (
          <button className={styles.saveBtn} onClick={salvarAlteracoes}>
            <FaSave /> Salvar
          </button>
        )}

        <button className={styles.deleteBtn} onClick={excluirMulta}>
          <FaTrashAlt /> Excluir
        </button>
      </div>
    </div>
  );
};

export default MultaDetalhe;
