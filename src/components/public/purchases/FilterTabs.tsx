"use client";

import { cn } from "@/utils/cn";

type TabKey = "all" | "quiz" | "course" | "video" | "document";

interface FilterTabsProps {
    active: TabKey;
    onChange: (tab: TabKey) => void;
    className?: string;
}

const tabs: { key: TabKey; label: string; color?: string; soon?: boolean }[] = [
    { key: "all", label: "All" },
    { key: "quiz", label: "Quizzes", color: "text-blue-600" },
    { key: "course", label: "Courses", color: "text-green-600", soon: true },
    { key: "video", label: "Videos", color: "text-purple-600", soon: true },
    { key: "document", label: "Documents", color: "text-orange-600", soon: true },
];

export default function FilterTabs({ active, onChange, className }: FilterTabsProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 overflow-x-auto no-scrollbar",
                className
            )}
        >
            {tabs.map((t) => {
                const isActive = active === t.key;
                return (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        className={cn(
                            "px-4 py-2 rounded-full border transition-all text-sm whitespace-nowrap",
                            isActive
                                ? "bg-gray-900 text-white border-gray-900 shadow"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                            t.color
                        )}
                    >
                        <span>{t.label}</span>
                        {t.soon && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Soon</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}


