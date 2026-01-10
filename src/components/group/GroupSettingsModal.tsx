"use client";

import { useState } from 'react';
import { GroupDetail, UpdateGroupRequest } from '@/types/public/group';
import { groupsApi } from '@/api/group';
import { useRouter } from 'next/navigation';
import { X, Loader2, Trash2, Image as ImageIcon } from 'lucide-react';
import { notify } from '@/utils/toast';

interface GroupSettingsModalProps {
    group: GroupDetail;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export default function GroupSettingsModal({
    group,
    isOpen,
    onClose,
    onUpdate,
}: GroupSettingsModalProps) {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [description, setDescription] = useState(group.description || '');
    const [visibility, setVisibility] = useState<'public' | 'private'>(group.visibility);
    const [coverImage, setCoverImage] = useState<string | null>(group.cover_image);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setCoverImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setCoverImage(null);
        setCoverImageFile(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Nếu có file mới, sử dụng FormData
            if (coverImageFile) {
                const formData = new FormData();
                if (description.trim()) {
                    formData.append('description', description.trim());
                }
                formData.append('visibility', visibility);
                formData.append('cover_image', coverImageFile);

                await groupsApi.updateGroup(group.id, formData);
            } else {
                // Nếu không có file mới, sử dụng JSON
                const data: UpdateGroupRequest = {
                    description: description || undefined,
                    visibility,
                    cover_image: coverImage || undefined,
                };
                await groupsApi.updateGroup(group.id, data);
            }

            notify.success('Đã cập nhật nhóm');
            onUpdate();
            onClose();
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể cập nhật nhóm');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await groupsApi.deleteGroup(group.id);
            notify.success('Đã xóa nhóm');
            router.push('/groups');
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể xóa nhóm');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Cài đặt nhóm
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    {/* Cover Image */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ảnh bìa
                        </label>
                        {coverImage ? (
                            <div className="relative">
                                <img
                                    src={`${API_URL}${coverImage}`}
                                    alt="Cover"
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-10 h-10 mb-2 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click để upload</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF (MAX. 5MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Mô tả về nhóm..."
                        />
                    </div>

                    {/* Visibility */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quyền riêng tư
                        </label>
                        <select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="public">Công khai - Mọi người có thể tìm thấy và tham gia</option>
                            <option value="private">Riêng tư - Chỉ thành viên mới xem được</option>
                        </select>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                            Vùng nguy hiểm
                        </h4>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa nhóm
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Đang xóa...</span>
                                            </>
                                        ) : (
                                            'Xác nhận xóa'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang lưu...</span>
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

