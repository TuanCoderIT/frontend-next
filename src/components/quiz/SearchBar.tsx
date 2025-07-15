"use client";

import { useState, useRef } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePopularClick = (term: string) => {
    onSearchChange(term);
    inputRef.current?.blur(); // Tắt suggestion box ngay
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search quizzes by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
      </div>

      {isFocused && searchTerm === "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-10">
          <div className="text-sm text-gray-600 mb-2">Popular searches:</div>
          <div className="flex flex-wrap gap-2">
            {["JavaScript", "React", "Mathematics", "Physics", "Grammar"].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => handlePopularClick(term)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
