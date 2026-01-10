"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserQuizHistory } from "@/api/quiz";
import { getUserStatsApi, updateProfileApi, changePasswordApi } from "@/api/auth";
import { QuizHistoryItem } from "@/types/public/exams";
import { UserProfile, UpdateProfileData, ChangePasswordData } from "@/types/public/user";
import {
  User,
  Calendar,
  Phone,
  Edit3,
  Save,
  X,
  Lock,
  Trophy,
  Clock,
  Target,
  Award,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  LockKeyholeOpen,
  LockKeyhole
} from "lucide-react";
import { calculateUserStats } from "@/utils/userUtils";
import FormInput from "@/components/admin/common/FormInput";
import FormSelect from "@/components/admin/common/FormSelect";
import FormTextarea from "@/components/admin/common/FormTextarea";

export default function UserProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const userProfile = user ? calculateUserStats(user, quizHistory) : null;

  // Form states
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    name: "",
    bio: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
  });
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    if (user && token) {
      fetchUserData();
    }
  }, [user, token]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [statsData, historyData] = await Promise.all([
        getUserStatsApi(),
        getUserQuizHistory(user!.id)
      ]);

      setProfile({ ...user, ...statsData });
      setQuizHistory(historyData);

      // Initialize form data
      setProfileForm({
        name: user?.name || "",
        bio: user?.bio || "",
        date_of_birth: user?.date_of_birth || "",
        gender: user?.gender || "",
        phone_number: user?.phone_number || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const updatedUser = await updateProfileApi(profileForm);
      setProfile(prev => ({ ...prev, ...updatedUser }));
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to update profile" });
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      await changePasswordApi(passwordForm);
      setIsChangingPassword(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to change password" });
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin của bạn...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Không thể tải thông tin của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            My <span className="text-blue-600">Trang cá nhân</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quản lý cài đặt tài khoản và theo dõi tiến trình học tập của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      profile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                {profile.current_level && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(profile.current_level)}`}>
                    {profile.current_level}
                  </span>
                )}
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>

                {profile.bio && (
                  <div className="text-sm text-gray-600">
                    <p className="italic">"{profile.bio}"</p>
                  </div>
                )}

                <div className="space-y-3">
                  {profile.date_of_birth && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Ngày sinh:</span>
                      <span className="ml-2 text-gray-900">{formatDate(profile.date_of_birth)}</span>
                    </div>
                  )}

                  {profile.gender && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Giới tính:</span>
                      <span className="ml-2 text-gray-900 capitalize">{profile.gender}</span>
                    </div>
                  )}

                  {profile.phone_number && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="ml-2 text-gray-900">{profile.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin cá nhân"}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Bảo mật
              </h3>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Thay đổi mật khẩu
              </button>
            </div>
          </div>

          {/* Right Column - Stats & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                Thống kê học tập
              </h3>
              {userProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {userProfile.total_quizzes_completed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Bài kiểm tra hoàn thành</div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {userProfile.average_accuracy || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Độ chính xác trung bình</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {formatTime(userProfile.total_learning_time || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Tổng thời gian học tập</div>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-600">
                      {profile.achievements?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Thành tựu</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Quiz History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Award className="h-6 w-6 mr-2 text-blue-600" />
                Lịch sử bài kiểm tra gần nhất
              </h3>

              <div className="space-y-4">
                {quizHistory.slice(0, 5).map((quiz) => (
                  <div key={`${quiz.id}-${quiz.completed_at}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{quiz.exam.title}</h4>
                      <p className="text-sm text-gray-600">
                        {quiz.exam.category} • {formatDate(quiz.completed_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getPerformanceColor(quiz.percentage)}`}>
                        {quiz.percentage}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {quiz.score}/{quiz.total}
                      </div>
                    </div>
                  </div>
                ))}

                {quizHistory.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không có lịch sử bài kiểm tra</p>
                    <p className="text-sm text-gray-500">Bắt đầu làm bài kiểm tra để xem tiến trình của bạn</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md transition-all flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Chỉnh sửa thông tin cá nhân</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {errors.general && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Họ và tên"
                      name="name"
                      type="text"
                      value={profileForm.name ?? ""}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      error={errors.name}
                      icon={<User className="h-5 w-5" />}
                    />
                    <FormSelect
                      label="Giới tính"
                      name="gender"
                      options={[
                        { label: "Chọn giới tính", value: "" },
                        { label: "Nam", value: "male" },
                        { label: "Nữ", value: "female" },
                        { label: "Khác", value: "other" }
                      ]}
                      value={profileForm.gender ?? ""}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                      error={errors.gender}
                    />
                    <FormInput
                      label="Ngày sinh"
                      name="date_of_birth"
                      type="date"
                      value={profileForm.date_of_birth ?? ""}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      error={errors.date_of_birth}
                      icon={<Calendar className="h-5 w-5" />}
                    />
                    <FormInput
                      label="Số điện thoại"
                      name="phone_number"
                      type="tel"
                      value={profileForm.phone_number ?? ""}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone_number: e.target.value }))}
                      error={errors.phone_number}
                      icon={<Phone className="h-5 w-5" />}
                    />
                  </div>
                  <FormTextarea
                    label="Giới thiệu"
                    name="bio"
                    value={profileForm.bio ?? ""}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                    error={errors.bio}
                    placeholder="Nói về bản thân..."
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md transition-all flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Thay đổi mật khẩu</h3>
                  <button
                    onClick={() => setIsChangingPassword(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {errors.general && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <FormInput
                    label="Mật khẩu hiện tại"
                    name="current_password"
                    type="password"
                    value={passwordForm.current_password ?? ""}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    error={errors.current_password}
                    icon={<LockKeyholeOpen className="h-5 w-5" />}
                  />
                  <FormInput
                    label="Mật khẩu mới"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password ?? ""}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    error={errors.new_password}
                    icon={<LockKeyhole className="h-5 w-5" />}
                  />
                  <FormInput
                    label="Xác nhận mật khẩu mới"
                    name="new_password_confirmation"
                    type="password"
                    value={passwordForm.new_password_confirmation ?? ""}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                    error={errors.new_password_confirmation}
                    icon={<Lock className="h-5 w-5" />}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Thay đổi mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
