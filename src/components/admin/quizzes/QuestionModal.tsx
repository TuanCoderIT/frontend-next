"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types/admin/admin";

interface QuestionModalProps {
  question: Question | null;
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Partial<Question>) => void;
}

export default function QuestionModal({
  question,
  mode,
  isOpen,
  onClose,
  onSave,
}: QuestionModalProps) {
  const [formData, setFormData] = useState({
    question_text: "",
    type: "multiple_choice" as
      | "multiple_choice"
      | "true_false"
      | "short_answer"
      | "essay",
    options: ["", "", "", ""],
    correct_answers: [""],
    explanation: "",
    points: 1,
  });

  useEffect(() => {
    if (question && mode === "edit") {
      setFormData({
        question_text: question.question_text,
        type: question.type,
        options: question.options || ["", "", "", ""],
        correct_answers: question.correct_answers,
        explanation: question.explanation || "",
        points: question.points,
      });
    } else {
      // Reset form for create mode
      setFormData({
        question_text: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correct_answers: [""],
        explanation: "",
        points: 1,
      });
    }
  }, [question, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up data based on question type
    let cleanedData: Partial<Question> = { ...formData };

    if (formData.type === "true_false") {
      cleanedData.options = ["True", "False"];
    } else if (formData.type === "short_answer" || formData.type === "essay") {
      cleanedData.options = [];
    } else {
      // Multiple choice - filter out empty options
      cleanedData.options = formData.options.filter(
        (option) => option.trim() !== ""
      );
    }

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

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? value : option)),
    }));
  };

  const handleCorrectAnswerChange = (value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      correct_answers: checked
        ? [...prev.correct_answers, value]
        : prev.correct_answers.filter((answer) => answer !== value),
    }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correct_answers: prev.correct_answers.filter(
        (answer) => answer !== prev.options[index]
      ),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "create" ? "Add New Question" : "Edit Question"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === "create"
                ? "Create a new question for your quiz"
                : "Modify the existing question details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200"
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Question Text *
              </label>
              <textarea
                name="question_text"
                value={formData.question_text}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Question Type & Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Question Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="essay">Essay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Points *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Options for Multiple Choice */}
            {formData.type === "multiple_choice" && (
              <div className="bg-gray-50 rounded-xl p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Answer Options *
                </label>
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.correct_answers.includes(option)}
                          onChange={(e) =>
                            handleCorrectAnswerChange(option, e.target.checked)
                          }
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-3 text-sm font-medium text-gray-700">
                          Correct
                        </label>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                        />
                      </div>
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
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
                      )}
                    </div>
                  ))}

                  {formData.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Option
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* True/False Options */}
            {formData.type === "true_false" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="true"
                      name="correct_answer"
                      value="True"
                      checked={formData.correct_answers.includes("True")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          correct_answers: [e.target.value],
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="true"
                      className="ml-2 text-sm text-gray-700"
                    >
                      True
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="false"
                      name="correct_answer"
                      value="False"
                      checked={formData.correct_answers.includes("False")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          correct_answers: [e.target.value],
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="false"
                      className="ml-2 text-sm text-gray-700"
                    >
                      False
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Short Answer/Essay Correct Answer */}
            {(formData.type === "short_answer" ||
              formData.type === "essay") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === "short_answer"
                    ? "Correct Answer(s)"
                    : "Sample Answer/Keywords"}
                </label>
                <textarea
                  value={formData.correct_answers.join("\n")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      correct_answers: e.target.value
                        .split("\n")
                        .filter((answer) => answer.trim() !== ""),
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    formData.type === "short_answer"
                      ? "Enter possible correct answers (one per line)"
                      : "Enter sample answer or keywords for evaluation"
                  }
                />
              </div>
            )}

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points *
              </label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Explanation (Optional)
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Provide an explanation for the correct answer..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
              >
                {mode === "create" ? "Add Question" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
