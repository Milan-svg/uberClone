import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: "https://11q0v75m-8000.inc1.devtunnels.ms/api/v1",
  withCredentials: true,
});

export default api;
