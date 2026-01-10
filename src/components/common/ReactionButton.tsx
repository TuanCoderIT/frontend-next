"use client";

import { useState } from 'react';
import { cn } from '@/libs/utils';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

interface ReactionButtonProps {
    reactions: Record<ReactionType, number>;
    userReaction: ReactionType | null;
    onReact: (reactionType: ReactionType) => void;
    onRemoveReaction: () => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const reactionEmojis: Record<ReactionType, string> = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
};

const reactionLabels: Record<ReactionType, string> = {
    like: 'Thích',
    love: 'Yêu thích',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Buồn',
    angry: 'Giận dữ'
};

const reactionColors: Record<ReactionType, string> = {
    like: 'text-blue-600 dark:text-blue-400',
    love: 'text-red-600 dark:text-red-400',
    haha: 'text-yellow-600 dark:text-yellow-400',
    wow: 'text-orange-600 dark:text-orange-400',
    sad: 'text-gray-600 dark:text-gray-400',
    angry: 'text-red-700 dark:text-red-500'
};

export default function ReactionButton({
    reactions,
    userReaction,
    onReact,
    onRemoveReaction,
    disabled = false,
    size = 'md'
}: ReactionButtonProps) {
    const [showPicker, setShowPicker] = useState(false);
    
    // Safe guard for reactions object
    const safeReactions = reactions || {
        like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0
    };
    
    const totalReactions = Object.values(safeReactions).reduce((sum, count) => sum + (count || 0), 0);

    const handleReactionClick = (reactionType: ReactionType) => {
        if (userReaction === reactionType) {
            onRemoveReaction();
        } else {
            onReact(reactionType);
        }
        setShowPicker(false);
    };

    const handleMainButtonClick = () => {
        if (userReaction) {
            onRemoveReaction();
        } else {
            onReact('like');
        }
    };

    const sizeClasses = {
        sm: 'text-sm px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div className="relative">
            {/* Main Reaction Button */}
            <div className="flex items-center gap-1">
                <div 
                    className="relative"
                    onMouseEnter={() => setShowPicker(true)}
                    onMouseLeave={() => setShowPicker(false)}
                >
                    <button
                        onClick={handleMainButtonClick}
                        disabled={disabled}
                        className={cn(
                            'flex items-center gap-2 rounded-lg font-medium transition-all duration-200',
                            sizeClasses[size],
                            userReaction
                                ? `${reactionColors[userReaction]} bg-gray-100 dark:bg-gray-700`
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                            disabled && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        <span className={iconSizes[size]}>
                            {userReaction ? reactionEmojis[userReaction] : '👍'}
                        </span>
                        <span>
                            {userReaction ? reactionLabels[userReaction] : 'Thích'}
                        </span>
                    </button>

                    {/* Reaction Picker */}
                    {showPicker && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1 z-10">
                            {Object.entries(reactionEmojis).map(([type, emoji]) => (
                                <button
                                    key={type}
                                    onClick={() => handleReactionClick(type as ReactionType)}
                                    className={cn(
                                        'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110',
                                        userReaction === type && 'bg-gray-100 dark:bg-gray-700 scale-110'
                                    )}
                                    title={reactionLabels[type as ReactionType]}
                                >
                                    <span className="text-xl">{emoji}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Reactions Count */}
                {totalReactions > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {totalReactions}
                    </span>
                )}
            </div>

            {/* Reactions Summary - Show top 3 reactions */}
            {totalReactions > 0 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {Object.entries(safeReactions)
                        .filter(([, count]) => (count || 0) > 0)
                        .sort(([, a], [, b]) => (b || 0) - (a || 0))
                        .slice(0, 3)
                        .map(([type, count]) => (
                            <span key={type} className="flex items-center gap-0.5">
                                <span>{reactionEmojis[type as ReactionType]}</span>
                                <span>{count || 0}</span>
                            </span>
                        ))}
                </div>
            )}
        </div>
    );
}