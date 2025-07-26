import { CategoryFilterProps } from "@/types/public/category";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id} // ✔ key OK
            onClick={() => onCategoryChange(category.id)} // ✔ truyền id
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{category.name}</span>{" "}
              {/* ✔ hiển thị tên */}
              {selectedCategory === category.id && (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Difficulty Filter */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty</h3>
        <div className="space-y-2">
          {["All Levels", "Beginner", "Intermediate", "Advanced"].map(
            (level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked={level === "All Levels"}
                />
                <span className="ml-3 text-gray-700">{level}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration</h3>
        <div className="space-y-2">
          {["Any Duration", "< 30 min", "30-60 min", "> 60 min"].map(
            (duration) => (
              <label key={duration} className="flex items-center">
                <input
                  type="radio"
                  name="duration"
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  defaultChecked={duration === "Any Duration"}
                />
                <span className="ml-3 text-gray-700">{duration}</span>
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );
}
