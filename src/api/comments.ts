import { axiosAPI } from "./axios";
import { PaginatedResponse } from "@/types/public/group";

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    parent_id: number | null;
    content: string;
    reactions_count: number;
    replies_count: number;
    user_reaction: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    replies?: Comment[];
}

export interface CreateCommentRequest {
    content: string;
    parent_id?: number;
}

// Mock data for development
const mockComments: Comment[] = [];
let mockCommentId = 1;

export const commentsApi = {
    // Lấy comments của post
    getPostComments: async (postId: number, params?: {
        page?: number;
        per_page?: number;
        sort?: 'latest' | 'oldest';
    }): Promise<{ data: PaginatedResponse<Comment> }> => {
        try {
            const response = await axiosAPI.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, { params });
            return response;
        } catch (error) {
            console.warn('Comments API not available, using mock data');
            // Return mock data if API fails
            const filteredComments = mockComments.filter(c => c.post_id === postId);
            return {
                data: {
                    data: filteredComments,
                    current_page: 1,
                    last_page: 1,
                    per_page: 10,
                    total: filteredComments.length,
                    from: 1,
                    to: filteredComments.length
                }
            };
        }
    },

    // Thêm comment
    createComment: async (postId: number, data: CreateCommentRequest): Promise<{ data: { message: string; data: Comment } }> => {
        try {
            const response = await axiosAPI.post<{ message: string; data: Comment }>(`/posts/${postId}/comments`, data);
            return response;
        } catch (error) {
            console.warn('Comments API not available, using mock data');
            // Create mock comment if API fails
            const mockComment: Comment = {
                id: mockCommentId++,
                post_id: postId,
                user_id: 1,
                parent_id: data.parent_id || null,
                content: data.content,
                reactions_count: 0,
                replies_count: 0,
                user_reaction: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user: {
                    id: 1,
                    name: 'Demo User',
                    avatar: undefined
                },
                replies: []
            };
            mockComments.push(mockComment);
            return {
                data: {
                    message: 'Comment created successfully',
                    data: mockComment
                }
            };
        }
    },

    // Xóa comment
    deleteComment: (commentId: number) =>
        axiosAPI.delete(`/comments/${commentId}`),

    // Lấy replies của comment
    getCommentReplies: (commentId: number, params?: {
        page?: number;
        per_page?: number;
    }) => axiosAPI.get<PaginatedResponse<Comment>>(`/comments/${commentId}/replies`, { params }),
};