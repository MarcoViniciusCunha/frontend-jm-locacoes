import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";

export default function Cores({ action }) {
  const [cores, setCores] = useState([]);
  const [novaCor, setNovaCor] = useState("");
  const [editCorId, setEditCorId] = useState(null);
  const [editCorNome, setEditCorNome] = useState("");

  useEffect(() => {
    if (action !== "Cadastrar") {
      listaCores();
    }
  }, [action]);

  const listaCores = async () => {
    try {
      const res = await VeiculosService.listarCores();
      setCores(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao listar cores");
    }
  };

  const handleAddCor = async () => {
    try {
      await VeiculosService.addCor(novaCor);
      alert("Cor adicionada com sucesso!");
      setNovaCor("");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar cor.");
    }
  };

  const handleEditCor = async (id) => {
    try {
      await VeiculosService.editarCor(id, { nome: editCorNome });
      alert("Cor editada comsucesso!");
      setEditCorId(null);
      setEditCorNome("");
    } catch (err) {
      console.error(err);
      alert("Erro ao editar cor.");
    }
  };

  const handleExcluirCor = async (id) => {
    if (!window.confirm("Confirmar exclusão de cor?")) return;
    try {
      await VeiculosService.excluirCor(id);
      alert("Cor excluída com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir a cor.");
    }
  };

  if (action === "Cadastrar") {
    return (
      <form>
        <input
          type="text"
          placeholder="Nova cor"
          value={novaCor}
          onChange={(e) => setNovaCor(e.target.value)}
        />
        <button type="button" onClick={handleAddCor}>
          Salvar
        </button>
      </form>
    );
  }

  if (action === "Listar") {
    return (
      <ul>
        {cores.map((cor) => (
          <li key={cor.id}>{cor.nome}</li>
        ))}
      </ul>
    );
  }

  if (action === "Editar") {
    return (
      <ul>
        {cores.map((cor) => (
          <li key={cor.id}>
            {editCorId === cor.id ? (
              <>
                <input
                  type="text"
                  value={editCorNome}
                  onChange={(e) => setEditCorNome(e.target.value)}
                />
                <button onClick={() => handleEditCor(cor.id)}>Salvar</button>
                <button onClick={() => setEditCorId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {cor.nome}
                <button
                  onClick={() => {
                    setEditCorId(cor.id);
                    setEditCorNome(cor.nome);
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

  if (action === "Excluir") {
    return (
      <ul>
        {cores.map((cor) => (
          <li key={cor.id}>
            {cor.nome}
            <button onClick={() => handleExcluirCor(cor.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    );
  }

  return null;
}
