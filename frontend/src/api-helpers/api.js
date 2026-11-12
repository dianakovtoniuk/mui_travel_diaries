import axios from "axios";
import { store, authActions } from "../store";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const { token } = store.getState().auth;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid token on a protected call means the session is over
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/user/login") || url.includes("/user/signup");
    if (err.response?.status === 401 && !isAuthCall && store.getState().auth.isLoggedIn) {
      store.dispatch(authActions.logout());
    }
    return Promise.reject(err);
  }
);

export default api;
