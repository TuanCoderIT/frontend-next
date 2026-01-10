"use client";

import { useState } from 'react';
import { FileText, Users, MessageCircle } from 'lucide-react';

type TabType = 'posts' | 'members' | 'chat';

interface GroupTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    postsCount?: number;
    membersCount?: number;
}

export default function GroupTabs({
    activeTab,
    onTabChange,
    postsCount,
    membersCount,
}: GroupTabsProps) {
    const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; count?: number }> = [
        {
            id: 'posts',
            label: 'Bài viết',
            icon: <FileText className="w-5 h-5" />,
            count: postsCount,
        },
        {
            id: 'members',
            label: 'Thành viên',
            icon: <Users className="w-5 h-5" />,
            count: membersCount,
        },
        {
            id: 'chat',
            label: 'Chat',
            icon: <MessageCircle className="w-5 h-5" />,
        },
    ];

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {tab.count !== undefined && (
                                <span
                                    className={`
                                        ml-2 py-0.5 px-2 rounded-full text-xs
                                        ${activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }
                                    `}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

