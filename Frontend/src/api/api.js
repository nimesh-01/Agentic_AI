import axios from "axios";

const api = axios.create({
  baseURL: 'https://agentic-ai-bxvh.onrender.com/api',
  withCredentials: true,
});

export default api;
