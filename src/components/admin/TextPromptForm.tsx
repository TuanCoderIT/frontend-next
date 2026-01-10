'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TextPromptFormProps {
  onSubmit: (data: { prompt: string; numberOfQuestions: number }) => void;
  isLoading: boolean;
  isUserMode?: boolean;
}

interface FormData {
  prompt: string;
  numberOfQuestions: number;
}

export default function TextPromptForm({ onSubmit, isLoading, isUserMode = false }: TextPromptFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      prompt: '',
      numberOfQuestions: 5,
    },
  });

  const promptValue = watch('prompt');
  const numberOfQuestions = watch('numberOfQuestions');

  const examplePrompts = [
    "Tạo quiz về lịch sử Việt Nam thời kỳ phong kiến",
    "Tạo quiz về ngữ pháp tiếng Anh cơ bản",
    "Tạo quiz về toán học lớp 12 chương hàm số",
    "Tạo quiz về khoa học máy tính và lập trình",
  ];

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Prompt Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-lg font-semibold text-gray-900 mb-3">
              Mô tả nội dung quiz <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                {...register('prompt', { 
                  required: 'Vui lòng nhập mô tả nội dung quiz',
                  minLength: { value: 10, message: 'Mô tả phải có ít nhất 10 ký tự' }
                })}
                id="prompt"
                rows={6}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Ví dụ: Tạo quiz về lịch sử Việt Nam thời kỳ phong kiến, bao gồm các sự kiện quan trọng như khởi nghĩa Hai Bà Trưng, thời kỳ Bắc thuộc, các triều đại phong kiến và những nhân vật lịch sử nổi bật..."
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                {promptValue.length}/1000
              </div>
            </div>
            {errors.prompt && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.prompt.message}
              </p>
            )}
          </div>

          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Gợi ý chủ đề phổ biến:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const event = { target: { value: example } };
                    register('prompt').onChange(event);
                  }}
                  className="group text-left p-4 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:bg-blue-600 transition-colors"></div>
                    <span className="text-gray-700 group-hover:text-gray-900 leading-relaxed">{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Number of Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="numberOfQuestions" className="block text-lg font-semibold text-gray-900 mb-3">
              Số lượng câu hỏi
            </label>
            <div className="relative">
              <select
                {...register('numberOfQuestions', { 
                  required: 'Vui lòng chọn số lượng câu hỏi',
                  min: { value: 1, message: `Số câu hỏi phải từ 1-${isUserMode ? 20 : 50}` },
                  max: { value: isUserMode ? 20 : 50, message: `Số câu hỏi phải từ 1-${isUserMode ? 20 : 50}` }
                })}
                id="numberOfQuestions"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                disabled={isLoading}
              >
                {[...Array(isUserMode ? 20 : 50)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} câu hỏi
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.numberOfQuestions && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.numberOfQuestions.message}
              </p>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Thông tin</h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  {isUserMode 
                    ? 'User có thể tạo tối đa 20 câu hỏi. Thời gian tạo khoảng 30-60 giây.'
                    : 'Admin có thể tạo tối đa 50 câu hỏi. Thời gian tạo khoảng 1-2 phút.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isLoading || !promptValue.trim()}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Đang tạo quiz...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{isUserMode ? 'Gửi đề xuất' : 'Tạo'} {numberOfQuestions} câu hỏi</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}