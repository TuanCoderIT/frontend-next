// components/form/AvatarInput.tsx

import { CircleUserRound, CircleX } from "lucide-react";

interface AvatarInputProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function AvatarInput({
  value,
  onChange,
  error,
}: AvatarInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file ?? null);
  };

  return (
    <div className="space-y-2 lg:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Avatar
      </label>
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
          {value && typeof value === "string" ? (
            <img
              src={`${value}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : value instanceof File ? (
            <img
              src={URL.createObjectURL(value)}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <CircleUserRound className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Choose Avatar
          </label>
          <input
            id="avatar-upload"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <p className="mt-1 pt-2 text-xs text-gray-500">
            PNG, JPG, GIF maximum 1MB
          </p>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-1 text-sm text-red-600 hover:text-red-800"
            >
              Clear Avatar
            </button>
          )}
        </div>
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
