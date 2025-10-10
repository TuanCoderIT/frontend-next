"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    showPageSizeDropdown?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

export default function Pagination({
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20],
    className,
    showPageSizeDropdown = true,
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize || 1));

    const safePage = clamp(currentPage, 1, totalPages);
    const canPrev = safePage > 1;
    const canNext = safePage < totalPages;

    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
    }
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const to = Math.min(totalItems, safePage * pageSize);

    return (
        <div className={className}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{from}</span> to{" "}
                    <span className="font-medium">{to}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                </div>

                <div className="flex items-center gap-3">
                    {showPageSizeDropdown && onPageSizeChange && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Rows per page</label>
                            <select
                                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={pageSize}
                                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            >
                                {pageSizeOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => canPrev && onPageChange(safePage - 1)}
                            disabled={!canPrev}
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {pages.map((p) => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${p === safePage
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                aria-current={p === safePage ? "page" : undefined}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            onClick={() => canNext && onPageChange(safePage + 1)}
                            disabled={!canNext}
                            className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



