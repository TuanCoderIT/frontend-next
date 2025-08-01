"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import Avatar from "@/components/admin/common/Avatar";
import StatusBadge from "@/components/admin/common/StatusBadge";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import {
    User as UserIcon,
    Mail,
    Calendar,
    Shield,
    Edit3,
    Power,
    Lock,
    Trash2,
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    X,
    BookCheck
} from "lucide-react";
import CustomLink from "@/components/admin/common/CustomLink";
import BackButton from "@/components/admin/common/BackButton";

// Mock user data for demonstration
const mockUser: User = {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "user",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-03-20T14:45:00Z",
    last_login: "2024-03-21T09:15:00Z",
    avatar: "https://i.pravatar.cc/150?img=8",
    gender: "female",
    phone_number: "+1 (555) 123-4567",
    date_of_birth: "1990-05-15",
    bio: "Passionate learner and quiz enthusiast. Always eager to expand knowledge and help others grow."
};

export default function AdminUserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        // Simulate API call
        const fetchUser = async () => {
            try {
                // In real implementation, fetch user by ID from API
                // const response = await axiosAPI.get(`/admin/users/${params.id}`);
                // setUser(response.data);

                // Using mock data for now
                setTimeout(() => {
                    setUser(mockUser);
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error("Error fetching user:", error);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);

    const handleToggleStatus = async () => {
        if (!user) return;

        try {
            // In real implementation, make API call
            // await axiosAPI.patch(`/admin/users/${user.id}/toggle-status`);

            setUser(prev => prev ? { ...prev, status: prev.status === 'active' ? 'inactive' : 'active' } : null);
            setActionMessage({ type: 'success', message: `User status changed to ${user.status === 'active' ? 'inactive' : 'active'}` });

            setTimeout(() => setActionMessage(null), 3000);
        } catch (error) {
            setActionMessage({ type: 'error', message: 'Failed to update user status' });
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleResetPassword = async () => {
        if (!user) return;

        try {
            // In real implementation, make API call
            // await axiosAPI.post(`/admin/users/${user.id}/reset-password`);

            setShowResetModal(false);
            setActionMessage({ type: 'success', message: 'Password reset email sent successfully' });

            setTimeout(() => setActionMessage(null), 3000);
        } catch (error) {
            setActionMessage({ type: 'error', message: 'Failed to reset password' });
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    const handleDeleteUser = async () => {
        if (!user) return;

        try {
            // In real implementation, make API call
            // await axiosAPI.delete(`/admin/users/${user.id}`);

            setShowDeleteModal(false);
            setActionMessage({ type: 'success', message: 'User deleted successfully' });

            // Redirect to users list after a short delay
            setTimeout(() => {
                router.push('/admin/users');
            }, 1500);
        } catch (error) {
            setActionMessage({ type: 'error', message: 'Failed to delete user' });
            setTimeout(() => setActionMessage(null), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">User not found</p>
                    <BackButton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <AdminBreadcrumb
                    currentPage="User Profile"
                    parent={{ href: "/admin/users", label: "Users" }}
                />
                {/* Header */}
                <PageHeader
                    title="User Profile"
                    icon={<BookCheck />}
                    actionLabel="Back to Quizzes"
                    actionHref="/admin/quizzes"
                    actionIcon={<ArrowLeft />}
                    bgGradient="from-green-50 to-emerald-50"
                    buttonGradient="from-green-500 to-emerald-600"
                />

                {/* Action Message */}
                {actionMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center ${actionMessage.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {actionMessage.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertTriangle className="h-5 w-5 mr-2" />
                        )}
                        <span>{actionMessage.message}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - User Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center space-x-4">
                                    <Avatar src={user.avatar} name={user.name} size="xl" />
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <p className="text-blue-100">{user.email}</p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <StatusBadge status={user.role} type="role" />
                                            <StatusBadge status={user.status} type="status" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="p-6 space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-gray-900">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Date of Birth</p>
                                                <p className="text-gray-900">
                                                    {user.date_of_birth ? formatDate(user.date_of_birth) : "Not provided"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <UserIcon className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="text-gray-900 capitalize">{user.gender}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-gray-900">{user.phone_number || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                {user.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
                                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                            {user.bio}
                                        </p>
                                    </div>
                                )}

                                {/* Account Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Shield className="h-5 w-5 mr-2 text-blue-600" />
                                        Account Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Account Created</p>
                                            <p className="text-gray-900">{formatDate(user.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                                        </div>
                                        {user.last_login && (
                                            <div>
                                                <p className="text-sm text-gray-500">Last Login</p>
                                                <p className="text-gray-900">{formatDate(user.last_login)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Admin Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Admin Actions Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Actions</h3>

                            <div className="space-y-4">
                                {/* Edit User */}
                                <CustomLink
                                    href={`/admin/users/${user.id}/edit`}
                                    title="Edit user"
                                    type="view"
                                />

                                {/* Toggle Status */}
                                <button
                                    onClick={handleToggleStatus}
                                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-colors ${user.status === 'active'
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                >
                                    <Power className="h-4 w-4 mr-2" />
                                    {user.status === 'active' ? 'Deactivate' : 'Activate'} User
                                </button>

                                {/* Reset Password */}
                                <button
                                    onClick={() => setShowResetModal(true)}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Reset Password
                                </button>

                                {/* Delete User */}
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Age</span>
                                    <span className="font-semibold text-gray-900">
                                        {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role</span>
                                    <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <StatusBadge status={user.status} type="status" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-6">
                                This will send a password reset email to <strong>{user.email}</strong>.
                                The user will be able to set a new password through the email link.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Send Reset Email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mb-6">
                                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                <p className="text-gray-600 text-center">
                                    Are you sure you want to delete <strong>{user.name}</strong>?
                                    This action cannot be undone and will permanently remove the user account.
                                </p>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 