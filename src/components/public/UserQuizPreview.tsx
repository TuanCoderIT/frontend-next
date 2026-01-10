'use client';

import { UserQuizSubmission } from '@/types/public/exams';
import { getDifficultyColorSafe } from '@/utils/stringUtils';

interface UserQuizPreviewProps {
  quiz: UserQuizSubmission;
  onBack: () => void;
  onViewSubmissions: () => void;
}

export default function UserQuizPreview({ quiz, onBack, onViewSubmissions }: UserQuizPreviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳ Chờ duyệt';
      case 'approved':
        return '✅ Đã duyệt';
      case 'rejected':
        return '❌ Từ chối';
      default:
        return status;
    }
  };

  const getDifficultyColor = getDifficultyColorSafe;

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'Trắc nghiệm';
      case 'true_false':
        return 'Đúng/Sai';
      case 'short_answer':
        return 'Trả lời ngắn';
      case 'essay':
        return 'Tự luận';
      default:
        return type;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                📝 Đề xuất quiz đã được gửi!
              </h1>
              <p className="text-gray-600 mt-1">
                Quiz của bạn đang chờ admin xem xét và duyệt
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                ← Tạo quiz khác
              </button>
              <button
                onClick={onViewSubmissions}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                📋 Xem đề xuất của tôi
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert */}
        <div className="p-6 border-b border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">ℹ️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Trạng thái đề xuất
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>• Quiz đã được gửi đến admin để xem xét</p>
                  <p>• Thời gian xử lý: 1-3 ngày làm việc</p>
                  <p>• Bạn sẽ nhận được thông báo khi có kết quả</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {quiz.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {quiz.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColorSafe(quiz.difficulty)}`}>
                  {quiz.difficulty || 'N/A'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                  {getStatusText(quiz.status)}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  🤖 AI Generated
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Số câu hỏi:</span>
                <span className="font-medium">{quiz.questions?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">{quiz.duration} phút</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày gửi:</span>
                <span className="font-medium">
                  {new Date(quiz.submitted_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {quiz.reviewed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày duyệt:</span>
                  <span className="font-medium">
                    {new Date(quiz.reviewed_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviewer Notes */}
        {quiz.reviewer_notes && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💬 Ghi chú từ admin
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">{quiz.reviewer_notes}</p>
            </div>
          </div>
        )}

        {/* Questions Preview */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Danh sách câu hỏi ({quiz.questions?.length || 0})
          </h3>
          <div className="space-y-4">
            {quiz.questions?.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Câu {index + 1}: {question.content}
                  </h4>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      {question.points} điểm
                    </span>
                  </div>
                </div>

                {/* Options for multiple choice */}
                {question.type === 'multiple_choice' && question.options && (
                  <div className="ml-4 space-y-2">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div 
                        key={key} 
                        className={`p-2 rounded border ${
                          key === question.answer 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <span className="font-medium">{key}.</span> {value}
                        {key === question.answer && (
                          <span className="ml-2 text-green-600">✓ Đáp án đúng</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer for other types */}
                {question.type !== 'multiple_choice' && (
                  <div className="ml-4 p-2 bg-green-50 border border-green-200 rounded">
                    <span className="font-medium text-green-800">Đáp án: </span>
                    <span className="text-green-700">{question.answer}</span>
                  </div>
                )}

                {/* Explanation */}
                {question.explanation && (
                  <div className="ml-4 mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <span className="font-medium text-blue-800">Giải thích: </span>
                    <span className="text-blue-700">{question.explanation}</span>
                  </div>
                )}
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <p>Không có câu hỏi nào được tạo.</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              ID: {quiz.id} • Trạng thái: {getStatusText(quiz.status)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Tạo đề xuất khác
              </button>
              <button
                onClick={onViewSubmissions}
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Xem tất cả đề xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}