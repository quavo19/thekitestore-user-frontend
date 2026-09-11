import { api } from "@/api";
import { API_BASE_URL } from "@/constants";

export const AUTH_TOKEN_STORAGE_KEY = "karaboome-auth-token";
export const AUTH_REDIRECT_STORAGE_KEY = "karaboome-auth-redirect";

export const authService = {
  googleAuthUrl: () => `${API_BASE_URL}/auth/google_oauth2`,
  getProfile: () => api.get("/users/profile"),
  updateProfile: (user) => api.patch("/users/profile", { user }),
};
