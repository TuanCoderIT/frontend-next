"use client";

import { useState } from "react";
import { formatMessageTime } from "@/libs/dateFormat";
import { REACTION_EMOJIS } from "@/libs/reactions";
import Avatar from "@/components/admin/common/Avatar";
import AttachmentPreview from "./AttachmentPreview";
import ReactionPicker from "./ReactionPicker";
import type { MessageBubbleProps } from "@/types/public/chat-type";
import { Smile } from "lucide-react";

export default function MessageBubble({
    message,
    isOwn,
    showAvatar,
    showName,
    onReact,
    currentUserId,
}: MessageBubbleProps) {
    const [showReactionPicker, setShowReactionPicker] = useState(false);

    const userReaction = message.reactions?.find(
        (r) => r.user_id === currentUserId
    );

    return (
        <div
            className={`
        flex gap-2 px-4 py-2 group hover:bg-gray-50/50 dark:hover:bg-gray-800/50
        ${isOwn ? "flex-row-reverse" : ""}
      `}
        >
            {/* Avatar */}
            {showAvatar && !isOwn && (
                <div className="flex-shrink-0">
                    <Avatar name={message.user.name} size="sm" />
                </div>
            )}
            {showAvatar && isOwn && <div className="flex-shrink-0 w-8" />}

            {/* Message Content */}
            <div
                className={`
          flex flex-col max-w-[70%] md:max-w-[60%]
          ${isOwn ? "items-end" : "items-start"}
        `}
            >
                {/* Name (only for other users' messages) */}
                {showName && !isOwn && (
                    <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 px-1">
                        {message.user.name}
                    </span>
                )}

                {/* Bubble */}
                <div className="relative">
                    <div
                        className={`
              rounded-2xl px-4 py-2 break-words
              ${isOwn
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }
            `}
                    >
                        {/* Text Content */}
                        {message.content && (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}

                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2">
                                <AttachmentPreview attachments={message.attachments} />
                            </div>
                        )}

                        {/* Timestamp */}
                        <div
                            className={`
                text-xs mt-1
                ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}
              `}
                        >
                            {formatMessageTime(message.created_at)}
                        </div>
                    </div>

                    {/* Reaction Button */}
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={`
              absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity
              ${isOwn ? "-left-2" : "-right-2"}
              p-1 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700
            `}
                        aria-label="Add reaction"
                    >
                        <Smile className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Reaction Picker */}
                    {showReactionPicker && (
                        <div className="absolute bottom-full mb-2 left-0">
                            <ReactionPicker
                                onSelect={(reactionType) => {
                                    if (userReaction?.reaction_type === reactionType) {
                                        // Toggle: remove reaction if same
                                        onReact(reactionType); // This should handle toggle in parent
                                    } else {
                                        onReact(reactionType);
                                    }
                                    setShowReactionPicker(false);
                                }}
                                onClose={() => setShowReactionPicker(false)}
                            />
                        </div>
                    )}
                </div>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                        {Object.entries(
                            message.reactions.reduce(
                                (acc, reaction) => {
                                    const type = reaction.reaction_type as keyof typeof REACTION_EMOJIS;
                                    if (REACTION_EMOJIS[type]) {
                                        acc[type] = (acc[type] || 0) + 1;
                                    }
                                    return acc;
                                },
                                {} as Record<string, number>
                            )
                        ).map(([type, count]) => (
                            <button
                                key={type}
                                onClick={() => onReact(type)}
                                className={`
                  flex items-center gap-1 px-2 py-0.5 rounded-full text-xs
                  border border-gray-300 dark:border-gray-600
                  ${userReaction?.reaction_type === type
                                        ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }
                `}
                            >
                                <span>{REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]}</span>
                                <span>{count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

