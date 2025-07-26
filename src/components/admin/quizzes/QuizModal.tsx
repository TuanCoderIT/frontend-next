"use client";

import { useState, useEffect } from "react";
import { Quiz } from "@/types/admin/admin";

interface QuizModalProps {
  quiz: Quiz | null;
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSave: (quizData: Partial<Quiz>) => void;
}

export default function QuizModal({
  quiz,
  mode,
  isOpen,
  onClose,
  onSave,
}: QuizModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Programming",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    duration: 30,
    total_questions: 10,
    learning_objectives: [""],
    prerequisites: [""],
    tags: [""],
    passing_score: 70,
    max_attempts: 3,
    estimated_time: "",
    color: "#3B82F6",
    status: "draft" as "draft" | "published" | "archived",
  });

  useEffect(() => {
    if (quiz && mode === "edit") {
      setFormData({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        total_questions: quiz.total_questions,
        learning_objectives: quiz.learning_objectives,
        prerequisites: quiz.prerequisites,
        tags: quiz.tags,
        passing_score: quiz.passing_score,
        max_attempts: quiz.max_attempts,
        estimated_time: quiz.estimated_time,
        color: quiz.color,
        status: quiz.status,
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        category: "Programming",
        difficulty: "Beginner",
        duration: 30,
        total_questions: 10,
        learning_objectives: [""],
        prerequisites: [""],
        tags: [""],
        passing_score: 70,
        max_attempts: 3,
        estimated_time: "",
        color: "#3B82F6",
        status: "draft",
      });
    }
  }, [quiz, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      learning_objectives: formData.learning_objectives.filter(
        (obj) => obj.trim() !== ""
      ),
      prerequisites: formData.prerequisites.filter((req) => req.trim() !== ""),
      tags: formData.tags.filter((tag) => tag.trim() !== ""),
    };

    onSave(cleanedData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleArrayChange = (
    field: "learning_objectives" | "prerequisites" | "tags",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "learning_objectives" | "prerequisites" | "tags"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "learning_objectives" | "prerequisites" | "tags",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Create New Quiz" : "Edit Quiz"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quiz title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quiz description"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Programming">Programming</option>
                <option value="Database">Database</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Total Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Questions *
              </label>
              <input
                type="number"
                name="total_questions"
                value={formData.total_questions}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%) *
              </label>
              <input
                type="number"
                name="passing_score"
                value={formData.passing_score}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Max Attempts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attempts *
              </label>
              <input
                type="number"
                name="max_attempts"
                value={formData.max_attempts}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Learning Objectives
            </label>
            {formData.learning_objectives.map((objective, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter learning objective"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("learning_objectives", index)}
                  className="text-red-600 hover:text-red-800"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("learning_objectives")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Learning Objective
            </button>
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={prerequisite}
                  onChange={(e) =>
                    handleArrayChange("prerequisites", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter prerequisite"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("prerequisites", index)}
                  className="text-red-600 hover:text-red-800"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("prerequisites")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Prerequisite
            </button>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    handleArrayChange("tags", index, e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tag"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("tags", index)}
                  className="text-red-600 hover:text-red-800"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("tags")}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Tag
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors duration-200"
            >
              {mode === "create" ? "Create Quiz" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
