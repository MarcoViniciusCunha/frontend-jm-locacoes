import { api } from "../utils/config";

export const VeiculosService = {
  cores: {
    lista: async () => api.get("/color"),
    add: async (nome) => api.post("/color", { nome }),
    editar: async (id, nome) => api.put(`/color/${id}`, { nome }),
    excluir: async (id) => api.delete(`/color/${id}`),
  },

  marcas: {
    lista: async () => api.get("/brand"),
    add: async (nome) => api.post("/brand", { nome }),
    editar: async (id, nome) => api.put(`/brand/${id}`, { nome }),
    excluir: async (id) => api.delete(`/brand/${id}`),
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
};
