import { api } from "../utils/config";

export const VeiculosService = {
  cores: {
    lista: async () => api.get("/color"),
    add: async (data) => api.post("/color", data),
    editar: async (id, data) => api.put(`/color/${id}`, data),
    excluir: async (id) => api.delete(`/color/${id}`),
  },

  marcas: {
    lista: async () => api.get("/brand"),
    add: async (data) => api.post("/brand", data),
    editar: async (id, data) => api.put(`/brand/${id}`, data),
    excluir: async (id) => api.delete(`/brand/${id}`),
  },

  modelos: {
    lista: async () => api.get("/model"),
    add: async (data) => api.post("/model", data),
    editar: async (id, data) => api.put(`/model/${id}`, data),
    excluir: async (id) => api.delete(`/model/${id}`),
  },

  seguros: {
    lista: async () => api.get("/insurance"),
    add: async (data) => api.post("/insurance", data),
    editar: async (id, data) => api.patch(`/insurance/${id}`, data),
    excluir: async (id) => api.delete(`/insurance/${id}`),
  },

  categorias: {
    lista: async () => api.get("/categories"),
    add: async (data) => api.post("/categories", data),
    editar: async (id, data) => api.patch(`/categories/${id}`, data),
    excluir: async (id) => api.delete(`/categories/${id}`),
  },

  veiculos: {
    lista: async () => api.get("/vehicles"),
    add: async (data) => api.post("/vehicles", data),
    editar: async (placa, data) => api.patch(`/vehicles/${placa}`, data),
    excluir: async (placa) => api.delete(`/vehicles/${placa}`),
    buscarPorPlaca: async (placa) => api.get(`/vehicles/${placa}`),
    search: async (params) => api.get("/vehicles/search", { params }),
  },
};
