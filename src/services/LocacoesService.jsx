import { api } from "../utils/config";

export const LocacoesService = {
  lista: async () => api.get("/rental"),
  buscarPorId: async (id) => api.get(`/rental/${id}`),
  filtrar: async (params) => api.get("/rental/filter", { params }),
  add: async (data) => api.post("/rental", data),
  editar: async (id, data) => api.patch(`/rental/${id}`, data),
  devolver: async (id) => api.patch(`/rental/return/${id}`),
  excluir: async (id) => api.delete(`/rental/${id}`),
  deshboard: async () => api.get("/rental/dashboard/info"),
};

export const PaymentsService = {
  lista: async () => api.get("/payment"),
  buscarPorId: async (id) => api.get(`/payment/${id}`),
  add: async (data) => api.post("/payment", data),
  editar: async (id, data) => api.patch(`/payment/${id}`, data),
  excluir: async (id) => api.delete(`/payment/${id}`),
  filtrar: async (params) => api.get("/payment/filter", { params }),
  gerarPdfPagamento: (id, config) => api.get(`/payment/${id}/pdf`, config),
};

export const MultasService = {
  lista: async () => api.get("/fines"),
  buscarPorId: async (id) => api.get(`/fines/${id}`),
  add: async (data) => api.post("/fines", data),
  editar: async (id, data) => api.patch(`/fines/${id}`, data),
  excluir: async (id) => api.delete(`/fines/${id}`),
  filtrar: async (params) => api.get("/fines/search", { params }),
};

export const InspecoesService = {
  lista: async () => api.get("/inspection"),
  buscarPorId: async (id) => api.get(`/inspection/${id}`),
  add: async (data) => api.post("/inspection", data),
  editar: async (id, data) => api.patch(`/inspection/${id}`, data),
  excluir: async (id) => api.delete(`/inspection/${id}`),
};

export const TollService = {
  add: async (data) => api.post("/toll", data),
  buscarPorId: async (id) => api.get(`/toll/${id}`),
  editar: async (id, data) => api.put(`/toll/${id}`, data),
  excluir: async (id) => api.delete(`/toll/${id}`),
};
