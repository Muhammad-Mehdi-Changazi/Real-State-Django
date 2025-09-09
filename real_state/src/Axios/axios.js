import axios from "axios";

const getAuthToken = () => localStorage.getItem("access_token") || null;
const getRefreshToken = () => localStorage.getItem("refresh_token") || null;
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token
API.interceptors.request.use((config) => {
  const token = getAuthToken();
  const user = getUser();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (user) config.headers["X-User-Id"] = user.id;
  return config;
});

// Response interceptor: auto-refresh token if expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/users/token/refresh/",
            { refresh: refreshToken }
          );
          localStorage.setItem("access_token", response.data.access);
          originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
          return API(originalRequest);
        } catch (err) {
          console.error("Refresh token expired:", err);
          // Optional: logout user
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
