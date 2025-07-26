import {
  CircleUserRound,
  CircleX,
  Mail,
  LockKeyhole,
  Phone,
  BadgeInfo,
  Loader,
} from "lucide-react";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import AvatarInput from "../common/AvatarInput";

interface UserFormProps {
  formData: any;
  errors: any;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isEditMode?: boolean;
}

export default function UserForm({
  formData,
  errors,
  isSubmitting,
  onSubmit,
  handleChange,
  setFormData,
  isEditMode = false,
}: UserFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        {errors.form && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <CircleX className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">An Error occurs</p>
              <p className="text-red-600">{errors.form}</p>
            </div>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Avatar field */}
            <AvatarInput
              value={formData.avatar}
              onChange={(file) =>
                setFormData((prev: any) => ({ ...prev, avatar: file }))
              }
              error={errors.avatar}
            />
            {/* Fullname field */}
            <FormInput
              label="Fullname"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={<CircleUserRound className="h-5 w-5" />}
              placeholder="Nguyen Van A"
              required
            />
            {/* Email field */}
            {!isEditMode && (
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5" />}
                placeholder="email@example.com"
                required
                disabled={isEditMode}
              />
            )}
            {/* Role field */}
            <FormSelect
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={errors.role}
              required
              options={[
                { label: "Admin", value: "admin" },
                { label: "Editor", value: "editor" },
                { label: "User", value: "user" },
              ]}
            />
            {/* Phone field */}
            <FormInput
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon={<Phone className="h-5 w-5" />}
              placeholder="+84 123 456 789"
              required={false}
            />
            {/* Status field */}
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={errors.status}
              required
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Banned", value: "banned" },
              ]}
            />
            {!isEditMode && (
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<LockKeyhole className="h-5 w-5" />}
                placeholder="••••••"
                required
              />
            )}
          </div>

          {/* Tips section */}
          {!isEditMode && (
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <BadgeInfo />
                <span className="font-medium">Important Information!</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  All fields marked <span className="text-red-500">*</span> are
                  required.
                </li>
                <li>The password must have at least 6 characters.</li>
                <li>Email will be used to recover passwords.</li>
              </ul>
            </div>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 cursor-pointer text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "transform transition hover:-translate-y-1"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader className="animate-spin ml-1 mr-2 h-4 w-4 text-white" />
                  Saving...
                </div>
              ) : isEditMode ? (
                "Update User"
              ) : (
                "Save User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
