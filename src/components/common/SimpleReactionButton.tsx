"use client";

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/libs/utils';

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

interface SimpleReactionButtonProps {
    reactions: Record<ReactionType, number>;
    userReaction: ReactionType | null;
    onReact: (reactionType: ReactionType) => void;
    onRemoveReaction: () => void;
    disabled?: boolean;
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
    like: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    love: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    haha: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    wow: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    sad: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
    angry: 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-900/20'
};

export default function SimpleReactionButton({
    reactions,
    userReaction,
    onReact,
    onRemoveReaction,
    disabled = false
}: SimpleReactionButtonProps) {
    const [showPicker, setShowPicker] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const containerRef = useRef<HTMLDivElement>(null);
    
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

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowPicker(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowPicker(false);
        }, 200);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main Reaction Button */}
            <button
                onClick={handleMainButtonClick}
                disabled={disabled}
                className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    userReaction
                        ? reactionColors[userReaction]
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span className="w-5 h-5 flex items-center justify-center">
                    {userReaction ? reactionEmojis[userReaction] : '👍'}
                </span>
                <span>
                    {userReaction ? reactionLabels[userReaction] : 'Thích'}
                </span>
                {totalReactions > 0 && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded-full">
                        {totalReactions}
                    </span>
                )}
            </button>

            {/* Reaction Picker */}
            {showPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1 z-50">
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

            {/* Reactions Summary - Show below button */}
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