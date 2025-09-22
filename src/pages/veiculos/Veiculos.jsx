import Cores from "../../components/veiculos/Cores";
import "./Veiculos.css";
import { useState } from "react";

const Veiculos = () => {
  const [activeTab, setActiveTab] = useState("Veiculos");
  const [activeAction, setActiveAction] = useState("Listar");

  const tabs = ["Veiculos", "Categorias", "Marcas", "Cores", "Seguros"];

  const actions = ["Listar", "Cadastrar", "Editar", "Excluir"];

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

        {activeTab === "Cores" && <Cores action={activeAction} />}
      </main>
    </div>
  );
};

export default Veiculos;
