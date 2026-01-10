"use client";

import { REACTION_EMOJIS, REACTION_TYPES } from "@/libs/reactions";
import type { ReactionType } from "@/types/public/chat-type";

interface ReactionPickerProps {
    onSelect: (reactionType: ReactionType) => void;
    onClose: () => void;
}

export default function ReactionPicker({
    onSelect,
    onClose,
}: ReactionPickerProps) {
    return (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-1 z-10">
            {REACTION_TYPES.map((type) => (
                <button
                    key={type}
                    onClick={() => {
                        onSelect(type);
                        onClose();
                    }}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={type}
                >
                    {REACTION_EMOJIS[type]}
                </button>
            ))}
        </div>
    );
}

