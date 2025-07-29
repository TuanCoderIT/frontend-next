import { CircleX } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg shadow-sm border ${
          error ? "border-red-300" : "border-gray-300"
        } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <CircleX className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
