import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/";

const API = axios.create({
  baseURL: apiUrl+"api", 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default API;
