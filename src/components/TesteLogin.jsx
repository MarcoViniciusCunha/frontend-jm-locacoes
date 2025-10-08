import { useEffect } from "react";
import { api, setAuthToken } from "../utils/config";

function TesteLogin() {
  useEffect(() => {
    const login = async () => {
      try {
        const response = await api.post("/login", {
          email: "teste@exemplo.com",
          password: "senha123",
        });

        const token = response.data.token;
        console.log("Token recebido:", token);

        // opcional: seta o token no axios para próximas requisições
        setAuthToken(token);
      } catch (error) {
        console.error("Erro ao logar:", error.response?.data || error.message);
      }
    };

    login();
  }, []);

  return null; // não precisa renderizar nada na tela
}

export default TesteLogin;
