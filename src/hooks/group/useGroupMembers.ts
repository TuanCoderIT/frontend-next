import { useState } from 'react';
import useSWR from 'swr';
import { groupsApi } from '@/api/group';
import { GroupMember } from '@/types/public/group';
import { notify } from '@/utils/toast';

interface UseGroupMembersParams {
    role?: 'owner' | 'admin' | 'member';
    search?: string;
}

export function useGroupMembers(groupId: number, params?: UseGroupMembersParams) {
    const { data, error, isLoading, mutate } = useSWR<GroupMember[]>(
        ['group-members', groupId, params],
        () => groupsApi.getMembers(groupId, params).then((res) => res.data)
    );

    const [isKicking, setIsKicking] = useState(false);
    const [isPromoting, setIsPromoting] = useState(false);
    const [isDemoting, setIsDemoting] = useState(false);

    const kickMember = async (userId: number) => {
        setIsKicking(true);
        try {
            await groupsApi.kickMember(groupId, userId);
            notify.success('Đã xóa thành viên khỏi nhóm');
            mutate();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể xóa thành viên');
            throw err;
        } finally {
            setIsKicking(false);
        }
    };

    const promoteMember = async (userId: number) => {
        setIsPromoting(true);
        try {
            await groupsApi.promoteMember(groupId, userId);
            notify.success('Đã thăng cấp thành admin');
            mutate();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể thăng cấp');
            throw err;
        } finally {
            setIsPromoting(false);
        }
    };

    const demoteMember = async (userId: number) => {
        setIsDemoting(true);
        try {
            await groupsApi.demoteMember(groupId, userId);
            notify.success('Đã hạ cấp về thành viên');
            mutate();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể hạ cấp');
            throw err;
        } finally {
            setIsDemoting(false);
        }
    };

    return {
        members: data || [],
        isLoading,
        isError: error,
        kickMember,
        promoteMember,
        demoteMember,
        isKicking,
        isPromoting,
        isDemoting,
        refresh: mutate,
    };
}

