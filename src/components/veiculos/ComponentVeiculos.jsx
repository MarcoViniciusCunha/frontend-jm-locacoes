import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import styles from "./ComponentVeiculos.module.css";
import MessageBox from "../erro/MensagemErro";
import useApiError from "../../hooks/UseApiError";

export default function ComponentVeiculos({ action, service, label }) {
  const [lista, setLista] = useState([]);
  const [novoVeiculo, setNovoVeiculo] = useState({});
  const [filtros, setFiltros] = useState({});
  const [marcas, setMarcas] = useState([]);
  const [cores, setCores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const { mensagem, tipoMensagem, handleApiError, showSuccess, clearError } =
    useApiError();

  const anos = Array.from({ length: 2026 - 1990 + 1 }, (_, i) => 2026 - i);

  const statusLabel = ["Disponível", "Alugado", "Manutenção"];
  const statusMap = {
    Disponível: "DISPONIVEL",
    Alugado: "ALUGADO",
    Manutenção: "MANUTENCAO",
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resMarcas, resCores, resCategorias, resSeguros, resModelos] =
          await Promise.all([
            VeiculosService.marcas.lista(),
            VeiculosService.cores.lista(),
            VeiculosService.categorias.lista(),
            VeiculosService.seguros.lista(),
            VeiculosService.modelos.lista(),
          ]);

        setMarcas(resMarcas.data || []);
        setCores(resCores.data || []);
        setCategorias(resCategorias.data || []);
        setSeguros(resSeguros.data || []);
        setModelos(resModelos.data || []);

        if (action === "Lista") await listarVeiculos();
      } catch (err) {
        handleApiError(err, "Erro ao carregar dados iniciais.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [action]);

  const listarVeiculos = async () => {
    try {
      const res = await service.lista();
      setLista(res.data || []);
    } catch (err) {
      handleApiError(err, "Erro ao carregar dados iniciais.");
    }
  };

  const buscarVeiculos = async () => {
    try {
      const params = montarParametrosBusca();
      const res = await VeiculosService.veiculos.search(params);
      setLista(res.data || []);
    } catch (err) {
      handleApiError(err, "Erro ao buscar veículos.");
    }
  };

  const montarParametrosBusca = () => {
    const params = {};

    if (filtros.placa) params.placa = filtros.placa;
    if (filtros.idCategoria) params.categoria = filtros.idCategoria;
    if (filtros.idMarca) params.brand = filtros.idMarca;
    if (filtros.idModelo) params.model = filtros.idModelo;
    if (filtros.idCor) params.color = filtros.idCor;
    if (filtros.status) params.status = statusMap[filtros.status];
    if (filtros.ano) params.ano = filtros.ano;

    return params;
  };

  const buscarModelosPorMarca = async (idMarca) => {
    try {
      if (!idMarca) {
        const res = await VeiculosService.modelos.lista();
        setModelos(res.data || []);
        return;
      }

      const res = await VeiculosService.modelos.buscarPorMarca(idMarca);
      setModelos(res.data || []);
    } catch (err) {
      handleApiError(err, "Erro ao carregar modelos da marca escolhida.");
    }
  };

  const salvarVeiculo = async () => {
    try {
      const payload = {
        ...novoVeiculo,
        valorDiario: parseFloat(novoVeiculo.valorDiario) || 0,
        status: statusMap[novoVeiculo.status] || novoVeiculo.status,
      };

      await service.add(payload);

      showSuccess("Cadastro realizado com sucesso!");
      setNovoVeiculo({});
      listarVeiculos();
    } catch (err) {
      console.error(err);
      handleApiError(err, `Erro ao listar ${label}`);
    }
  };

  const limparFiltros = async () => {
    setFiltros({});
    const res = await VeiculosService.modelos.lista();
    setModelos(res.data || []);
    listarVeiculos();
  };

  const getNomeOpcao = (opt) =>
    opt?.nome ||
    opt?.descricao ||
    opt?.company?.name ||
    opt?.empresa ||
    String(opt);

  if (carregando) return <p>Carregando...</p>;

  return (
    <>
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
                  setNovoVeiculo({ ...novoVeiculo, idMarca, idModelo: "" });
                  await buscarModelosPorMarca(idMarca);
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
                options: statusLabel,
              },
              { key: "descricao", label: "Descrição", type: "textarea" },
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
              {
                key: "valorDiario",
                label: "Valor Diário (R$)",
                type: "number",
              },
            ].map((campo) =>
              campo.type === "select" ? (
                <select
                  key={campo.key}
                  value={novoVeiculo[campo.key] || ""}
                  onChange={
                    campo.onChange ||
                    ((e) =>
                      setNovoVeiculo({
                        ...novoVeiculo,
                        [campo.key]: e.target.value,
                      }))
                  }
                >
                  <option value="">Selecione {campo.label}</option>
                  {campo.options?.map((opt) => (
                    <option key={opt.id ?? opt} value={opt.id ?? opt}>
                      {campo.key === "idSeguro"
                        ? `${opt.company?.name ?? "Seguradora"} — ${
                            opt.validade
                          }`
                        : getNomeOpcao(opt)}
                    </option>
                  ))}
                </select>
              ) : campo.type === "textarea" ? (
                <textarea
                  key={campo.key}
                  placeholder={campo.label}
                  value={novoVeiculo[campo.key] || ""}
                  onChange={(e) =>
                    setNovoVeiculo({
                      ...novoVeiculo,
                      [campo.key]: e.target.value,
                    })
                  }
                />
              ) : (
                <input
                  key={campo.key}
                  type={campo.type || "text"}
                  placeholder={campo.label}
                  value={novoVeiculo[campo.key] || ""}
                  maxLength={campo.key === "placa" ? 7 : undefined} // só para placa
                  onChange={(e) =>
                    setNovoVeiculo({
                      ...novoVeiculo,
                      [campo.key]:
                        campo.key === "placa"
                          ? e.target.value.toUpperCase()
                          : e.target.value,
                    })
                  }
                />
              )
            )}

            <MessageBox
              type={tipoMensagem}
              message={mensagem}
              onClose={clearError}
            />
            <button type="button" onClick={salvarVeiculo}>
              Salvar
            </button>
          </form>
        )}

        {/* LISTAR */}
        {action === "Lista" && (
          <>
            <MessageBox
              type={tipoMensagem}
              message={mensagem}
              onClose={clearError}
            />
            <div className={styles.filtros}>
              <input
                type="text"
                placeholder="Placa"
                value={filtros.placa || ""}
                onChange={(e) =>
                  setFiltros({ ...filtros, placa: e.target.value })
                }
              />

              {[
                { key: "idMarca", label: "Marca", options: marcas },
                { key: "idModelo", label: "Modelo", options: modelos },
                { key: "idCor", label: "Cor", options: cores },
                { key: "status", label: "Status", options: statusLabel },
                { key: "ano", label: "Ano", options: anos },
              ].map((s) => (
                <select
                  key={s.key}
                  value={filtros[s.key] || ""}
                  onChange={async (e) => {
                    const valor = e.target.value;

                    if (s.key === "idMarca") {
                      setFiltros({ ...filtros, idMarca: valor, idModelo: "" });
                      await buscarModelosPorMarca(valor);
                    } else {
                      setFiltros({ ...filtros, [s.key]: valor });
                    }
                  }}
                >
                  <option value="">{s.label}</option>
                  {s.options.map((opt) => (
                    <option key={opt.id ?? opt} value={opt.id ?? opt}>
                      {getNomeOpcao(opt)}
                    </option>
                  ))}
                </select>
              ))}

              <button className={styles.btnBuscar} onClick={buscarVeiculos}>
                <FaSearch className={styles.iconBuscar} /> Buscar
              </button>

              <button className={styles.btnLimpar} onClick={limparFiltros}>
                Limpar
              </button>
            </div>

            <ul className={styles.lista}>
              {lista.length === 0 ? (
                <p>Nenhum veículo encontrado.</p>
              ) : (
                lista.map((v) => (
                  <li key={v.placa}>
                    <span>{v.placa}</span>
                    <span>{v.brand?.nome}</span>
                    <span>{v.model?.nome}</span>
                    <span>{v.ano}</span>
                    <span>{v.color?.nome}</span>
                    <span>{v.status}</span>
                    <Link to={`/veiculos/${v.placa}`}>
                      <button>Detalhes</button>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
