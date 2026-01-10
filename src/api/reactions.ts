import { axiosAPI } from "./axios";

export interface ReactionRequest {
    reactable_type: 'post' | 'comment';
    reactable_id: number;
    reaction_type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
}

export interface Reaction {
    id: number;
    user_id: number;
    reactable_type: string;
    reactable_id: number;
    reaction_type: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
}

export interface ReactionSummary {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
}

// Mock data for development
const mockReactions: Reaction[] = [];
let mockReactionId = 1;

export const reactionsApi = {
    // Thêm/cập nhật reaction
    addReaction: async (data: ReactionRequest): Promise<{ data: { message: string; data: Reaction } }> => {
        try {
            const response = await axiosAPI.post<{ message: string; data: Reaction }>('/reactions', data);
            return response;
        } catch (error) {
            console.warn('Reactions API not available, using mock data');
            // Create mock reaction if API fails
            const mockReaction: Reaction = {
                id: mockReactionId++,
                user_id: 1,
                reactable_type: data.reactable_type,
                reactable_id: data.reactable_id,
                reaction_type: data.reaction_type,
                created_at: new Date().toISOString(),
                user: {
                    id: 1,
                    name: 'Demo User',
                    avatar: undefined
                }
            };
            
            // Remove existing reaction for same user and reactable
            const existingIndex = mockReactions.findIndex(r => 
                r.user_id === 1 && 
                r.reactable_type === data.reactable_type && 
                r.reactable_id === data.reactable_id
            );
            if (existingIndex !== -1) {
                mockReactions.splice(existingIndex, 1);
            }
            
            mockReactions.push(mockReaction);
            return {
                data: {
                    message: 'Reaction added successfully',
                    data: mockReaction
                }
            };
        }
    },

    // Xóa reaction
    removeReaction: async (reactableType: string, reactableId: number): Promise<void> => {
        try {
            await axiosAPI.delete(`/reactions`, {
                data: {
                    reactable_type: reactableType,
                    reactable_id: reactableId
                }
            });
        } catch (error) {
            console.warn('Reactions API not available, using mock data');
            // Remove from mock data
            const existingIndex = mockReactions.findIndex(r => 
                r.user_id === 1 && 
                r.reactable_type === reactableType && 
                r.reactable_id === reactableId
            );
            if (existingIndex !== -1) {
                mockReactions.splice(existingIndex, 1);
            }
        }
    },

    // Lấy danh sách reactions
    getReactions: (reactableType: string, reactableId: number, params?: {
        reaction_type?: string;
        page?: number;
        per_page?: number;
    }) => axiosAPI.get<{
        data: Reaction[];
        current_page: number;
        last_page: number;
        total: number;
    }>('/reactions', {
        params: {
            reactable_type: reactableType,
            reactable_id: reactableId,
            ...params
        }
    }),
};