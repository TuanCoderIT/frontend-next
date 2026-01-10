'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { formatFileSize, getFileIcon, validateFileType, validateFileSize } from '@/utils/file';

interface FileUploadFormProps {
  onSubmit: (data: { file: File; numberOfQuestions: number }) => void;
  isLoading: boolean;
  isUserMode?: boolean;
}

interface FormData {
  numberOfQuestions: number;
}

export default function FileUploadForm({ onSubmit, isLoading, isUserMode = false }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      numberOfQuestions: 5,
    },
  });

  const numberOfQuestions = watch('numberOfQuestions');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileError('');
    
    if (rejectedFiles.length > 0) {
      setFileError('Loại file không được hỗ trợ');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!validateFileType(file)) {
      setFileError('Chỉ hỗ trợ file PDF, DOCX, DOC, TXT');
      return;
    }

    // Validate file size (10MB)
    if (!validateFileSize(file, 10)) {
      setFileError('File quá lớn (tối đa 10MB)');
      return;
    }

    // Check if file is empty
    if (file.size === 0) {
      setFileError('File trống hoặc không đọc được');
      return;
    }

    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isLoading,
  });

  const handleFormSubmit = (data: FormData) => {
    if (!selectedFile) {
      setFileError('Vui lòng chọn file');
      return;
    }
    onSubmit({
      file: selectedFile,
      numberOfQuestions: data.numberOfQuestions,
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError('');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* File Upload Area */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Tải file lên <span className="text-red-500">*</span>
          </label>
          
          <div
            {...getRootProps()}
            className={`group relative border-3 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : fileError
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{selectedFile.name}</p>
                  <p className="text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
                  </p>
                  <p className="text-gray-500">
                    Hỗ trợ PDF, DOCX, DOC, TXT (tối đa 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {fileError && (
            <p className="mt-3 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {fileError}
            </p>
          )}
        </div>

        {/* File Requirements */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.329C8.207 9.747 10.017 8 12 8s3.793 1.747 6.08 4.671a7.965 7.965 0 01-2.08 2.329z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-3">Yêu cầu file:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Định dạng: PDF, DOCX, DOC, TXT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Kích thước: Tối đa 10MB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Nội dung: Văn bản rõ ràng, đầy đủ</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Ngôn ngữ: Tiếng Việt hoặc tiếng Anh</span>
                </div>
              </div>
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
                  min: { value: 1, message: `Số câu hỏi phải từ 1-${isUserMode ? 10 : 20}` },
                  max: { value: isUserMode ? 10 : 20, message: `Số câu hỏi phải từ 1-${isUserMode ? 10 : 20}` }
                })}
                id="numberOfQuestions"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
                disabled={isLoading}
              >
                {[...Array(isUserMode ? 10 : 20)].map((_, i) => (
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
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-1">Thông tin</h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  {isUserMode 
                    ? 'User có thể tạo tối đa 10 câu hỏi từ file. Thời gian xử lý 1-2 phút.'
                    : 'Admin có thể tạo tối đa 20 câu hỏi từ file. Thời gian xử lý 2-3 phút.'
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
            disabled={isLoading || !selectedFile}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-lg rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Đang phân tích file...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{isUserMode ? 'Gửi đề xuất' : 'Tạo'} {numberOfQuestions} câu hỏi từ file</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}