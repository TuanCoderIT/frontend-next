"use client";

import { User } from "@/types/admin/admin";
import { formatDate, formatDateTime } from "@/utils/admin";
import Avatar from "@/components/admin/common/Avatar";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { X } from "lucide-react";

interface UserProfileSidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileSidebar({
  user,
  isOpen,
  onClose,
}: UserProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-end z-50">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white w-96 h-full overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">User Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Avatar src={user.avatar} name={user.name} size="xl" />
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-blue-100">{user.email}</p>
              <div className="mt-2">
                <StatusBadge status={user.role} type="role" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Account Status
            </h4>
            <StatusBadge status={user.status} type="status" />
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Personal Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Gender:</span>
                <span className="text-sm text-gray-900 capitalize">
                  {user.gender}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="text-sm text-gray-900">
                  {user.phone_number || "Not provided"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date of Birth:</span>
                <span className="text-sm text-gray-900">
                  {user.date_of_birth
                    ? formatDate(user.date_of_birth)
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
              <p className="text-sm text-gray-900 leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Account Activity */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Account Activity
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm text-gray-900">
                  {formatDate(user.updated_at)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Login:</span>
                <span className="text-sm text-gray-900">
                  {user.last_login ? formatDateTime(user.last_login) : "Never"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Quick Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-blue-600">Quizzes Taken</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-green-600">Avg Score</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View Quiz History
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                Send Message
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                Reset Password
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Suspend Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
