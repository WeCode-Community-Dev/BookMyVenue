import axios from "axios";

const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:3000";

const AXIOS_API = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default AXIOS_API;
