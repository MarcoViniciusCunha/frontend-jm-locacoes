import { useState, useEffect } from "react";
import ComponentVeiculos from "../../components/veiculos/ComponentVeiculos";
import CrudEntidade from "../../components/veiculos/EntidadeVeiculos";
import { VeiculosService } from "../../services/VeiculosService";
import styles from "./Veiculos.module.css";

const Veiculos = () => {
  const [activeTab, setActiveTab] = useState("Veiculos");
  const [activeAction, setActiveAction] = useState("Lista");
  const [seguradoras, setSeguradoras] = useState([]);

  const tabs = [
    "Veiculos",
    "Categorias",
    "Marcas",
    "Modelos",
    "Cores",
    "Seguros",
  ];

  const getComponentConfig = () => {
    const map = {
      Cores: {
        service: VeiculosService.cores,
        fields: [{ key: "nome", label: "Nome" }],
      },
      Marcas: {
        service: VeiculosService.marcas,
        fields: [{ key: "nome", label: "Nome" }],
      },

      Modelos: {
        service: VeiculosService.modelos,
        fields: [
          { key: "nome", label: "Nome" },
          {
            key: "brandId",
            label: "Marca",
            type: "select",
            fetch: VeiculosService.marcas.lista,
            optionLabel: "nome",
          },
        ],
      },

      Seguros: {
        service: VeiculosService.seguros,
        fields: [
          {
            key: "companyId",
            label: "Seguradora",
            type: "select",
            options: seguradoras,
          },
          { key: "validade", label: "Validade" },
          { key: "valor", label: "Valor" },
        ],
      },

      Categorias: {
        service: VeiculosService.categorias,
        fields: [
          { key: "nome", label: "Nome" },
          { key: "descricao", label: "Descrição" },
        ],
      },

      Veiculos: { component: ComponentVeiculos },
    };

    return map[activeTab];
  };

  useEffect(() => {
    VeiculosService.seguradoras.lista().then((res) => {
      setSeguradoras(res.data);
    });
  }, []);

  const config = getComponentConfig();
  const isCrud = activeTab !== "Veiculos";

  return (
    <div className={styles.container}>
      {/* Abas */}
      <header className={styles.header}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? styles.active : ""}
            onClick={() => {
              setActiveTab(tab);
              setActiveAction("Lista");
            }}
          >
            {tab}
          </button>
        ))}
      </header>

      {/* Botões Lista / Cadastrar */}
      <header className={styles.crudHeader}>
        {["Lista", "Cadastrar"].map((action) => (
          <button
            key={action}
            className={activeAction === action ? styles.active : ""}
            onClick={() => setActiveAction(action)}
          >
            {action}
          </button>
        ))}
      </header>

      {/* Conteúdo */}
      <main className={styles.main}>
        <h2>
          {activeTab} - {activeAction}
        </h2>

        {isCrud ? (
          <CrudEntidade
            action={activeAction}
            service={config.service}
            label={activeTab.toLowerCase()}
            fields={config.fields}
          />
        ) : (
          <ComponentVeiculos
            action={activeAction}
            service={VeiculosService.veiculos}
          />
        )}
      </main>
    </div>
  );
};

export default Veiculos;
