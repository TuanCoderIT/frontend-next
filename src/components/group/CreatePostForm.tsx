"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/admin/common/Avatar';
import { Image, X, Loader2 } from 'lucide-react';
import { notify } from '@/utils/toast';

interface CreatePostFormProps {
    onSubmit: (content: string, attachments?: string[]) => Promise<void>;
}

export default function CreatePostForm({ onSubmit }: CreatePostFormProps) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && attachments.length === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content, attachments.length > 0 ? attachments : undefined);
            setContent('');
            setAttachments([]);
            notify.success('Đã đăng bài viết');
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể đăng bài viết');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3">
                    <Avatar src={user?.avatar} name={user?.name || ''} size="md" />
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Bạn đang nghĩ gì?"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            disabled={isSubmitting}
                        />

                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {attachments.map((url, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={url}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAttachment(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                                <label className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                    <Image className="w-5 h-5" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // In production, upload to server first
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const result = event.target?.result as string;
                                                    setAttachments([...attachments, result]);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        disabled={isSubmitting}
                                    />
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || (!content.trim() && attachments.length === 0)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang đăng...</span>
                                    </>
                                ) : (
                                    'Đăng'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

