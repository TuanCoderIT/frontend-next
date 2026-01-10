import { useEffect } from 'react';
import { useRealtime } from '@/context/RealtimeContext';
import { Post } from '@/types/public/group';

interface PostRealtimeEvents {
    onPostReacted?: (data: {
        post_id: number;
        reaction: string;
        action: 'added' | 'removed' | 'updated';
        count: number;
        reaction_summary: Record<string, number>;
        user_reaction: string | null;
    }) => void;
    onCommentCreated?: (data: {
        comment: any;
        post_id: number;
        count: number;
    }) => void;
    onCommentReacted?: (data: {
        comment_id: number;
        reaction: string;
        action: 'added' | 'removed' | 'updated';
        count: number;
    }) => void;
}

export function usePostRealtime(postId: number, events: PostRealtimeEvents) {
    const { echo, isConnected } = useRealtime();

    useEffect(() => {
        if (!echo || !isConnected || !postId) return;

        try {
            // Listen to post reactions
            const postChannel = echo.channel(`post.${postId}`);
            
            if (events.onPostReacted) {
                postChannel.listen('PostReacted', events.onPostReacted);
            }

            if (events.onCommentCreated) {
                postChannel.listen('CommentCreated', events.onCommentCreated);
            }

            if (events.onCommentReacted) {
                postChannel.listen('CommentReacted', events.onCommentReacted);
            }

            return () => {
                try {
                    echo.leaveChannel(`post.${postId}`);
                } catch (error) {
                    console.error('Error leaving channel:', error);
                }
            };
        } catch (error) {
            console.error('Error setting up realtime listeners:', error);
        }
    }, [echo, isConnected, postId, events]);
}

export function useGroupPostsRealtime(groupId: number, onPostUpdated?: (post: Post) => void) {
    const { echo, isConnected } = useRealtime();

    useEffect(() => {
        if (!echo || !isConnected) return;

        // Listen to group posts updates
        const groupChannel = echo.channel(`group.${groupId}`);
        
        if (onPostUpdated) {
            groupChannel.listen('PostCreated', (data: { post: Post }) => {
                onPostUpdated(data.post);
            });

            groupChannel.listen('PostUpdated', (data: { post: Post }) => {
                onPostUpdated(data.post);
            });
        }

        return () => {
            echo.leaveChannel(`group.${groupId}`);
        };
    }, [echo, isConnected, groupId, onPostUpdated]);
}