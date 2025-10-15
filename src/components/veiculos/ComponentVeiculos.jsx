import { useEffect, useMemo, useState } from "react";
import {
  anos,
  camposVeiculos,
  statusMap,
  VeiculosService,
} from "../../services/VeiculosService";
import { Link } from "react-router-dom";

export default function ComponentVeiculos({ action, service, label }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [filtros, setFiltros] = useState({
    placa: "",
    categoria: "",
    brand: "",
    color: "",
    ano: "",
    status: "",
  });

  const fields = useMemo(
    () => camposVeiculos(marcas, modelos, cores, categorias, seguros),
    [marcas, modelos, cores, categorias, seguros]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const [marcasRes, coresRes, categoriasRes, segurosRes, modelosRes] =
          await Promise.all([
            VeiculosService.marcas.lista(),
            VeiculosService.cores.lista(),
            VeiculosService.categorias.lista(),
            VeiculosService.seguros.lista(),
            VeiculosService.modelos.lista(),
          ]);

        setMarcas(marcasRes.data || []);
        setCores(coresRes.data || []);
        setCategorias(categoriasRes.data || []);
        setSeguros(segurosRes.data || []);
        setModelos(modelosRes.data || []);

        if (action !== "Cadastrar") await listaItens();
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [action]);

  // Atualiza modelos ao mudar marca (cadastro)
  useEffect(() => {
    const fetchModelos = async () => {
      if (!novoItem.idMarca) {
        setModelos([]);
        return;
      }
      try {
        const res = await VeiculosService.marcas.listaModelosPorMarca(
          novoItem.idMarca
        );
        setModelos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar modelos:", err);
        setModelos([]);
      }
    };
    fetchModelos();
    setNovoItem((prev) => ({ ...prev, idModelo: "" }));
  }, [novoItem.idMarca]);

  const listFields = ["placa", "brand", "model", "ano", "color", "status"];

  const getDisplayValue = (key, item) => {
    switch (key) {
      case "brand":
        return item.brand?.nome || "";
      case "model":
        return item.model?.nome || "";
      case "color":
        return item.color?.nome || "";
      case "category":
        return item.category?.nome || "";
      case "insurance":
        return item.insurance?.empresa || "";
      case "status":
        return item.status || "";
      default:
        return item[key] || "";
    }
  };

  const listaItens = async () => {
    try {
      const res = await service.lista();
      setItens(res.data || []);
    } catch (err) {
      console.error(err);
      alert(`Erro ao listar ${label}`);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...novoItem,
        status: statusMap[novoItem.status] || novoItem.status,
      };
      await service.add(payload);
      alert("Cadastro realizado com sucesso!");
      setNovoItem({});
      listaItens();
    } catch (err) {
      console.error(err);
      alert(`Erro ao adicionar ${label}.`);
    }
  };

  const handleSearch = async () => {
    try {
      setMessage(""); // limpa mensagem anterior
      const payload = {};
      if (filtros.placa) payload.placa = filtros.placa;
      if (filtros.categoria) payload.categoria = filtros.categoria;
      if (filtros.brand) payload.brand = filtros.brand;
      if (filtros.color) payload.color = filtros.color;
      if (filtros.ano) payload.ano = Number(filtros.ano);
      if (filtros.status) payload.status = filtros.status.toUpperCase();

      const res = await service.search(payload);
      setItens(res.data || []);
      if (res.data?.length === 0) {
        setMessage("Nenhum veículo encontrado."); // quando a lista estiver vazia
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setItens([]);
        setMessage(err.response.data?.message || "Nenhum veículo encontrado.");
      } else {
        console.error(err);
        alert("Erro ao pesquisar veículos");
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  if (action === "Cadastrar") {
    return (
      <form>
        {fields.map((field) =>
          field.type === "select" ? (
            <select
              key={field.key}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            >
              <option value="">Selecione {field.label}</option>
              {field.options?.map((opt) =>
                opt ? (
                  typeof opt === "object" ? (
                    <option key={opt.id} value={opt.id}>
                      {opt.nome ?? opt.empresa}
                    </option>
                  ) : (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                ) : null
              )}
            </select>
          ) : field.key === "descricao" ? (
            <textarea
              key={field.key}
              placeholder={field.label}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            />
          ) : (
            <input
              key={field.key}
              type="text"
              placeholder={field.label}
              value={novoItem[field.key] || ""}
              onChange={(e) =>
                setNovoItem({ ...novoItem, [field.key]: e.target.value })
              }
            />
          )
        )}
        <button type="button" onClick={handleAdd}>
          Salvar
        </button>
      </form>
    );
  }

  if (action === "Lista") {
    return (
      <div>
        <div>
          <input
            type="text"
            placeholder="Placa"
            value={filtros.placa}
            onChange={(e) => setFiltros({ ...filtros, placa: e.target.value })}
          />
          <select
            value={filtros.brand}
            onChange={(e) => setFiltros({ ...filtros, brand: e.target.value })}
          >
            <option value="">Marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          <select
            value={filtros.color}
            onChange={(e) => setFiltros({ ...filtros, color: e.target.value })}
          >
            <option value="">Cor</option>
            {cores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            value={filtros.categoria}
            onChange={(e) =>
              setFiltros({ ...filtros, categoria: e.target.value })
            }
          >
            <option value="">Categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <select
            value={filtros.status}
            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
          >
            <option value="">Status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="ALUGADO">Alugado</option>
            <option value="MANUTENCAO">Manutenção</option>
          </select>
          <select
            value={filtros.ano}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                ano: e.target.value ? Number(e.target.value) : "",
              })
            }
          >
            <option value="">Ano</option>
            {anos.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
          <button type="button" onClick={handleSearch}>
            Pesquisar
          </button>
        </div>

        {itens?.length === 0 ? (
          <p>{message}</p>
        ) : (
          <ul>
            {itens.map((item) => (
              <li key={item.placa || item.id}>
                {listFields.map((key) => (
                  <span key={key}>{getDisplayValue(key, item)} </span>
                ))}
                <Link to={`/veiculos/${item.placa}`}>
                  <button>Detalhes</button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
}
