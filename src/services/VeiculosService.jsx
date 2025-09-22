import { api } from "../utils/config";

export const VeiculosService = {
  listarCores: async () => api.get("/color"),
  addCor: async (nome) => api.post("/color", { nome }),
  editarCor: async (id, nome) => api.put(`/color/${id}`, { nome }),
  excluirCor: async (id) => api.delete(`/color/${id}`),
};
