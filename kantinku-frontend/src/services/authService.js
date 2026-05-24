import api from "./api";

export default {
    register: (data) => api.post("/register", data),
    login: (data) => api.post("/login", data),
    logout: () => api.post("/logout"),
    me: () => api.get("/me"),
    updateProfile: (data) => api.put("/profile", data),
    updatePassword: (data) => api.put("/password", data),
};
