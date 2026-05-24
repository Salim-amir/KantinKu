import axios from "axios";

const API_URL = "https://kantinku-production.up.railway.app/api";

fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data));
  
const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("kantinku_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("kantinku_token");
            localStorage.removeItem("kantinku_user");
            window.location.href = "/login";
        }
        return Promise.reject(err);
    },
);

export default api;
