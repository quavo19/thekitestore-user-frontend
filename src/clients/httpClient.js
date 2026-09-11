import { API_BASE_URL } from "@/constants";

const AUTH_TOKEN_STORAGE_KEY = "karaboome-auth-token";

class HttpClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message ??
          error.error ??
          error.errors?.[0] ??
          `Request failed with status ${response.status}`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  get(path, options) {
    return this.request(path, { ...options, method: "GET" });
  }

  post(path, body, options) {
    return this.request(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(path, body, options) {
    return this.request(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch(path, body, options) {
    return this.request(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete(path, options) {
    return this.request(path, { ...options, method: "DELETE" });
  }
}

export const httpClient = new HttpClient();
