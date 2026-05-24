import api from "./api";

export default {
    getFloors: () => api.get("/floors"),
    getAll: (page = 1) => api.get("/products", { params: { page } }),
    getByFloor: (floorId, page = 1, search = '') => api.get(`/floors/${floorId}/products`, { params: { page, search: search || undefined } }),
};
