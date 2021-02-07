import axios from "axios";

const api = axios.create({
  // baseURL: 'http://localhost:5000'
  baseURL: 'https://pokeapi.co/api/v2/'
});

api.interceptors.request.use(async config => {
  return config;
});

export default api;