import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Páginas
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

// Componentes
import NavBar from "./components/navbar/NavBar";
import Footer from "./components/footer/Footer";

// Rotas
import PublicRoute from "./hooks/PublicRoute";
import PrivateRoute from "./hooks/PrivateRoute";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <NavBar />
        <div className="container">
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
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
