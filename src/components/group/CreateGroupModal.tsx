"use client";

import { useState } from 'react';
import { CreateGroupRequest } from '@/types/public/group';
import { groupsApi } from '@/api/group';
import { useRouter } from 'next/navigation';
import { X, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { notify } from '@/utils/toast';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateGroupModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateGroupModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            // Giả định notify.error có sẵn
            // @ts-ignore
            notify.error('Vui lòng nhập tên nhóm');
            return;
        }

        setIsSubmitting(true);

        // 🚨 BƯỚC 1: TẠO FormData để gửi file
        const formData = new FormData();

        formData.append('name', name.trim());
        if (description.trim()) {
            formData.append('description', description.trim());
        }
        formData.append('visibility', visibility);

        // 🚨 BƯỚC 2: Thêm đối tượng File vào FormData
        if (coverImageFile) {
            formData.append('cover_image', coverImageFile);
        }

        // Nếu không có file, không cần append 'cover_image' vào FormData.

        try {
            // 🚨 BƯỚC 3: Gửi FormData. 
            // Bạn cần đảm bảo hàm API (groupsApi.createGroup) được sửa để chấp nhận FormData 
            // và KHÔNG đặt 'Content-Type: application/json' thủ công.
            // Ví dụ với Axios: axios.post('/groups', formData);

            // Giả định groupsApi.createGroup đã được sửa để nhận FormData
            // @ts-ignore
            const response = await groupsApi.createGroup(formData);

            // @ts-ignore
            notify.success('Đã tạo nhóm thành công');
            onClose();

            // Reset form
            setName('');
            setDescription('');
            setCoverImage(null);
            setCoverImageFile(null);
            setVisibility('public');

            // Navigate to new group or refresh list
            if (response.data.data) {
                router.push(`/groups/${response.data.data.slug}`);
            } else if (onSuccess) {
                onSuccess();
            }

        } catch (err: any) {
            // @ts-ignore
            notify.error(err?.response?.data?.message || 'Không thể tạo nhóm');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tạo nhóm mới
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4">
                        {/* Cover Image Preview */}
                        {coverImage && (
                            <div className="mb-4 relative">
                                <img
                                    src={coverImage}
                                    alt="Cover preview"
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
                        )}

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tên nhóm <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên nhóm..."
                                required
                            />
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

                        {/* Cover Image Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ảnh bìa
                            </label>
                            {!coverImage ? (
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
                            ) : null}
                        </div>

                        {/* Visibility */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quyền riêng tư
                            </label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="public">Công khai - Mọi người có thể tìm thấy và tham gia</option>
                                <option value="private">Riêng tư - Cần duyệt yêu cầu tham gia</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang tạo...</span>
                                </>
                            ) : (
                                'Tạo nhóm'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

