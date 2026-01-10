import { useState } from 'react';
import { reactionsApi, ReactionRequest } from '@/api/reactions';
import { ReactionType } from '@/components/common/ReactionButton';
import { notify } from '@/utils/toast';

export function useReactions() {
    const [isLoading, setIsLoading] = useState(false);

    const addReaction = async (
        reactableType: 'post' | 'comment',
        reactableId: number,
        reactionType: ReactionType
    ) => {
        setIsLoading(true);
        try {
            const response = await reactionsApi.addReaction({
                reactable_type: reactableType,
                reactable_id: reactableId,
                reaction_type: reactionType
            });
            return response.data.data;
        } catch (error: any) {
            notify.error(error?.response?.data?.message || 'Không thể thêm reaction');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeReaction = async (
        reactableType: 'post' | 'comment',
        reactableId: number
    ) => {
        setIsLoading(true);
        try {
            await reactionsApi.removeReaction(reactableType, reactableId);
        } catch (error: any) {
            notify.error(error?.response?.data?.message || 'Không thể xóa reaction');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getReactions = async (
        reactableType: 'post' | 'comment',
        reactableId: number,
        params?: {
            reaction_type?: string;
            page?: number;
            per_page?: number;
        }
    ) => {
        setIsLoading(true);
        try {
            const response = await reactionsApi.getReactions(reactableType, reactableId, params);
            return response.data;
        } catch (error: any) {
            notify.error(error?.response?.data?.message || 'Không thể tải reactions');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        addReaction,
        removeReaction,
        getReactions,
        isLoading
    };
}