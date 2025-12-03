// src/api/borrowApi.js
import axiosClient from "./axiosClient";

const borrowApi = {
  // 🟣 ADMIN — Lấy toàn bộ borrow records
  getAll: () => axiosClient.get("/borrow"),

  // 🔵 STUDENT — Lấy borrow của chính mình
  getByStudent: () => axiosClient.get("/borrow/me"),

  // 🔵 STUDENT — Tạo yêu cầu mượn
  create: (userId, bookId) => axiosClient.post("/borrow", { userId, bookId }),

  // 🟣 ADMIN — Duyệt yêu cầu
  approve: (id) => axiosClient.put(`/borrow/${id}/approve`),

  // 🟣 ADMIN — Từ chối yêu cầu
  reject: (id) => axiosClient.put(`/borrow/${id}/reject`),

  // 🔵 STUDENT — Gia hạn
  extend: (id) => axiosClient.put(`/borrow/${id}/extend`),

  // 🔵 STUDENT / ADMIN — Trả sách
  markReturned: (id) => axiosClient.put(`/borrow/${id}/return`),

  // 🟣 ADMIN — Xoá record
  delete: (id) => axiosClient.delete(`/borrow/${id}`),
};

export default borrowApi;
