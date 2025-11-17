import { api } from "../utils/config";

export const LocacoesService = {
  lista: async () => api.get("/rental"),
  buscarPorId: async (id) => api.get(`/rental/${id}`),
  filtrar: async (params) => api.get("/rental/filter", { params }),
  add: async (data) => api.post("/rental", data),
  editar: async (id, data) => api.patch(`/rental/${id}`, data),
  devolver: async (id) => api.patch(`/rental/return/${id}`),
  excluir: async (id) => api.delete(`/rental/${id}`),
};

export const PaymentsService = {
  lista: async () => api.get("/payment"),
  buscarPorId: async (id) => api.get(`/payment/${id}`),
  add: async (data) => api.post("/payment", data),
  editar: async (id, data) => api.patch(`/payment/${id}`, data),
  excluir: async (id) => api.delete(`/payment/${id}`),
};
