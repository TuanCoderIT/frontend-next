import { CreatePostRequest, PaginatedResponse, Post } from "@/types/public/group";
import { axiosAPI } from "./axios";

export const postsApi = {
    // Lấy posts của group
    getGroupPosts: (groupId: number, page = 1) =>
        axiosAPI.get<PaginatedResponse<Post>>(`/posts/group/${groupId}`, {
            params: { page },
        }),

    // Tạo post
    createPost: (data: CreatePostRequest) =>
        axiosAPI.post<{ message: string; data: Post }>('/posts', data),
};