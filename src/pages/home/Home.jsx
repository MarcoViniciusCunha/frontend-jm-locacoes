import React from 'react'
import "./Home.css"

const Home = () => {
  return (
    <main>
      <div className="home">
        <h1>Locação de Veículos</h1>
      </div>

      <div className="container">
        <br />
        <div className="lista">
          <h2>Dashboard</h2>
          <br />
          <ul>
            <li>
              <h3>🚗 Total de veículos cadastrados "%"</h3>
            </li>
            <li>
              <h3>👤 Total de clientes cadastrados: "%"</h3>
            </li>
            <li>
              <h3>📅 Reservas em andamento: "%"</h3>
            </li>

            <div>
              <h3>📅 Próxima Devolução</h3>
              <ul>
                <li className="info">
                  <span className="Cliente">João Silva</span> - HB20
                  <span className="devolucao alerta">18/09</span>
                </li>
              </ul>
            </div>

            <div>
              <h3>📝 Próxima Locação</h3>
              <ul>
                <li className="info2">
                  <span className="Cliente">Ana Souza</span> - GOL
                  <span className="locacao alerta">Pendente</span>
                </li>
              </ul>
            </div>

            <li>
              <h3>💸 Faturamento do mês: "$"</h3>
            </li>
            <li>
              <h3>⚠️ Total de Pendências: "$"</h3>
            </li>
            <li>
              <h3>🛠️ Veículos em manutenção: "%"</h3>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Home
