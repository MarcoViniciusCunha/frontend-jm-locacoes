import { useEffect, useState } from "react";
import { VeiculosService } from "../../services/VeiculosService";
import { ClientesService } from "../../services/ClientesService";
import { LocacoesService } from "../../services/LocacoesService";
import styles from "./Home.module.css";
import MessageBox from "../../components/erro/MensagemErro";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Veículos
      const veiculosRes = await VeiculosService.veiculos.lista();
      const veiculosData = veiculosRes.data.content || veiculosRes.data;

      setTotalVeiculos(veiculosData.length);

      const manutencaoRes = await VeiculosService.veiculos.buscarPorStatus(
        "MANUTENCAO"
      );
      setVeiculosManutencao(manutencaoRes.data.length);

      // Clientes
      const clientesRes = await ClientesService.lista();
      const clientesData = clientesRes.data.content || clientesRes.data;
      setTotalClientes(clientesData.length);

      const dashboardRes = await LocacoesService.deshboard();
      const d = dashboardRes.data;

      setFaturamentoMes(d.faturamentoMes);
      setReservasAndamento(d.reservasAndamento);
      setPendencias(d.pendencias);
      setProximaDevolucao(d.proximaDevolucao);
      setProximaLocacao(d.proximaLocacao);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);

      const msg =
        error.response?.data?.error ||
        "Erro ao carregar informações do dashboard.";

      setTipoMensagem("error");
      setMensagem(msg);
    }
  };

  return (
    <main className={styles.homeMain}>
      <div className={styles.dashboardContainer}>
        <h1>Dashboard JM Locações</h1>

        <MessageBox type={tipoMensagem} message={mensagem} />

        {/* Grid de cards principais */}
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
            <p>
              {faturamentoMes.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div className={`${styles.card} ${styles.pendencias}`}>
            <h3>
              <FiAlertTriangle /> Locações em Atraso
            </h3>
            <p>{pendencias}</p>
          </div>
        </div>

        {/* Div separada para cards grandes */}
        <div className={styles.largeCardsContainer}>
          <div className={`${styles.card} ${styles.cardLarge}`}>
            <h3>
              <FiCalendar /> Próxima Devolução
            </h3>
            {proximaDevolucao && proximaDevolucao.length > 0 ? (
              <ul>
                {proximaDevolucao.map((r, idx) => (
                  <li key={idx}>
                    {r.customerName} - {r.modelo} -{" "}
                    {r.endDate
                      ? new Date(r.endDate + "T00:00:00").toLocaleDateString(
                          "pt-BR"
                        )
                      : "Data inválida"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma devolução próxima</p>
            )}
          </div>

          <div className={`${styles.card} ${styles.cardLarge}`}>
            <h3>
              <FiCheckCircle /> Próximas Locações
            </h3>
            {proximaLocacao && proximaLocacao.length > 0 ? (
              <ul>
                {proximaLocacao.map((r, idx) => (
                  <li key={idx}>
                    {r.customerName} - {r.modelo} -{" "}
                    {r.startDate
                      ? new Date(r.startDate + "T00:00:00").toLocaleDateString(
                          "pt-BR"
                        )
                      : "Data inválida"}
                  </li>
                ))}
              </ul>
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
