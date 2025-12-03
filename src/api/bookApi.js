// src/api/bookApi.js
import axiosClient from "./axiosClient";

const bookApi = {
  // Cho phép truyền params để BE nhận keyword + category
  getAll: (params = {}) => axiosClient.get("/books", { params }),

  getById: (id) => axiosClient.get(`/books/${id}`),
  create: (data) => axiosClient.post("/books", data),
  update: (id, data) => axiosClient.put(`/books/${id}`, data),
  delete: (id) => axiosClient.delete(`/books/${id}`),
};

export default bookApi;
