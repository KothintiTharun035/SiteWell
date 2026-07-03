import axios from "axios";

// Set VITE_API_BASE_URL in a client/.env file, e.g.:
//   VITE_API_BASE_URL=http://localhost:8000
// In production, point this at your deployed backend URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // /get-url proxies to the PageSpeed API, which can be slow
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;
// Attach the JWT (if present) to every outgoing request.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("sitewell_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize 401 handling: drop the stale session and send the user to log in.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sitewell_token");
      localStorage.removeItem("sitewell_user");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);


