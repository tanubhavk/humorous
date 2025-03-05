import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";  // Django backend URL

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default instance;
