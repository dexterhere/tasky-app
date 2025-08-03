import { api } from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  // Fixed Google OAuth method
  googleAuth() {
    // Redirect to backend Google OAuth endpoint
    const backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${backendUrl}/auth/google`;
  },

  async logout() {
    try {
      // Optional: Call backend logout endpoint
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },

  async checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("token");
      return null;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/profile");
      return response.data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },
};
