import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./hooks/PublicRoute";
import PrivateRoute from "./hooks/PrivateRoute";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { setAuthToken } from "./utils/config";
import { useEffect } from "react";

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

function Layout({ children }) {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/login"; // esconder em login

  return (
    <>
      {!hideNavFooter && <NavBar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // garante que axios já tenha o token antes de qualquer chamada
    }
  }, []);

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
              path="/veiculos"
              element={
                <PrivateRoute>
                  <Veiculos />
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
