// api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL  // ✅ Vite syntax
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ reads what Login.jsx saved
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;