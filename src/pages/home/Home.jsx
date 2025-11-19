import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";
import { ClientesService } from "../../services/ClientesService";
import { LocacoesService } from "../../services/LocacoesService";
import styles from "./Home.module.css";

import {
  FiTruck,
  FiUsers,
  FiClipboard,
  FiTool,
  FiDollarSign,
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";

const Home = () => {
  const [totalVeiculos, setTotalVeiculos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);

  const [reservasAndamento, setReservasAndamento] = useState(0);
  const [veiculosManutencao, setVeiculosManutencao] = useState(0);

  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [pendencias, setPendencias] = useState(0);

  const [proximaDevolucao, setProximaDevolucao] = useState(null);
  const [proximaLocacao, setProximaLocacao] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Veículos
      const veiculosRes = await VeiculosService.veiculos.lista();
      const veiculosData = veiculosRes.data.content || veiculosRes.data;

      setTotalVeiculos(veiculosData.length);
      setVeiculosManutencao(
        veiculosData.filter((v) => v.status?.toUpperCase() === "MANUTENCAO")
          .length
      );

      // Clientes
      const clientesRes = await ClientesService.lista();
      const clientesData = clientesRes.data.content || clientesRes.data;
      setTotalClientes(clientesData.length);

      // ❗ AGORA PEGAMOS OS DADOS DIRETO DO BACKEND
      const dashboardRes = await LocacoesService.deshboard();
      const d = dashboardRes.data;

      setFaturamentoMes(d.faturamentoMes);
      setReservasAndamento(d.reservasAndamento);
      setPendencias(d.pendencias);
      setProximaDevolucao(d.proximaDevolucao);
      setProximaLocacao(d.proximaLocacao);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    }
  };

  return (
    <main className={styles.homeMain}>
      <div className={styles.dashboardContainer}>
        <h1>Dashboard JM Locações</h1>

        <div className={styles.cardsGrid}>
          <div className={`${styles.card} ${styles.totalVeiculos}`}>
            <h3>
              <FiTruck /> Total de Veículos
            </h3>
            <p>{totalVeiculos}</p>
          </div>

          <div className={`${styles.card} ${styles.totalClientes}`}>
            <h3>
              <FiUsers /> Total de Clientes
            </h3>
            <p>{totalClientes}</p>
          </div>

          <div className={`${styles.card} ${styles.reservas}`}>
            <h3>
              <FiClipboard /> Reservas em Andamento
            </h3>
            <p>{reservasAndamento}</p>
          </div>

          <div className={`${styles.card} ${styles.manutencao}`}>
            <h3>
              <FiTool /> Veículos em Manutenção
            </h3>
            <p>{veiculosManutencao}</p>
          </div>

          <div className={`${styles.card} ${styles.faturamento}`}>
            <h3>
              <FiDollarSign /> Faturamento do Mês
            </h3>
            <p>R$ {faturamentoMes.toFixed(2)}</p>
          </div>

          <div className={`${styles.card} ${styles.pendencias}`}>
            <h3>
              <FiAlertTriangle /> Pendências
            </h3>
            <p>{pendencias}</p>
          </div>

          <div className={`${styles.card} ${styles.proximaDevolucao}`}>
            <h3>
              <FiCalendar /> Próxima Devolução
            </h3>
            {proximaDevolucao ? (
              <p>
                {proximaDevolucao.customerName} - {proximaDevolucao.modelo}
                <br />
                {new Date(proximaDevolucao.endDate).toLocaleDateString()}
              </p>
            ) : (
              <p>Nenhuma devolução próxima</p>
            )}
          </div>

          <div className={`${styles.card} ${styles.proximaLocacao}`}>
            <h3>
              <FiCheckCircle /> Próxima Locação
            </h3>
            {proximaLocacao ? (
              <p>
                {proximaLocacao.customerName} - {proximaLocacao.modelo}
                <br />
                {new Date(proximaLocacao.startDate).toLocaleDateString()}
              </p>
            ) : (
              <p>Nenhuma locação futura</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
