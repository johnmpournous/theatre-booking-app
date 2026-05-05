import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.57:5000/api"
});

export default api;