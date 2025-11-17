import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentsService } from "../../services/LocacoesService";
import styles from "./pagamentos.module.css";
import { FiEye } from "react-icons/fi";

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await PaymentsService.lista();
        setPagamentos(resposta.data);
      } catch (err) {
        console.error("Erro ao carregar pagamentos:", err);
        setErro("Erro ao carregar pagamentos.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  if (carregando) return <div className={styles.loading}>Carregando...</div>;
  if (erro) return <div className={styles.erro}>{erro}</div>;

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Pagamentos</h1>

      <div className={styles.lista}>
        {pagamentos.length === 0 ? (
          <div className={styles.semDados}>Nenhum pagamento encontrado.</div>
        ) : (
          pagamentos.map((pg) => (
            <div key={pg.id} className={styles.card}>
              <div className={styles.topoCard}>
                <span className={styles.label}>Placa do veículo:</span>
                <span className={styles.placa}>{pg.rental.vehiclePlaca}</span>

                <span
                  className={`${styles.status} ${
                    pg.status === "Pago" ? styles.pago : styles.pendente
                  }`}
                >
                  {pg.status}
                </span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Cliente:</span>
                <span>{pg.rental.customerNome}</span>
              </div>

              <div className={styles.linha}>
                <span className={styles.label}>Data:</span>
                <span>{pg.dataPagamento}</span>
              </div>

              {/* BOTÃO DE DETALHES */}
              <div className={styles.botoes}>
                <button
                  className={styles.btnDetalhes}
                  onClick={() => navigate(`/pagamentos/${pg.id}`)}
                >
                  <FiEye size={18} />
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
