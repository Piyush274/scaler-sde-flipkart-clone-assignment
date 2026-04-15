import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add response interceptor to handle 401 errors and clear auth state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401 Unauthorized
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

