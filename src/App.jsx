import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./hooks/PublicRoute";
import PrivateRoute from "./hooks/PrivateRoute";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";
import "./App.css";

// Pages
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Locacoes from "./pages/locacoes/Locacoes";

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
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
