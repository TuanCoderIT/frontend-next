'use client';

import { useState } from 'react';
import { Zap, Settings, ArrowRight } from 'lucide-react';

interface QuizCreationModeSelectorProps {
  onModeSelect: (mode: 'simple' | 'advanced') => void;
}

export default function QuizCreationModeSelector({ onModeSelect }: QuizCreationModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'simple' | 'advanced' | null>(null);

  const handleModeSelect = (mode: 'simple' | 'advanced') => {
    setSelectedMode(mode);
    setTimeout(() => {
      onModeSelect(mode);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            🤖 Tạo Quiz bằng AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chọn phương thức tạo quiz phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Simple Mode */}
          <div 
            className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              selectedMode === 'simple' ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleModeSelect('simple')}
          >
            <div className="p-8">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tạo từ văn bản
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nhập nội dung văn bản và số câu hỏi. 
                Phù hợp khi bạn có ý tưởng rõ ràng và muốn tạo quiz nhanh chóng.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Chỉ cần nhập nội dung văn bản
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Tạo quiz trong vài phút
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Thông tin cơ bản được tự động tạo
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Phù hợp cho quiz thử nghiệm
                </li>
              </ul>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center">
                <span>Chọn tạo từ văn bản</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                Văn bản
              </span>
            </div>
          </div>

          {/* Advanced Mode */}
          <div 
            className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              selectedMode === 'advanced' ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => handleModeSelect('advanced')}
          >
            <div className="p-8">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tạo từ file
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload file tài liệu và điền thông tin cơ bản. 
                AI sẽ tự động tạo quiz hoàn chỉnh với metadata phù hợp.
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Upload file PDF, DOC, TXT, MD
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  AI tự tạo mục tiêu học tập & kiến thức cần có
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Tự động tạo thẻ tag phù hợp
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  Quiz chuyên nghiệp với metadata đầy đủ
                </li>
              </ul>

              {/* Button */}
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center">
                <span>Chọn tạo từ file</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                File
              </span>
            </div>

            {/* Recommended Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                ⭐ Khuyến nghị
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Lưu ý quan trọng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Quy trình duyệt</p>
                    <p>Tất cả quiz đều cần được admin duyệt trước khi xuất bản</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium mb-1">AI tự động tạo</p>
                    <p>Từ file: mục tiêu học tập, kiến thức cần có, thẻ tag và câu hỏi chất lượng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}