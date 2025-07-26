import { CircleX } from "lucide-react";

interface Props {
  label: string;
  name: string;
  type?: string;
  icon?: React.ReactNode;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormInput({
  label,
  name,
  type = "text",
  icon,
  value,
  error,
  onChange,
  placeholder,
  required,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex rounded-md shadow-sm border ${
          error ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"
        } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
      >
        {icon && (
          <span className="flex items-center pl-3 text-gray-500">{icon}</span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
        />
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-sm flex items-center">
          <CircleX className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}
