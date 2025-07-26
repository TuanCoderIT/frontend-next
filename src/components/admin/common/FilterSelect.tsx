"use client";

interface FilterSelectProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function FilterSelect({
  label,
  value = "",
  onChange,
  onSelect,
  options,
  placeholder = "All",
}: FilterSelectProps) {
  const handleChange = (newValue: string) => {
    if (onChange) onChange(newValue);
    if (onSelect) onSelect(newValue);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200 text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
