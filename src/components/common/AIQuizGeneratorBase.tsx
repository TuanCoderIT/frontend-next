'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AIQuizFormData, AIQuizResponse, UserQuizSubmission } from '@/types/public/exams';
import { getErrorMessage } from '@/utils/errorMessages';
import TextPromptForm from '../admin/TextPromptForm';
import FileUploadForm from '../admin/FileUploadForm';

interface AIQuizGeneratorBaseProps {
  title: string;
  subtitle: string;
  isUserMode?: boolean;
  onTextGeneration: (data: { prompt: string; numberOfQuestions: number }) => Promise<any>;
  onFileGeneration: (data: { file: File; numberOfQuestions: number }) => Promise<any>;
  onPreview: (quiz: AIQuizResponse | UserQuizSubmission) => void;
  successMessage?: string;
}

export default function AIQuizGeneratorBase({
  title,
  subtitle,
  isUserMode = false,
  onTextGeneration,
  onFileGeneration,
  onPreview,
  successMessage = 'Quiz được tạo thành công!'
}: AIQuizGeneratorBaseProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AIQuizFormData>({
    defaultValues: {
      mode: 'text',
      numberOfQuestions: 5,
    },
  });

  const handleTextGeneration = async (data: { prompt: string; numberOfQuestions: number }) => {
    setIsLoading(true);
    try {
      const response = await onTextGeneration(data);
      onPreview(response);
      toast.success(successMessage);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileGeneration = async (data: { file: File; numberOfQuestions: number }) => {
    setIsLoading(true);
    try {
      const response = await onFileGeneration(data);
      onPreview(response);
      toast.success(successMessage);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {isUserMode && (
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">Quy trình duyệt</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Quiz của bạn sẽ được gửi đến admin để xem xét và duyệt trước khi xuất bản. 
                      Thời gian xử lý thường từ 1-3 ngày làm việc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 px-8 py-6 font-semibold text-lg transition-all duration-200 ${
                  activeTab === 'text'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Từ văn bản</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`flex-1 px-8 py-6 font-semibold text-lg transition-all duration-200 ${
                  activeTab === 'file'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Từ file</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            {activeTab === 'text' ? (
              <TextPromptForm 
                onSubmit={handleTextGeneration}
                isLoading={isLoading}
                isUserMode={isUserMode}
              />
            ) : (
              <FileUploadForm 
                onSubmit={handleFileGeneration}
                isLoading={isLoading}
                isUserMode={isUserMode}
              />
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tạo nhanh chóng</h3>
            <p className="text-gray-600 text-sm">AI tạo quiz chỉ trong vài giây từ nội dung của bạn</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chất lượng cao</h3>
            <p className="text-gray-600 text-sm">Câu hỏi được tạo thông minh với đáp án chính xác</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Dễ sử dụng</h3>
            <p className="text-gray-600 text-sm">Giao diện thân thiện, không cần kinh nghiệm kỹ thuật</p>
          </div>
        </div>
      </div>
    </div>
  );
}