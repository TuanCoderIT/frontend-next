"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileApi, changePasswordApi } from "@/api/auth";
import { UpdateProfileData, ChangePasswordData } from "@/types/public/user";
import { formatDate } from "@/utils/admin";
import Avatar from "@/components/admin/common/Avatar";
import StatusBadge from "@/components/admin/common/StatusBadge";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit3,
    Save,
    X,
    Lock,
    Eye,
    EyeOff,
    Camera,
    AlertTriangle,
    CheckCircle,
    Upload,
    BookCheck,
    ArrowLeft
} from "lucide-react";

export default function AdminProfilePage() {
    const { user, token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            // Initialize form data with current user data
            setProfileForm({
                name: user.name || "",
                bio: user.bio || "",
                date_of_birth: user.date_of_birth || "",
                gender: user.gender || "",
                phone_number: user.phone_number || "",
            });
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const formData: UpdateProfileData = { ...profileForm };
            if (avatarFile) {
                formData.avatar = avatarFile;
            }

            const updatedUser = await updateProfileApi(formData);
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: "Failed to update profile" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        // Reset form to original values
        if (user) {
            setProfileForm({
                name: user.name || "",
                bio: user.bio || "",
                date_of_birth: user.date_of_birth || "",
                gender: user.gender || "",
                phone_number: user.phone_number || "",
            });
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50">
            <AdminBreadcrumb
                currentPage="My Profile"
            />
            <div className="px-4 sm:px-6 lg:px-8">
                <PageHeader
                    title="My Profile"
                    icon={<BookCheck />}
                    actionLabel="Back to Dashboard"
                    actionHref="/admin"
                    actionIcon={<ArrowLeft />}
                    bgGradient="from-green-50 to-emerald-50"
                    buttonGradient="from-green-500 to-emerald-600"
                />
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-800">{successMessage}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Avatar
                                            src={avatarPreview || user.avatar}
                                            name={user.name}
                                            size="4xl"
                                        />
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                                                <Camera className="h-4 w-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <p className="text-blue-100">{user.email}</p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <StatusBadge status={user.role} type="role" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6 space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <User className="h-5 w-5 mr-2 text-blue-600" />
                                        Personal Information
                                    </h3>

                                    {isEditing ? (
                                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                                            {errors.general && (
                                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-800">{errors.general}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Gender
                                                    </label>
                                                    <select
                                                        value={profileForm.gender}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={profileForm.date_of_birth}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={profileForm.phone_number}
                                                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone_number: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="+1 (555) 123-4567"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bio
                                                </label>
                                                <textarea
                                                    value={profileForm.bio}
                                                    onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Tell us about yourself..."
                                                />
                                            </div>

                                            <div className="flex justify-end space-x-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {isLoading ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
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
                                                <User className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Gender</p>
                                                    <p className="text-gray-900 capitalize">{user.gender || "Not provided"}</p>
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
                                    )}
                                </div>

                                {/* Bio */}
                                {!isEditing && user.bio && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
                                        <p className="text-fuchsia-700 leading-relaxed bg-fuchsia-50 p-4 rounded-lg">
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
                                            <p className="text-gray-900">{user.created_at ? formatDate(user.created_at) : "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="text-gray-900">{user.updated_at ? formatDate(user.updated_at) : "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                {!isEditing && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                                        >
                                            <Edit3 className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Change Password Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                                Security
                            </h3>

                            {isChangingPassword ? (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    {errors.general && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-red-800">{errors.general}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwordForm.current_password}
                                                onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.current_password && <p className="text-red-600 text-sm mt-1">{errors.current_password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.new_password}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.new_password && <p className="text-red-600 text-sm mt-1">{errors.new_password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordForm.new_password_confirmation}
                                            onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password_confirmation: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.new_password_confirmation && <p className="text-red-600 text-sm mt-1">{errors.new_password_confirmation}</p>}
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? "Changing..." : "Change Password"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Change Password
                                </button>
                            )}
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Age</span>
                                    <span className="font-semibold text-gray-900">
                                        {user.created_at
                                            ? `${Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`
                                            : "N/A"
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Role</span>
                                    <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className="font-semibold text-green-600">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 