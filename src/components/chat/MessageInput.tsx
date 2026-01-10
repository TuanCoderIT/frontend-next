"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { uploadFile, validateFile } from "@/libs/upload";
import AttachmentPreview from "./AttachmentPreview";
import { useTyping } from "@/hooks/chat/useTyping";

interface MessageInputProps {
    onSend: (content: string, attachments?: string[]) => Promise<void>;
    disabled?: boolean;
    threadId: number | null;
}

export default function MessageInput({
    onSend,
    disabled = false,
    threadId,
}: MessageInputProps) {
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { handleTyping } = useTyping(threadId);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                validateFile(file);
                return await uploadFile(file);
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setAttachments((prev) => [...prev, ...uploadedUrls]);
        } catch (error) {
            console.error("Upload failed:", error);
            alert(error instanceof Error ? error.message : "Upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if ((!content.trim() && attachments.length === 0) || disabled || isUploading) {
            return;
        }

        const messageContent = content.trim();
        const messageAttachments = attachments.length > 0 ? attachments : undefined;

        try {
            await onSend(messageContent, messageAttachments);
            setContent("");
            setAttachments([]);
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        handleTyping();
    };

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="mb-2">
                    <AttachmentPreview
                        attachments={attachments}
                        onRemove={handleRemoveAttachment}
                        isPreview={true}
                    />
                </div>
            )}

            {/* Input Area */}
            <div className="flex items-end gap-2">
                {/* File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Attach file"
                />

                {/* Attach Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Attach file"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập tin nhắn..."
                        disabled={disabled || isUploading}
                        rows={1}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     resize-none max-h-32 overflow-y-auto custom-scrollbar
                     disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={
                        (!content.trim() && attachments.length === 0) ||
                        disabled ||
                        isUploading
                    }
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:bg-blue-500"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            {/* Upload Status */}
            {isUploading && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Đang tải lên...
                </div>
            )}
        </div>
    );
}

