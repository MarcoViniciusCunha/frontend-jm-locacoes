import { api } from "../utils/config";

export const ClientesService = {
  lista: async () => api.get("/customers"),
  add: async (data) => api.post("/customers", data),
  editar: async (id, data) => api.patch(`/customers/${id}`, data),
  excluir: async (id, data) => api.delete(`/customers/${id}`, data),
  getById: async (id, data) => api.get(`/customers/${id}`, data),
  getByName: async (nome) =>
    api.get("/customers/search", {
      params: { nome },
    }),
};
