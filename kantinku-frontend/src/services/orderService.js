import api from "./api";

export default {
    getOrders: (page = 1) => api.get("/orders", { params: { page } }),
    getOrder: (id) => api.get(`/orders/${id}`),
    checkout: (data) => api.post("/orders", data),
    uploadPayment: (id, formData) =>
        api.post(`/orders/${id}/payment`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    adminGetOrders: (status = "", page = 1) =>
        api.get("/admin/orders", { params: { status: status || undefined, page } }),
    adminGetOrder: (id) => api.get(`/admin/orders/${id}`),
    adminUpdateStatus: (id, status) =>
        api.put(`/admin/orders/${id}/status`, { status }),
};
