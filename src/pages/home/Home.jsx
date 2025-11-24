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

  const carrosExemplo = [
    {
      modelo: "Fiat Argo",
      imagem:
        "https://dsae.s3.amazonaws.com/00434116001291/Fotos/0KFI08_01.jpg?u=20241219174514",
    },
    {
      modelo: "Chevrolet Onix",
      imagem:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2021_Chevrolet_Onix_Plus_1.2_LT.jpg/1200px-2021_Chevrolet_Onix_Plus_1.2_LT.jpg",
    },
    {
      modelo: "Volkswagen Gol",
      imagem:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8ty7q3_jGQkDXxR24jDg5n3V9j0fdPuk-nwSNbwgjhKeHMg_aMSLfZye-KqM8AJ-Wty0b3sqZYo1hdyW-_TZB2zJJ2rt4INYf_lyom9ntb3PsIivrU2_NQ5pZYLetwE9hRMQH7rzUobms_sg4F5B0d1vC6gMAfFP4Brbx7ZQqpwdENAbcpruKRzFK/w640-h360/20230413_123133.jpg",
    },
    {
      modelo: "Hyundai HB20",
      imagem:
        "https://www.carrosnovale.com.br/wp-content/uploads/2025/11/4-hyundai-hb20-1-million-16-flex-16v-aut-4p-2019-0-2-cp.jpg",
    },
  ];

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
              <FiAlertTriangle /> Locações em Atraso
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
        <div className={styles.carouselWrapper}>
          <div className={styles.carouselContainer}>
            <Slider
              dots={true}
              infinite={true}
              autoplay={true}
              autoplaySpeed={3000}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
            >
              {carrosExemplo.map((carro, index) => (
                <div key={index} className={styles.carItem}>
                  <img src={carro.imagem} alt={carro.modelo} />
                  <p>{carro.modelo}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
