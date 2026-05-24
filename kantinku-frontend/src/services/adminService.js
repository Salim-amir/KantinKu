import api from "./api";

export default {
    getFloors: () => api.get("/admin/floors"),
    createFloor: (fd) =>
        api.post("/admin/floors", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    updateFloor: (id, fd) => {
        if (fd instanceof FormData) {
            fd.append("_method", "PUT");
            return api.post(`/admin/floors/${id}`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }
        return api.put(`/admin/floors/${id}`, fd);
    },
    deleteFloor: (id) => api.delete(`/admin/floors/${id}`),

    getProducts: (page = 1) => api.get("/admin/products", { params: { page } }),
    createProduct: (fd) =>
        api.post("/admin/products", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    updateProduct: (id, fd) => {
        fd.append("_method", "PUT");
        return api.post(`/admin/products/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),

    getStock: () => api.get("/admin/stock"),
    setStock: (data) => api.post("/admin/stock", data),
    updateStock: (floorId, productId, stock) =>
        api.put(`/admin/stock/${floorId}/${productId}`, { stock }),
};
