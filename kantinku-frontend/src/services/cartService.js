import api from "./api";

export default {
    getCart: () => api.get("/cart"),
    addItem: (data) => api.post("/cart", data),
    updateItem: (id, data) => api.put(`/cart/${id}`, data),
    removeItem: (id) => api.delete(`/cart/${id}`),
    clearCart: () => api.delete("/cart"),
};
