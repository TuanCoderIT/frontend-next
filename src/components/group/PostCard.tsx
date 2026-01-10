"use client";

import { Post } from '@/types/public/group';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/admin/common/Avatar';
import ReactionButton, { ReactionType } from '@/components/common/SimpleReactionButton';
import CommentSection from '@/components/common/CommentSection';
import { formatRelativeTime } from '@/libs/dateFormat';
import { Share2, MoreVertical, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useReactions } from '@/hooks/useReactions';
import { useComments } from '@/hooks/useComments';
import { usePostRealtime } from '@/hooks/usePostRealtime';

interface PostCardProps {
    post: Post;
    onUpdatePost?: (updatedPost: Partial<Post>) => void;
}

export default function PostCard({ post, onUpdatePost }: PostCardProps) {
    const { user } = useAuth();
    const [showFullContent, setShowFullContent] = useState(false);
    
    // Ensure post has default reaction_summary
    const safePost = {
        ...post,
        reaction_summary: post.reaction_summary || {
            like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
        }
    };
    
    const [localPost, setLocalPost] = useState(safePost);
    
    const { addReaction, removeReaction } = useReactions();
    const { 
        comments, 
        totalComments, 
        isLoading: commentsLoading,
        addComment,
        loadMore,
        hasMore,
        isLoadingMore,
        refresh: refreshComments
    } = useComments(post.id);

    // Setup realtime listeners
    usePostRealtime(post.id, {
        onPostReacted: (data) => {
            if (data.post_id === post.id) {
                const updatedPost = {
                    ...localPost,
                    user_reaction: data.user_reaction,
                    reaction_summary: data.reaction_summary || {
                        like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
                    },
                    reactions_count: data.count || 0
                };
                setLocalPost(updatedPost);
                onUpdatePost?.(updatedPost);
            }
        },
        onCommentCreated: (data) => {
            if (data.post_id === post.id) {
                const updatedPost = {
                    ...localPost,
                    comments_count: data.count || localPost.comments_count
                };
                setLocalPost(updatedPost);
                onUpdatePost?.(updatedPost);
                refreshComments(); // Refresh comments list
            }
        }
    });

    const shouldTruncate = post.content && post.content.length > 200;

    const handleReact = async (reactionType: ReactionType) => {
        try {
            await addReaction('post', post.id, reactionType);
            
            // Optimistic update with safe guards
            const currentReactionSummary = localPost.reaction_summary || {
                like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
            };
            const newReactionSummary = { ...currentReactionSummary };
            
            // Remove old reaction if exists
            if (localPost.user_reaction && newReactionSummary[localPost.user_reaction as ReactionType] !== undefined) {
                newReactionSummary[localPost.user_reaction as ReactionType] = 
                    Math.max(0, newReactionSummary[localPost.user_reaction as ReactionType] - 1);
            }
            
            // Add new reaction
            if (newReactionSummary[reactionType] !== undefined) {
                newReactionSummary[reactionType] = newReactionSummary[reactionType] + 1;
            }
            
            const updatedPost = {
                ...localPost,
                user_reaction: reactionType,
                reaction_summary: newReactionSummary,
                reactions_count: Object.values(newReactionSummary).reduce((sum, count) => sum + (count || 0), 0)
            };
            
            setLocalPost(updatedPost);
            onUpdatePost?.(updatedPost);
        } catch (error) {
            console.error('Error reacting to post:', error);
        }
    };

    const handleRemoveReaction = async () => {
        try {
            await removeReaction('post', post.id);
            
            // Optimistic update with safe guards
            const currentReactionSummary = localPost.reaction_summary || {
                like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
            };
            const newReactionSummary = { ...currentReactionSummary };
            
            if (localPost.user_reaction && newReactionSummary[localPost.user_reaction as ReactionType] !== undefined) {
                newReactionSummary[localPost.user_reaction as ReactionType] = 
                    Math.max(0, newReactionSummary[localPost.user_reaction as ReactionType] - 1);
            }
            
            const updatedPost = {
                ...localPost,
                user_reaction: null,
                reaction_summary: newReactionSummary,
                reactions_count: Object.values(newReactionSummary).reduce((sum, count) => sum + (count || 0), 0)
            };
            
            setLocalPost(updatedPost);
            onUpdatePost?.(updatedPost);
        } catch (error) {
            console.error('Error removing reaction:', error);
        }
    };

    const handleAddComment = async (content: string, parentId?: number) => {
        try {
            await addComment(content, parentId);
            
            // Update comments count optimistically
            const updatedPost = {
                ...localPost,
                comments_count: localPost.comments_count + 1
            };
            setLocalPost(updatedPost);
            onUpdatePost?.(updatedPost);
        } catch (error) {
            console.error('Error adding comment:', error);
            // Don't update count if there was an error
        }
    };

    const handleReactToComment = async (commentId: number, reactionType: ReactionType) => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        
        try {
            await addReaction('comment', commentId, reactionType);
        } catch (error) {
            console.error('Error reacting to comment:', error);
        }
    };

    const handleRemoveCommentReaction = async (commentId: number) => {
        if (!user) {
            console.error('User not authenticated');
            return;
        }
        
        try {
            await removeReaction('comment', commentId);
        } catch (error) {
            console.error('Error removing comment reaction:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Avatar src={localPost.user.avatar} name={localPost.user.name} size="md" />
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            {localPost.user.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(localPost.created_at)}
                        </p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            {localPost.content && (
                <div className="mb-3">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                        {showFullContent || !shouldTruncate
                            ? localPost.content
                            : `${localPost.content.substring(0, 200)}...`}
                    </p>
                    {shouldTruncate && (
                        <button
                            onClick={() => setShowFullContent(!showFullContent)}
                            className="text-blue-600 dark:text-blue-400 text-sm mt-1 hover:underline"
                        >
                            {showFullContent ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    )}
                </div>
            )}

            {/* Attachments */}
            {localPost.attachments && localPost.attachments.length > 0 && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                    {localPost.attachments.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                    <ReactionButton
                        reactions={localPost.reaction_summary}
                        userReaction={localPost.user_reaction as ReactionType | null}
                        onReact={handleReact}
                        onRemoveReaction={handleRemoveReaction}
                    />
                </div>
                
                <div className="flex-1 flex justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>Bình luận</span>
                        {localPost.comments_count > 0 && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                                {localPost.comments_count}
                            </span>
                        )}
                    </button>
                </div>
                
                <div className="flex-1 flex justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Chia sẻ</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <CommentSection
                postId={localPost.id}
                comments={comments}
                commentsCount={totalComments || localPost.comments_count}
                isLoading={commentsLoading}
                onAddComment={handleAddComment}
                onReactToComment={handleReactToComment}
                onRemoveCommentReaction={handleRemoveCommentReaction}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
            />
        </div>
    );
}

