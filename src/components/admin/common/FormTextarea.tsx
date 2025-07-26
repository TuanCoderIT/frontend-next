import { TextareaHTMLAttributes } from "react";
import { CircleX, MessageSquareText } from "lucide-react";

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
}

export default function FormTextarea({
  label,
  required,
  icon = <MessageSquareText className="h-5 w-5" />,
  error,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex rounded-md shadow-sm border ${
          error ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"
        } focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500`}
      >
        <span className="flex select-none items-start pl-3 pt-2 text-gray-500 sm:text-sm">
          {icon}
        </span>
        <textarea
          rows={4}
          className={`block flex-1 border-0 bg-transparent py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm resize-none ${className}`}
          {...props}
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
