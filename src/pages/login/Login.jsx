import { useState } from "react";
import { api, setAuthToken } from "../../utils/config";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MessageBox from "../../components/erro/MensagemErro";
import styles from "./Login.module.css";

export default function Login() {
  const [credenciais, setCredenciais] = useState({ usuario: "", senha: "" });
  const [mensagemErro, setMensagemErro] = useState("");

  const { login } = useAuthContext();
  const navegar = useNavigate();

  const atualizarCampo = (campo, valor) => {
    setCredenciais((prev) => ({ ...prev, [campo]: valor }));
  };

  const autenticarUsuario = async () => {
    const resposta = await api.post("/login", {
      username: credenciais.usuario,
      password: credenciais.senha,
    });

    return resposta.data.token;
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    setMensagemErro("");

    try {
      const token = await autenticarUsuario();

      setAuthToken(token);
      login(token);

      navegar("/");
    } catch (erro) {
      const mensagemApi = erro.response?.data?.message;
      setMensagemErro(
        mensagemApi || "Erro ao realizar login. Tente novamente."
      );
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src="src/assets/logo.png" alt="Logo" width={350} height={350} />

      <h2>Login</h2>

      {mensagemErro && <p className={styles.error}>{mensagemErro}</p>}

      <form onSubmit={enviarFormulario}>
        <input
          type="text"
          placeholder="Usuário"
          value={credenciais.usuario}
          onChange={(e) => atualizarCampo("usuario", e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={credenciais.senha}
          onChange={(e) => atualizarCampo("senha", e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
