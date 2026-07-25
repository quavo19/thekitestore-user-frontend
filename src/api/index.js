import { httpClient } from "@/clients";

export const api = {
  get: (path, options) => httpClient.get(path, options),
  post: (path, body, options) => httpClient.post(path, body, options),
  put: (path, body, options) => httpClient.put(path, body, options),
  patch: (path, body, options) => httpClient.patch(path, body, options),
  delete: (path, options) => httpClient.delete(path, options),
};
