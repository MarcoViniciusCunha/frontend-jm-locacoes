import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import styles from "./ComponentVeiculos.module.css";

export default function ComponentVeiculos({ action, service, label }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({});
  const [filtros, setFiltros] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);

  const anos = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);
  const statusOptions = ["Disponível", "Alugado", "Manutenção"];
  const statusMap = {
    Disponível: "DISPONIVEL",
    Alugado: "ALUGADO",
    Manutenção: "MANUTENCAO",
  };

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

        if (action === "Lista") await listarVeiculos();
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar dados iniciais");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [action]);

  // Função de listagem padrão (sem filtros)
  const listarVeiculos = async () => {
    try {
      const res = await service.lista();
      setItens(res.data || []);
    } catch (err) {
      console.error(err);
      alert(`Erro ao listar ${label}`);
    }
  };

  // Função de busca com filtros
  const buscarVeiculos = async () => {
    try {
      const params = {};

      if (filtros.placa) params.placa = filtros.placa;
      if (filtros.idCategoria) params.categoria = filtros.idCategoria;
      if (filtros.idMarca) params.brand = filtros.idMarca;
      if (filtros.idModelo) params.model = filtros.idModelo;
      if (filtros.idCor) params.color = filtros.idCor;
      if (filtros.status) params.status = statusMap[filtros.status];
      if (filtros.ano) params.ano = filtros.ano;

      console.log("🔍 Enviando params:", params);

      const res = await VeiculosService.veiculos.search(params);
      setItens(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar veículos.");
    }
  };

  const buscarModelosPorMarca = async (idMarca) => {
    try {
      if (!idMarca) {
        // Se o usuário desmarcar, volta a listar todos os modelos
        const res = await VeiculosService.modelos.lista();
        setModelos(res.data || []);
        return;
      }

      const res = await VeiculosService.modelos.buscarPorMarca(idMarca);
      setModelos(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar modelos da marca selecionada.");
    }
  };

  // Adiciona novo veículo
  const handleAdd = async () => {
    try {
      const payload = {
        ...novoItem,
        valorDiario: parseFloat(novoItem.valorDiario) || 0,
        status: statusMap[novoItem.status] || novoItem.status,
      };
      await service.add(payload);
      alert("Cadastro realizado com sucesso!");
      setNovoItem({});
      listarVeiculos();
    } catch (err) {
      console.error(err);
      alert(`Erro ao adicionar ${label}.`);
    }
  };

  const getLabel = (opt) => {
    if (!opt) return "";

    if (opt.company?.name && opt.validade) {
      return `${opt.company.name} - válido até ${opt.validade}`;
    }

    return (
      opt.nome ||
      opt.company?.name ||
      opt.descricao ||
      opt.empresa ||
      String(opt)
    );
  };

  const limparFiltros = async () => {
    setFiltros({});
    // Resetar modelos ao padrão (todos)
    const modelosRes = await VeiculosService.modelos.lista();
    setModelos(modelosRes.data || []);

    // Opcional: já lista tudo sem filtros
    listarVeiculos();
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      {/* CADASTRAR */}
      {action === "Cadastrar" && (
        <form>
          {[
            { key: "placa", label: "Placa" },
            {
              key: "idMarca",
              label: "Marca",
              type: "select",
              options: marcas,
              onChange: async (e) => {
                const idMarca = e.target.value;
                setNovoItem({ ...novoItem, idMarca, idModelo: "" });
                await buscarModelosPorMarca(idMarca); // 🔥 busca modelos da marca escolhida
              },
            },
            {
              key: "idModelo",
              label: "Modelo",
              type: "select",
              options: modelos,
            },
            { key: "ano", label: "Ano", type: "select", options: anos },
            { key: "idCor", label: "Cor", type: "select", options: cores },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: statusOptions,
            },
            { key: "descricao", label: "Descrição" },
            {
              key: "idCategoria",
              label: "Categoria",
              type: "select",
              options: categorias,
            },
            {
              key: "idSeguro",
              label: "Seguro",
              type: "select",
              options: seguros,
            },
            { key: "valorDiario", label: "Valor Diário (R$)", type: "number" },
          ].map((field) =>
            field.type === "select" ? (
              <select
                key={field.key}
                value={novoItem[field.key] || ""}
                onChange={
                  field.onChange
                    ? field.onChange
                    : (e) =>
                        setNovoItem({
                          ...novoItem,
                          [field.key]: e.target.value,
                        })
                }
              >
                <option value="">Selecione {field.label}</option>
                {field.options?.map((opt) =>
                  typeof opt === "object" ? (
                    <option key={opt.id} value={opt.id}>
                      {getLabel(opt)}
                    </option>
                  ) : (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
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
                type={field.type || "text"}
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
      )}

      {/* LISTAR / BUSCAR */}
      {action === "Lista" && (
        <>
          <div className={styles.filtros}>
            <input
              type="text"
              placeholder="Placa"
              value={filtros.placa || ""}
              onChange={(e) =>
                setFiltros({ ...filtros, placa: e.target.value })
              }
            />

            <select
              value={filtros.idMarca || ""}
              onChange={async (e) => {
                const idMarca = e.target.value;
                setFiltros({ ...filtros, idMarca, idModelo: "" });
                await buscarModelosPorMarca(idMarca);
              }}
            >
              <option value="">Marca</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>

            <select
              value={filtros.idModelo || ""}
              onChange={(e) =>
                setFiltros({ ...filtros, idModelo: e.target.value })
              }
            >
              <option value="">Modelo</option>
              {modelos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>

            <select
              value={filtros.idCor || ""}
              onChange={(e) =>
                setFiltros({ ...filtros, idCor: e.target.value })
              }
            >
              <option value="">Cor</option>
              {cores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select
              value={filtros.status || ""}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value })
              }
            >
              <option value="">Status</option>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={filtros.ano || ""}
              onChange={(e) => setFiltros({ ...filtros, ano: e.target.value })}
            >
              <option value="">Ano</option>
              {anos.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <button className={styles.btnBuscar} onClick={buscarVeiculos}>
              <FaSearch className={styles.iconBuscar} /> Buscar
            </button>
            <button
              className={styles.btnLimpar}
              onClick={limparFiltros}
              type="button"
            >
              Limpar
            </button>
          </div>

          <ul className={styles.lista}>
            {itens.length === 0 ? (
              <p>Nenhum veículo encontrado.</p>
            ) : (
              itens.map((item) => (
                <li key={item.placa}>
                  <span>{item.placa}</span>
                  <span>{item.brand?.nome}</span>
                  <span>{item.model?.nome}</span>
                  <span>{item.ano}</span>
                  <span>{item.color?.nome}</span>
                  <span>{item.status}</span>
                  <Link to={`/veiculos/${item.placa}`}>
                    <button>Detalhes</button>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
