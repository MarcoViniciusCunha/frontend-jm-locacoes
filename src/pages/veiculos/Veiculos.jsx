import ComponentVeiculos from "../../components/veiculos/ComponentVeiculos";
import CrudEntidade from "../../components/veiculos/EntidadeVeiculos";
import { VeiculosService } from "../../services/VeiculosService";
import "./Veiculos.css";
import { useState } from "react";

const Veiculos = () => {
  const [activeTab, setActiveTab] = useState("Veiculos");
  const [activeAction, setActiveAction] = useState("Lista");

  const tabs = [
    "Veiculos",
    "Categorias",
    "Marcas",
    "Modelos",
    "Cores",
    "Seguros",
  ];

  const actions = ["Lista", "Cadastrar", "Editar", "Excluir"];

  const getComponent = (tab) => {
    switch (tab) {
      case "Cores":
        return { service: VeiculosService.cores, label: "cor" };
      case "Marcas":
        return { service: VeiculosService.marcas, label: "marca" };
      case "Modelos":
        return { service: VeiculosService.modelos, label: "modelos" };
      case "Seguros":
        return { service: VeiculosService.seguros, label: "seguro" };
      case "Categorias":
        return { service: VeiculosService.categorias, label: "categoria" };
      case "Veiculos":
        return { service: VeiculosService.veiculos, label: "veiculos" };
      default:
        return null;
    }
  };

  const { service, label } = getComponent(activeTab) || {};

  return (
    <div className="veiculos-container">
      <header className="veiculos-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
            className={activeTab === tab ? "active" : ""}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </header>
      <header className="crud-header">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => {
              setActiveAction(action);
            }}
            className={activeAction === action ? "active" : ""}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </button>
        ))}
      </header>

      <main className="veiculos-main">
        <h2>
          {activeTab} - {activeAction}
        </h2>

        {(activeTab === "Cores" ||
          activeTab === "Marcas" ||
          activeTab === "Modelos") && (
          <CrudEntidade
            action={activeAction}
            service={service}
            label={label}
            fields={[{ key: "nome", label: "Nome" }]}
          />
        )}
        {activeTab === "Seguros" && (
          <CrudEntidade
            action={activeAction}
            service={VeiculosService.seguros}
            label="seguro"
            fields={[
              { key: "empresa", label: "Empresa" },
              { key: "validade", label: "Validade" },
              { key: "valor", label: "Valor" },
            ]}
          />
        )}

        {activeTab === "Categorias" && (
          <CrudEntidade
            action={activeAction}
            service={VeiculosService.categorias}
            label="categoria"
            fields={[
              { key: "nome", label: "Nome" },
              { key: "descricao", label: "Descrição" },
            ]}
          />
        )}

        {activeTab === "Veiculos" && (
          <ComponentVeiculos
            action={activeAction}
            service={VeiculosService.veiculos}
            label="veiculos"
          />
        )}
      </main>
    </div>
  );
};

export default Veiculos;
