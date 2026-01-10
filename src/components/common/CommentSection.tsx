"use client";

import { useState, useEffect } from 'react';
import { Comment } from '@/api/comments';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/admin/common/Avatar';
import ReactionButton, { ReactionType } from './ReactionButton';
import { formatRelativeTime } from '@/libs/dateFormat';
import { MessageCircle, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/libs/utils';

interface CommentSectionProps {
    postId: number;
    comments: Comment[];
    commentsCount: number;
    isLoading: boolean;
    onAddComment: (content: string, parentId?: number) => Promise<void>;
    onReactToComment: (commentId: number, reactionType: ReactionType) => Promise<void>;
    onRemoveCommentReaction: (commentId: number) => Promise<void>;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

interface CommentItemProps {
    comment: Comment;
    onReply: (content: string, parentId: number) => Promise<void>;
    onReact: (commentId: number, reactionType: ReactionType) => Promise<void>;
    onRemoveReaction: (commentId: number) => Promise<void>;
    level?: number;
}

function CommentItem({ comment, onReply, onReact, onRemoveReaction, level = 0 }: CommentItemProps) {
    const { user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await onReply(replyContent, comment.id);
            setReplyContent('');
            setShowReplyForm(false);
            setShowReplies(true);
        } catch (error) {
            console.error('Error replying to comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reactions = {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0
    };

    return (
        <div className={cn('flex gap-3', level > 0 && 'ml-8 mt-3')}>
            <Avatar src={comment.user?.avatar || undefined} name={comment.user?.name || 'User'} size="sm" />
            <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                    <div className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.user?.name || 'User'}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 text-sm mt-1">
                        {comment.content}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatRelativeTime(comment.created_at)}</span>
                    
                    {/* Comment Reactions */}
                    <ReactionButton
                        reactions={reactions}
                        userReaction={comment.user_reaction as ReactionType | null}
                        onReact={(reactionType) => onReact(comment.id, reactionType)}
                        onRemoveReaction={() => onRemoveReaction(comment.id)}
                        size="sm"
                    />

                    {user && level < 2 && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            Trả lời
                        </button>
                    )}

                    {comment.replies_count > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {showReplies ? (
                                <>
                                    <ChevronUp className="w-3 h-3" />
                                    Ẩn {comment.replies_count} phản hồi
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3 h-3" />
                                    Xem {comment.replies_count} phản hồi
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForm && user && (
                    <form onSubmit={handleReply} className="mt-2 flex gap-2">
                        <Avatar src={user.avatar || undefined} name={user.name || 'User'} size="sm" />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Viết phản hồi..."
                                className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !replyContent.trim()}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Replies */}
                {showReplies && comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                onReact={onReact}
                                onRemoveReaction={onRemoveReaction}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CommentSection({
    postId,
    comments,
    commentsCount,
    isLoading,
    onAddComment,
    onReactToComment,
    onRemoveCommentReaction,
    onLoadMore,
    hasMore,
    isLoadingMore
}: CommentSectionProps) {
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (content: string, parentId: number) => {
        await onAddComment(content, parentId);
    };

    if (!isExpanded) {
        return (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                        {commentsCount > 0 
                            ? `Xem ${commentsCount} bình luận`
                            : 'Thêm bình luận'
                        }
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {commentsCount > 0 ? `${commentsCount} bình luận` : 'Bình luận'}
                </span>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <ChevronUp className="w-4 h-4" />
                </button>
            </div>

            {/* Add Comment Form */}
            {user && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="flex gap-3">
                        <Avatar src={user.avatar || undefined} name={user.name || 'User'} size="sm" />
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Chưa có bình luận nào
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onReact={onReactToComment}
                            onRemoveReaction={onRemoveCommentReaction}
                        />
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center pt-2">
                            <button
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                            >
                                {isLoadingMore ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang tải...
                                    </span>
                                ) : (
                                    'Xem thêm bình luận'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}