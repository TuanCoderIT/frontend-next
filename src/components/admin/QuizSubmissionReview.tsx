'use client';

import { useState, useEffect } from 'react';
import { UserQuizSubmission } from '@/types/public/exams';
import { getErrorMessage } from '@/utils/errorMessages';
import toast from 'react-hot-toast';
import { axiosAPI } from '@/api/axios';

export default function QuizSubmissionReview() {
  const [submissions, setSubmissions] = useState<UserQuizSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<UserQuizSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axiosAPI.get('/admin/quiz-submissions');
      setSubmissions(res.data);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (submissionId: number, action: 'approve' | 'reject') => {
    setIsReviewing(true);
    try {
      await axiosAPI.post(`/admin/quiz-submissions/${submissionId}/review`, {
        action,
        notes: reviewNotes,
      });
      
      toast.success(`Đề xuất đã được ${action === 'approve' ? 'duyệt' : 'từ chối'} thành công!`);
      setSelectedSubmission(null);
      setReviewNotes('');
      fetchSubmissions(); // Refresh list
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsReviewing(false);
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
          <h1 className="text-2xl font-bold text-gray-900">
            👨‍💼 Duyệt đề xuất Quiz từ User
          </h1>
          <p className="text-gray-600 mt-1">
            Xem xét và duyệt các quiz do người dùng đề xuất
          </p>
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
              <p className="text-gray-600">
                Chưa có user nào gửi đề xuất quiz
              </p>
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
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          🤖 AI Generated
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>👤 User ID: {submission.user_id}</span>
                        <span>📝 {submission.questions.length} câu hỏi</span>
                        <span>⏱️ {submission.duration} phút</span>
                        <span>📅 {new Date(submission.submitted_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {submission.reviewer_notes && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Ghi chú duyệt:</strong> {submission.reviewer_notes}
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
                      {submission.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReviewNotes('');
                            }}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReviewNotes('');
                            }}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Duyệt đề xuất: {selectedSubmission.title}
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
              <div className="space-y-6">
                {/* Quiz Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedSubmission.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedSubmission.description}</p>
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
                </div>

                {/* Questions Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Danh sách câu hỏi:</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedSubmission.questions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded p-3">
                        <p className="font-medium text-sm">Câu {index + 1}: {question.content}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Loại: {question.type} • Điểm: {question.points}
                        </p>
                      </div>
                    ))}
                    {selectedSubmission.questions.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        ... và {selectedSubmission.questions.length - 3} câu hỏi khác
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Notes */}
                {selectedSubmission.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú duyệt (tùy chọn)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập ghi chú cho user (nếu có)..."
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Đóng
                  </button>
                  {selectedSubmission.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReview(selectedSubmission.id, 'reject')}
                        disabled={isReviewing}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isReviewing ? 'Đang xử lý...' : '❌ Từ chối'}
                      </button>
                      <button
                        onClick={() => handleReview(selectedSubmission.id, 'approve')}
                        disabled={isReviewing}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                      >
                        {isReviewing ? 'Đang xử lý...' : '✅ Duyệt'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}