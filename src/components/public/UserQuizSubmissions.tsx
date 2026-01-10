'use client';

import { useState, useEffect } from 'react';
import { UserQuizSubmission } from '@/types/public/exams';
import { getUserSubmittedQuizzes } from '@/api/quiz';
import { getErrorMessage } from '@/utils/errorMessages';
import toast from 'react-hot-toast';

export default function UserQuizSubmissions() {
  const [submissions, setSubmissions] = useState<UserQuizSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<UserQuizSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await getUserSubmittedQuizzes();
      setSubmissions(data);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800';
    
    switch (difficulty.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải danh sách đề xuất...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📋 Đề xuất Quiz của tôi
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý các quiz bạn đã gửi đề xuất
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/create-quiz'}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
            >
              ➕ Tạo đề xuất mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
              <div className="text-sm text-gray-600">Tổng đề xuất</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-800">
                {submissions.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-600">Chờ duyệt</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-800">
                {submissions.filter(s => s.status === 'approved').length}
              </div>
              <div className="text-sm text-green-600">Đã duyệt</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-800">
                {submissions.filter(s => s.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-600">Từ chối</div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="p-6">
          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đề xuất nào
              </h3>
              <p className="text-gray-600 mb-4">
                Bạn chưa gửi đề xuất quiz nào. Hãy tạo quiz đầu tiên!
              </p>
              <button
                onClick={() => window.location.href = '/create-quiz'}
                className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Tạo đề xuất đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusText(submission.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(submission.difficulty)}`}>
                          {submission.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📝 {submission.questions.length} câu hỏi</span>
                        <span>⏱️ {submission.duration} phút</span>
                        <span>📅 {new Date(submission.submitted_at).toLocaleDateString('vi-VN')}</span>
                        {submission.reviewed_at && (
                          <span>✅ Duyệt: {new Date(submission.reviewed_at).toLocaleDateString('vi-VN')}</span>
                        )}
                      </div>
                      {submission.reviewer_notes && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Ghi chú admin:</strong> {submission.reviewer_notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      {submission.status === 'approved' && (
                        <button
                          onClick={() => window.location.href = `/quiz/${submission.id}`}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                        >
                          Làm quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đề xuất
                </h2>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedSubmission.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedSubmission.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedSubmission.status)}`}>
                      {getStatusText(selectedSubmission.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Độ khó:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getDifficultyColor(selectedSubmission.difficulty)}`}>
                      {selectedSubmission.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số câu hỏi:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="ml-2 font-medium">{selectedSubmission.duration} phút</span>
                  </div>
                </div>
                {selectedSubmission.reviewer_notes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>Ghi chú từ admin:</strong> {selectedSubmission.reviewer_notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}