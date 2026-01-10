"use client";

import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface PurchaseHeaderProps {
    title?: string;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    className?: string;
    rightSlot?: ReactNode;
}

export default function PurchaseHeader({
    title = "Lịch sử mua hàng",
    searchQuery,
    onSearchChange,
    className,
    rightSlot,
}: PurchaseHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                className
            )}
        >
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-1">Xem và quản lý nội dung đã mua</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                {rightSlot}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        type="text"
                        placeholder="Tìm kiếm mua hàng..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}


