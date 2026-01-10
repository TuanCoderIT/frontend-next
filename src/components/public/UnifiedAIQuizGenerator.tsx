'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, FileText, Loader, Edit3 } from 'lucide-react';
import { UserQuizSubmission } from '@/types/public/exams';
import { submitUserQuizFromFile, submitUserQuizFromText } from '@/api/quiz';
import { getErrorMessage } from '@/utils/errorMessages';
import UserQuizForm, { UserQuizFormData } from './UserQuizForm';
import UserQuizPreview from './UserQuizPreview';

type Step = 'form' | 'generate' | 'preview';
type GenerationType = 'text' | 'file';

interface UnifiedAIQuizGeneratorProps {
  type: GenerationType;
  onBackToModeSelection?: () => void;
}

export default function UnifiedAIQuizGenerator({ type, onBackToModeSelection }: UnifiedAIQuizGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [quizFormData, setQuizFormData] = useState<UserQuizFormData | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<UserQuizSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // For file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // For text prompt
  const [textPrompt, setTextPrompt] = useState('');
  
  // Common
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const form = useForm({
    defaultValues: {
      numberOfQuestions: 5,
    },
  });

  const handleFormSubmit = (data: UserQuizFormData) => {
    setQuizFormData(data);
    setCurrentStep('generate');
  };

  const handleGenerate = async () => {
    if (!quizFormData) {
      toast.error('Vui lòng điền thông tin quiz');
      return;
    }

    if (type === 'file' && !selectedFile) {
      toast.error('Vui lòng chọn file');
      return;
    }

    if (type === 'text' && !textPrompt.trim()) {
      toast.error('Vui lòng nhập nội dung văn bản');
      return;
    }

    setIsLoading(true);
    try {
      const basePayload = {
        number_of_questions: numberOfQuestions,
        // Include quiz metadata
        title: quizFormData.title,
        description: quizFormData.description,
        category_id: Number(quizFormData.category.id), // Ensure it's a number
        difficulty: quizFormData.difficulty,
        duration: quizFormData.duration,
        passing_score: quizFormData.passingScore,
        max_attempts: quizFormData.maxAttempts,
        color: quizFormData.color,
        price_token: quizFormData.price_token,
        // Optional manual overrides (if user provided any)
        learning_objectives: quizFormData.learning_objectives?.length ? quizFormData.learning_objectives : undefined,
        prerequisites: quizFormData.prerequisites?.length ? quizFormData.prerequisites : undefined,
        tags: quizFormData.tags?.length ? quizFormData.tags : undefined,
      };

      let response;
      if (type === 'file') {
        response = await submitUserQuizFromFile({
          file: selectedFile!,
          ...basePayload,
        });
      } else {
        response = await submitUserQuizFromText({
          prompt: textPrompt,
          ...basePayload,
        });
      }
      
      // Debug: Log response to see its structure
      console.log('API Response:', response);
      
      // Validate response and ensure required fields are present
      if (response) {
        // Ensure required fields have default values if missing
        const validatedResponse = {
          ...response,
          difficulty: response.difficulty || 'Beginner',
          status: response.status || 'pending',
          submitted_at: response.submitted_at || new Date().toISOString(),
          user_id: response.user_id || 0,
          id: response.id || Date.now(), // Fallback ID if missing
          questions: response.questions || [], // Ensure questions is always an array
        };
        
        console.log('Validated Response:', validatedResponse);
        
        setGeneratedQuiz(validatedResponse);
        setCurrentStep('preview');
        toast.success('Quiz đã được tạo thành công!');
      } else {
        console.error('No response received from server');
        throw new Error('No response received from server');
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setQuizFormData(null);
  };

  const handleBackToGenerate = () => {
    setCurrentStep('generate');
    setGeneratedQuiz(null);
  };

  const handleReset = () => {
    setCurrentStep('form');
    setQuizFormData(null);
    setGeneratedQuiz(null);
    setSelectedFile(null);
    setTextPrompt('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getTitle = () => {
    return type === 'file' ? '🤖 Tạo Quiz từ File bằng AI' : '🤖 Tạo Quiz từ Văn bản bằng AI';
  };

  const getSubtitle = () => {
    return type === 'file' 
      ? 'Upload file và điền thông tin cơ bản. AI sẽ tự động tạo quiz hoàn chỉnh với metadata phù hợp'
      : 'Nhập văn bản và điền thông tin cơ bản. AI sẽ tự động tạo quiz hoàn chỉnh với metadata phù hợp';
  };

  const getStep2Label = () => {
    return type === 'file' ? 'Upload file' : 'Nhập văn bản';
  };

  // Step 1: Quiz Information Form
  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* Back to mode selection button */}
            {onBackToModeSelection && (
              <div className="mb-6 text-left">
                <button
                  onClick={onBackToModeSelection}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Quay lại chọn phương thức
                </button>
              </div>
            )}

            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              {type === 'file' ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : (
                <Edit3 className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {getTitle()}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {getSubtitle()}
            </p>
            
            {/* Process Steps */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-semibold text-gray-900">Thông tin cơ bản</p>
                    <p className="text-sm text-gray-600">Điền thông tin quiz</p>
                  </div>
                </div>
                
                <div className="w-16 h-1 bg-gray-300 rounded"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-semibold text-gray-600">{getStep2Label()}</p>
                    <p className="text-sm text-gray-500">AI phân tích & tạo quiz</p>
                  </div>
                </div>
                
                <div className="w-16 h-1 bg-gray-300 rounded"></div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-semibold text-gray-600">Xem trước & Gửi</p>
                    <p className="text-sm text-gray-500">Kiểm tra và gửi duyệt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Notice */}
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
                    <h3 className="font-semibold text-blue-900 mb-2">AI sẽ tự động tạo</h3>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Từ {type === 'file' ? 'file' : 'văn bản'} của bạn, AI sẽ tự động tạo câu hỏi, mục tiêu học tập, kiến thức cần có và thẻ tag phù hợp. 
                      Bạn chỉ cần điền thông tin cơ bản và {type === 'file' ? 'upload file' : 'nhập nội dung'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Form */}
          <UserQuizForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    );
  }

  // Step 2: Generate (File Upload or Text Input)
  if (currentStep === 'generate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={handleBackToForm}
            className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại thông tin quiz
          </button>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                  ✓
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold text-gray-900">Thông tin cơ bản</p>
                  <p className="text-sm text-green-600">Hoàn thành</p>
                </div>
              </div>
              
              <div className="w-16 h-1 bg-green-600 rounded"></div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold text-gray-900">{getStep2Label()}</p>
                  <p className="text-sm text-blue-600">Đang thực hiện</p>
                </div>
              </div>
              
              <div className="w-16 h-1 bg-gray-300 rounded"></div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="ml-3 text-left">
                  <p className="font-semibold text-gray-600">Xem trước & Gửi</p>
                  <p className="text-sm text-gray-500">Chờ thực hiện</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Info Summary */}
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin Quiz đã nhập</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Tiêu đề:</span>
                <p className="text-gray-900">{quizFormData?.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Danh mục:</span>
                <p className="text-gray-900">{quizFormData?.category.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Độ khó:</span>
                <p className="text-gray-900">
                  {quizFormData?.difficulty === "Beginner" ? "Cơ bản" :
                   quizFormData?.difficulty === "Intermediate" ? "Trung bình" :
                   quizFormData?.difficulty === "Advanced" ? "Nâng cao" : ""}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Thời gian:</span>
                <p className="text-gray-900">{quizFormData?.duration} phút</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Điểm đạt:</span>
                <p className="text-gray-900">{quizFormData?.passingScore}%</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Giá:</span>
                <p className="text-gray-900">{quizFormData?.price_token} tokens</p>
              </div>
            </div>
          </div>

          {/* Generation Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                  {type === 'file' ? <Upload className="w-8 h-8 text-white" /> : <Edit3 className="w-8 h-8 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {type === 'file' ? 'Upload File để AI Tạo Quiz' : 'Nhập Văn bản để AI Tạo Quiz'}
                </h2>
                <p className="text-gray-600">
                  AI sẽ phân tích {type === 'file' ? 'nội dung file' : 'văn bản'} và tự động tạo câu hỏi, mục tiêu học tập, kiến thức cần có và thẻ tag
                </p>
              </div>

              {/* Input Section */}
              <div className="mb-6">
                {type === 'file' ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn file tài liệu
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Chọn file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.doc,.docx,.txt,.md"
                              onChange={handleFileSelect}
                            />
                          </label>
                          <p className="pl-1">hoặc kéo thả file vào đây</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, TXT, MD tối đa 10MB
                        </p>
                      </div>
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-900">
                            {selectedFile.name}
                          </span>
                          <span className="text-sm text-blue-600 ml-2">
                            ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung văn bản
                    </label>
                    <textarea
                      value={textPrompt}
                      onChange={(e) => setTextPrompt(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Nhập nội dung mà bạn muốn AI tạo quiz từ đó. Ví dụ: kiến thức về lập trình, lịch sử, khoa học, v.v."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Nhập nội dung chi tiết để AI có thể tạo câu hỏi chất lượng cao
                    </p>
                  </>
                )}
              </div>

              {/* Number of Questions */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số câu hỏi muốn tạo
                </label>
                <select
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 câu hỏi</option>
                  <option value={10}>10 câu hỏi</option>
                  <option value={15}>15 câu hỏi</option>
                  <option value={20}>20 câu hỏi</option>
                  <option value={25}>25 câu hỏi</option>
                </select>
              </div>

              {/* AI Features Info */}
              <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-3">🤖 AI sẽ tự động tạo:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-900">Câu hỏi chất lượng</p>
                      <p className="text-sm text-purple-700">Đa dạng dạng câu hỏi từ nội dung {type === 'file' ? 'file' : 'văn bản'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-900">Mục tiêu học tập (3-5 mục)</p>
                      <p className="text-sm text-purple-700">Phù hợp với nội dung và độ khó</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-900">Kiến thức cần có (2-4 mục)</p>
                      <p className="text-sm text-purple-700">Điều kiện tiên quyết phù hợp</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-purple-900">Thẻ tag (3-6 từ khóa)</p>
                      <p className="text-sm text-purple-700">Từ khóa chính của nội dung</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleGenerate}
                  disabled={
                    (type === 'file' && !selectedFile) || 
                    (type === 'text' && !textPrompt.trim()) || 
                    isLoading
                  }
                  className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                    ((type === 'file' && !selectedFile) || (type === 'text' && !textPrompt.trim()) || isLoading)
                      ? "opacity-50 cursor-not-allowed"
                      : "transform hover:scale-105"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      AI đang phân tích {type === 'file' ? 'file' : 'nội dung'}...
                    </div>
                  ) : (
                    "Tạo Quiz bằng AI"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Preview
  if (currentStep === 'preview' && generatedQuiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={handleBackToGenerate}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại {type === 'file' ? 'upload file' : 'nhập văn bản'}
          </button>
        </div>

        <UserQuizPreview 
          quiz={generatedQuiz} 
          onBack={handleReset}
          onViewSubmissions={() => {
            window.location.href = '/my-quiz-submissions';
          }}
        />
      </div>
    );
  }

  return null;
}