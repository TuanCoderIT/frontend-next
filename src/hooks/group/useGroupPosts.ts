import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { postsApi } from '@/api/post';
import { Post, PaginatedResponse } from '@/types/public/group';

export function useGroupPosts(groupId: number) {
  const getKey = (pageIndex: number, previousPageData: PaginatedResponse<Post> | null) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return ['group-posts', groupId, pageIndex + 1];
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite<PaginatedResponse<Post>>(
    getKey,
    ([, , page]) => postsApi.getGroupPosts(groupId, page).then((res) => res.data)
  );

  const posts = data ? data.flatMap((page) => page.data) : [];
  const isLoadingMore = size > 0 && data && typeof data[size - 1] === 'undefined';
  const hasMore = data
    ? data[data.length - 1].current_page < data[data.length - 1].last_page
    : false;

  const createPost = async (content: string, attachments?: string[]) => {
    try {
      const response = await postsApi.createPost({
        content,
        attachments,
        group_id: groupId,
      });
      mutate(); // Refresh posts
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    posts,
    isLoading: !data && !error,
    isError: error,
    loadMore: () => setSize(size + 1),
    hasMore,
    isLoadingMore,
    createPost,
    refresh: mutate,
  };
}