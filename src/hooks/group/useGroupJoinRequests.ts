import { useState } from 'react';
import useSWR from 'swr';
import { groupsApi } from '@/api/group';
import { GroupJoinRequest } from '@/types/public/group';
import { notify } from '@/utils/toast';

export function useGroupJoinRequests(groupId: number) {
    const { data, error, isLoading, mutate } = useSWR<GroupJoinRequest[]>(
        ['group-join-requests', groupId],
        () => groupsApi.getJoinRequests(groupId).then((res) => res.data),
        { revalidateOnFocus: true }
    );

    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const approveRequest = async (requestId: number) => {
        setIsApproving(true);
        try {
            await groupsApi.approveRequest(requestId);
            notify.success('Đã duyệt yêu cầu tham gia');
            mutate();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể duyệt yêu cầu');
            throw err;
        } finally {
            setIsApproving(false);
        }
    };

    const rejectRequest = async (requestId: number) => {
        setIsRejecting(true);
        try {
            await groupsApi.rejectRequest(requestId);
            notify.success('Đã từ chối yêu cầu');
            mutate();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể từ chối yêu cầu');
            throw err;
        } finally {
            setIsRejecting(false);
        }
    };

    return {
        requests: data || [],
        isLoading,
        isError: error,
        approveRequest,
        rejectRequest,
        isApproving,
        isRejecting,
        refresh: mutate,
    };
}

