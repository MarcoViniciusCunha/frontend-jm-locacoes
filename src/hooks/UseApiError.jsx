import { useState } from "react";

export default function useApiMessage() {
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("info");
  const [messageKey, setMessageKey] = useState(0);

  const sendMessage = (type, msg) => {
    setTipoMensagem(type);
    setMensagem(msg);
    setMessageKey(Date.now());
  };

  const handleApiError = (err, defaultMsg = "Erro inesperado.") => {
    console.error(err);

    const data = err?.response?.data;
    let msg = defaultMsg;

    if (data?.message) msg = data.message;
    else if (Array.isArray(data?.errors)) msg = data.errors[0].defaultMessage;
    else if (data && typeof data === "object") msg = Object.values(data)[0];
    else if (err?.message) msg = err.message;

    sendMessage("error", msg);
  };

  function showSuccess(msg) {
    sendMessage("success", msg);
  }

  return { mensagem, tipoMensagem, messageKey, handleApiError, showSuccess };
}
