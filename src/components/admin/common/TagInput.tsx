import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  label: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  className?: string;
  maxItems?: number;
  required?: boolean;
  disabled?: boolean;
  tagClassName?: string;
  inputClassName?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  items = [],
  onItemsChange,
  placeholder,
  className = "",
  maxItems,
  required = false,
  disabled = false,
  tagClassName = "",
  inputClassName = "",
}) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    const trimmedItem = newItem.trim();
    if (trimmedItem && !items.includes(trimmedItem)) {
      if (!maxItems || items.length < maxItems) {
        onItemsChange([...items, trimmedItem]);
        setNewItem("");
      }
    }
  };

  const removeItem = (index: number) => {
    if (!disabled) {
      onItemsChange(items.filter((_, i) => i !== index));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  const isMaxReached = maxItems && items.length >= maxItems;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {maxItems && (
          <span className="text-gray-500 text-xs ml-2">
            ({items.length}/{maxItems})
          </span>
        )}
      </label>

      {/* Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
        {items.length === 0 ? (
          <span className="text-gray-400 text-sm italic">
            No {label.toLowerCase()} added yet
          </span>
        ) : (
          items.map((item, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 ${tagClassName} ${
                disabled ? "opacity-50" : ""
              }`}
            >
              {item}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label={`Remove ${item}`}
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Input Section */}
      {!isMaxReached && !disabled && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${inputClassName}`}
            placeholder={placeholder || `Add ${label.toLowerCase()}`}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={addItem}
            disabled={!newItem.trim() || disabled}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Add ${label.toLowerCase()}`}
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {/* Max Items Warning */}
      {isMaxReached && (
        <p className="text-sm text-amber-600 mt-2">
          Maximum number of {label.toLowerCase()} reached ({maxItems})
        </p>
      )}
    </div>
  );
};

export default TagInput;
