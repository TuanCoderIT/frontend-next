"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { useRouter } from "@lexz451/next-nprogress";
import { Quiz } from "@/types/admin/admin";

type QuizDifficulty = Quiz["difficulty"];
type QuizStatus = Quiz["status"];

export default function AddQuizPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner" as QuizDifficulty,
    duration: 30,
    passing_score: 70,
    max_attempts: 3,
    learning_objectives: [""],
    prerequisites: [""],
    tags: "",
    status: "draft" as QuizStatus,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Replace with actual API call
      console.log("Creating quiz:", formData);

      // Redirect back to quizzes page
      router.push("/admin/quizzes");
    } catch (error) {
      console.error("Error creating quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (
      name === "duration" ||
      name === "passing_score" ||
      name === "max_attempts"
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (
    field: "learning_objectives" | "prerequisites",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field: "learning_objectives" | "prerequisites") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "learning_objectives" | "prerequisites",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Quiz
            </h1>
            <p className="text-gray-600 mt-1">
              Design a new quiz for your students
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quiz title"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this quiz covers..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category *
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Programming, Mathematics"
                  />
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Difficulty Level *
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    required
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    required
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quiz Settings */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Quiz Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="passing_score"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Passing Score (%) *
                  </label>
                  <input
                    type="number"
                    id="passing_score"
                    name="passing_score"
                    required
                    min="0"
                    max="100"
                    value={formData.passing_score}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max_attempts"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Maximum Attempts *
                  </label>
                  <input
                    type="number"
                    id="max_attempts"
                    name="max_attempts"
                    required
                    min="1"
                    value={formData.max_attempts}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="javascript, programming, web (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Learning Objectives
              </h2>
              <div className="space-y-3">
                {formData.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) =>
                        handleArrayChange(
                          "learning_objectives",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter learning objective"
                    />
                    {formData.learning_objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("learning_objectives", index)
                        }
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("learning_objectives")}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Learning Objective</span>
                </button>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Prerequisites
              </h2>
              <div className="space-y-3">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) =>
                        handleArrayChange(
                          "prerequisites",
                          index,
                          e.target.value
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter prerequisite"
                    />
                    {formData.prerequisites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("prerequisites", index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem("prerequisites")}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Prerequisite</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                <span>{isSubmitting ? "Creating..." : "Create Quiz"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
