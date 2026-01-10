import { CircleX, Tag, Hash, Palette, Loader } from "lucide-react";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";

interface CategoryFormProps {
    formData: {
        name: string;
        slug: string;
        color: string;
        is_active: boolean;
    };
    errors: Record<string, string>;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    setFormData: React.Dispatch<
        React.SetStateAction<{
            name: string;
            slug: string;
            color: string;
            is_active: boolean;
        }>
    >;
    isEditMode?: boolean;
}

export default function CategoryForm({
    formData,
    errors,
    isSubmitting,
    onSubmit,
    handleChange,
    setFormData,
    isEditMode = false,
}: CategoryFormProps) {
    // Auto-generate slug from name (only in add mode and when slug is empty)
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: isEditMode || prev.slug ? prev.slug : generateSlug(name),
        }));
    };

    // Generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    };

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
                        {/* Name field */}
                        <FormInput
                            label="Category Name"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            error={errors.name}
                            icon={<Tag className="h-5 w-5" />}
                            placeholder="e.g., Programming"
                            required
                        />
                        {/* Slug field */}
                        <FormInput
                            label="Slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            error={errors.slug}
                            icon={<Hash className="h-5 w-5" />}
                            placeholder="e.g., programming"
                            required
                        />
                        {/* Color field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color <span className="text-gray-400">(optional)</span>
                            </label>
                            <div className="flex items-center space-x-3">
                                <div
                                    className="flex rounded-lg shadow-sm border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
                                >
                                    <span className="flex items-center pl-3 text-gray-500">
                                        <Palette className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="color"
                                        name="color"
                                        value={formData.color || "#3b82f6"}
                                        onChange={handleChange}
                                        className="block flex-1 border-0 bg-transparent py-2.5 px-3 h-12 cursor-pointer focus:ring-0 sm:text-sm"
                                    />
                                </div>
                                <FormInput
                                    label=""
                                    name="color"
                                    value={formData.color || ""}
                                    onChange={handleChange}
                                    error={errors.color}
                                    placeholder="#3b82f6"
                                    required={false}
                                />
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <CircleX className="h-4 w-4 mr-1" />
                                    {errors.color}
                                </p>
                            )}
                        </div>
                        {/* Status field */}
                        <FormSelect
                            label="Status"
                            name="is_active"
                            value={formData.is_active ? "true" : "false"}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    is_active: e.target.value === "true",
                                }))
                            }
                            error={errors.is_active}
                            required
                            options={[
                                { label: "Active", value: "true" },
                                { label: "Inactive", value: "false" },
                            ]}
                        />
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2.5 cursor-pointer text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSubmitting
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
                                "Update Category"
                            ) : (
                                "Save Category"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

