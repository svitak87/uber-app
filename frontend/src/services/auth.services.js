import { apiRequest, apiErrorMessage } from "./api.js";

export const authService = {
  async login({ email, password }) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    return data;
  },

  async logout() {
    await apiRequest("/auth/logout", { method: "POST" });
  },

  async getProfile() {
    const response = await apiRequest("/auth/profile");

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(await apiErrorMessage(response, "Unable to load profile"));
    }

    return data.user;
  },
};