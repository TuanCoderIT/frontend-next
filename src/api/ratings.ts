import { axiosAPI } from "./axios";

// Gửi đánh giá mới
export const createRating = async (
    type: "quiz" | "post" | "news" | "document",
    id: number,
    data: { stars: number; comment?: string },
    token: string
) => {
    return axiosAPI.post(`/ratings`, { type, id, ...data }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Lấy đánh giá hiện tại của user
export const getMyRating = async (
    type: "quiz" | "post" | "news" | "document",
    id: number,
    token: string
) => {
    return axiosAPI.get(`/ratings/my`, {
        params: { type, id },
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Lấy tất cả đánh giá của một item
export const getRatings = async (
    type: "quiz" | "post" | "news" | "document",
    id: number,
    page: number = 1,
    limit: number = 10
) => {
    return axiosAPI.get(`/ratings`, {
        params: { type, id, page, limit },
    });
};

// Lấy thống kê ratings
export const getRatingStats = async (
    type: "quiz" | "post" | "news" | "document",
    id: number
) => {
    return axiosAPI.get("/ratings/stats", {
        params: { type, id },
    });
};

// Cập nhật đánh giá
export const updateRating = async (
    ratingId: number,
    data: { stars: number; comment?: string },
    token: string
) => {
    return axiosAPI.put(`/ratings/${ratingId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// Xóa đánh giá
export const deleteRating = async (
    ratingId: number,
    token: string
) => {
    return axiosAPI.delete(`/ratings/${ratingId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

