"use client";

import { Suspense, use } from 'react';
import GroupDetail from '@/components/group/GroupDetail';
import Loading from '@/components/common/LoadingScreen';

interface GroupDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

function GroupDetailContent({ slug }: { slug: string }) {
    return <GroupDetail slug={slug} />;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
    const { slug } = use(params);
    
    return (
        <Suspense
            fallback={
                <div className="min-h-screen">
                    <Loading text="Đang tải..." />
                </div>
            }
        >
            <GroupDetailContent slug={slug} />
        </Suspense>
    );
}

