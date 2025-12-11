import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./hooks/PublicRoute";
import PrivateRoute from "./hooks/PrivateRoute";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { setAuthToken } from "./utils/config";

// Components
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";

// Pages
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Locacoes from "./pages/locacoes/Locacoes";
import Veiculos from "./pages/veiculos/Veiculos";
import Clientes from "./pages/clientes/Clientes";
import ClienteDetalhe from "./pages/clientes/ClienteDetalhe";
import LocacaoDetalhe from "./pages/locacoes/LocacaoDetalhe";
import VeiculoDetalhes from "./pages/veiculos/VeiculoDetalhes";
import Pagamentos from "./pages/pagamentos/Pagamentos";
import PagamentosDetalhes from "./pages/pagamentos/PagamentosDetalhes";
import MultasList from "./pages/multas/MultasList";
import MultaDetalhe from "./pages/multas/MultaDetalhe";
import PedagiosDetalhes from "./pages/pedagio/PedagiosDetalhes";
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/login";

  return (
    <div className="layout">
      {!hideNavFooter && <NavBar />}

      <main className="conteudo">{children}</main>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/locacoes"
              element={
                <PrivateRoute>
                  <Locacoes />
                </PrivateRoute>
              }
            />
            <Route
              path="/locacoes/:id"
              element={
                <PrivateRoute>
                  <LocacaoDetalhe />
                </PrivateRoute>
              }
            />
            <Route
              path="/veiculos"
              element={
                <PrivateRoute>
                  <Veiculos />
                </PrivateRoute>
              }
            />
            <Route
              path="/veiculos/:placa"
              element={
                <PrivateRoute>
                  <VeiculoDetalhes />
                </PrivateRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <PrivateRoute>
                  <Clientes />
                </PrivateRoute>
              }
            />
            <Route
              path="/clientes/:id"
              element={
                <PrivateRoute>
                  <ClienteDetalhe />
                </PrivateRoute>
              }
            />
            <Route
              path="/pagamentos"
              element={
                <PrivateRoute>
                  <Pagamentos />
                </PrivateRoute>
              }
            />
            <Route
              path="/pagamentos/:id"
              element={
                <PrivateRoute>
                  <PagamentosDetalhes />
                </PrivateRoute>
              }
            />
            <Route
              path="/multas"
              element={
                <PrivateRoute>
                  <MultasList />
                </PrivateRoute>
              }
            />
            <Route
              path="/multas/:id"
              element={
                <PrivateRoute>
                  <MultaDetalhe />
                </PrivateRoute>
              }
            />
            <Route
              path="/pedagios/:id"
              element={
                <PrivateRoute>
                  <PedagiosDetalhes />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <h1>404 - Página não encontrada</h1>
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
