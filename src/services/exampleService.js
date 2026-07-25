import { api } from "@/api";

export const exampleService = {
  getAll: () => api.get("/examples"),
  getById: (id) => api.get(`/examples/${id}`),
};
