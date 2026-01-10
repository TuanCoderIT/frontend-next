export interface User {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
}

export interface Group {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    cover_image: string | null;
    members_count: number;
    posts_count?: number;
    owner_id: number;
    visibility: 'public' | 'private';
    created_at: string;
    updated_at: string;
    owner?: User;
}

export interface GroupDetail extends Group {
    members: GroupMember[];
}

export interface GroupMember {
    id: number;
    group_id: number;
    user_id: number;
    role: 'owner' | 'admin' | 'member';
    user: User;
}

export interface GroupJoinRequest {
    id: number;
    group_id: number;
    user_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    user: User;
}

export interface Post {
    id: number;
    user_id: number;
    content: string | null;
    attachments: string[] | null;
    group_id: number | null;
    is_pinned: boolean;
    is_hidden?: boolean;
    visibility: 'public' | 'private' | 'group_only';
    created_at: string;
    updated_at: string;
    user: User;
    comments_count: number;
    reactions_count: number;
    user_reaction: string | null;
    reaction_summary: {
        like: number;
        love: number;
        haha: number;
        wow: number;
        sad: number;
        angry: number;
    };
    reactions?: Array<{
        id: number;
        user_id: number;
        reaction_type: string;
    }>;
}

export interface CreateGroupRequest {
    name: string;
    description?: string;
    cover_image?: string;
    visibility: 'public' | 'private';
}

export interface UpdateGroupRequest {
    description?: string;
    cover_image?: string;
    visibility?: 'public' | 'private';
}

export interface CreatePostRequest {
    content?: string;
    attachments?: string[];
    group_id: number;
    visibility?: 'public' | 'private' | 'group_only';
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface MembershipStatus {
    is_member: boolean;
    role: 'owner' | 'admin' | 'member' | null;
    is_owner: boolean;
    has_pending_request: boolean;
}