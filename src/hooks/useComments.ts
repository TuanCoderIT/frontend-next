import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { commentsApi, Comment, CreateCommentRequest } from '@/api/comments';
import { PaginatedResponse } from '@/types/public/group';
import { notify } from '@/utils/toast';

export function useComments(postId: number) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Comment> | null) => {
        if (previousPageData && !previousPageData.data.length) return null;
        return ['post-comments', postId, pageIndex + 1];
    };

    const { data, error, size, setSize, mutate } = useSWRInfinite<PaginatedResponse<Comment>>(
        getKey,
        ([, , page]) => commentsApi.getPostComments(postId, { page }).then((res) => res.data)
    );

    const comments = data ? data.flatMap((page) => page.data) : [];
    const isLoadingMore = size > 0 && data && typeof data[size - 1] === 'undefined';
    const hasMore = data
        ? data[data.length - 1].current_page < data[data.length - 1].last_page
        : false;
    const totalComments = data ? data[0]?.total || 0 : 0;

    const addComment = async (content: string, parentId?: number) => {
        if (!content.trim()) {
            throw new Error('Comment content is required');
        }
        
        setIsSubmitting(true);
        try {
            const response = await commentsApi.createComment(postId, {
                content: content.trim(),
                parent_id: parentId
            });
            
            // Optimistic update - add comment to the beginning
            mutate();
            
            return response.data.data;
        } catch (error: any) {
            console.error('Error adding comment:', error);
            notify.error(error?.response?.data?.message || 'Không thể thêm bình luận');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteComment = async (commentId: number) => {
        try {
            await commentsApi.deleteComment(commentId);
            mutate(); // Refresh comments
            notify.success('Đã xóa bình luận');
        } catch (error: any) {
            notify.error(error?.response?.data?.message || 'Không thể xóa bình luận');
            throw error;
        }
    };

    const loadMore = () => {
        setSize(size + 1);
    };

    return {
        comments,
        totalComments,
        isLoading: !data && !error,
        isError: error,
        isSubmitting,
        hasMore,
        isLoadingMore,
        addComment,
        deleteComment,
        loadMore,
        refresh: mutate
    };
}