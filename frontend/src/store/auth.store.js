import { create } from "zustand";
import { authService } from "../services/auth.services.js";

let authCheckPromise = null;

const doCheckAuth = async (set) => {
  set({ isLoading: true });
  try {
    const user = await authService.getProfile();
    set({ user, isAuthenticated: true, isLoading: false });
  } catch {
    set({ user: null, isAuthenticated: false, isLoading: false });
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  clearAuth: () => set({ user: null, isAuthenticated: false }),

  login: async ({ email, password }) => {
    const data = await authService.login({ email, password });
    set({ user: data.user, isAuthenticated: true, isLoading: false });
    return data.user;
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: () => {
    if (!authCheckPromise) {
      authCheckPromise = doCheckAuth(set).finally(() => {
        authCheckPromise = null;
      });
    }

    return authCheckPromise;
  },
}));