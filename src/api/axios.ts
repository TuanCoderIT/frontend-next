import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

// const BASE_URL = "http://localhost:8000/api";

// // API cho người dùng (public site)
// export const publicAPI = axios.create({
//   baseURL: `${BASE_URL}/public`,
// });

// // API cho admin (dashboard quản lý)
// export const adminAPI = axios.create({
//   baseURL: `${BASE_URL}/admin`,
// });

// // Gọi API lấy danh sách bài viết public
// await publicAPI.get("/posts");

// // Gọi API lấy danh sách quiz từ admin dashboard
// await adminAPI.get("/quizzes");
