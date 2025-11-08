import ComponentVeiculos from "../../components/veiculos/ComponentVeiculos";
import CrudEntidade from "../../components/veiculos/EntidadeVeiculos";
import { VeiculosService } from "../../services/VeiculosService";
import styles from "./Veiculos.module.css";
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

  // 🔹 Define quais ações mostrar dependendo da aba
  const availableActions =
    activeTab === "Veiculos"
      ? ["Lista", "Cadastrar"] // sem Editar e Excluir
      : actions;

  const getComponent = (tab) => {
    switch (tab) {
      case "Cores":
        return { service: VeiculosService.cores, label: "cor" };
      case "Marcas":
        return { service: VeiculosService.marcas, label: "marca" };
      case "Modelos":
        return { service: VeiculosService.modelos, label: "modelo" };
      case "Seguros":
        return { service: VeiculosService.seguros, label: "seguro" };
      case "Categorias":
        return { service: VeiculosService.categorias, label: "categoria" };
      case "Veiculos":
        return { service: VeiculosService.veiculos, label: "veiculo" };
      default:
        return null;
    }
  };

  const { service, label } = getComponent(activeTab) || {};

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveAction("Lista"); // reseta ação ao trocar aba
            }}
            className={activeTab === tab ? styles.active : ""}
          >
            {tab}
          </button>
        ))}
      </header>

      <header className={styles.crudHeader}>
        {availableActions.map((action) => (
          <button
            key={action}
            onClick={() => setActiveAction(action)}
            className={activeAction === action ? styles.active : ""}
          >
            {action}
          </button>
        ))}
      </header>

      <main className={styles.main}>
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
