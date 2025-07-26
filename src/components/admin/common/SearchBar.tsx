"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  value = "",
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Real-time search with debounce would be better in production
    onSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none text-gray-500">
          <Search />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                   bg-white text-gray-900 placeholder-gray-500 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
