import { useEffect, useState, useCallback } from "react";

export function useCarregarDados(fetchFn, dependencias = []) {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await fetchFn();
      setDados(resposta.data || []);
    } catch (e) {
      setErro(e);
    } finally {
      setCarregando(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    carregar();
  }, dependencias);

  return {
    dados,
    carregando,
    erro,
    recarregar: carregar,
    setDados,
  };
}
