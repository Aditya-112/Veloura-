import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    if (!config.headers.Authorization) {
      const token = await (window as any).Clerk?.session?.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error retrieving Clerk token for API request:", error);
  }
  return config;
});

export default api;