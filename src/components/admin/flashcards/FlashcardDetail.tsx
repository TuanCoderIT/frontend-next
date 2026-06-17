"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlashcardSet } from "@/types/public/flashcard";
import {
  approveFlashcardSet,
  rejectFlashcardSet,
  archiveFlashcardSet,
  deleteFlashcardSet,
} from "@/api/flashcards";
import { formatDate } from "@/utils/admin";
import StatusBadge from "@/components/admin/common/StatusBadge";
import {
  CheckCircle,
  XCircle,
  Archive,
  Edit,
  Trash2,
  ArrowLeft,
  Layers,
  Calendar,
  User,
  Hash,
  Clock,
  Info,
  X,
} from "lucide-react";

interface FlashcardDetailProps {
  flashcardSet: FlashcardSet;
}

export default function FlashcardDetail({
  flashcardSet: initialSet,
}: FlashcardDetailProps) {
  const router = useRouter();
  const [set, setSet] = useState<FlashcardSet>(initialSet);
  const [isModifying, setIsModifying] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAction = async (
    action: () => Promise<FlashcardSet>,
    actionName: string,
  ) => {
    if (window.confirm(`Are you sure you want to ${actionName} this set?`)) {
      setIsModifying(true);
      try {
        const updated = await action();
        setSet(updated);
        alert(`Set ${actionName} successfully`);
      } catch (error) {
        console.error(`Failed to ${actionName}:`, error);
        alert(`Failed to ${actionName}. Please try again.`);
      } finally {
        setIsModifying(false);
      }
    }
  };

  const handleApprove = () =>
    handleAction(() => approveFlashcardSet(set.id), "approve");
  const handleArchive = () =>
    handleAction(() => archiveFlashcardSet(set.id), "archive");

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setIsModifying(true);
    try {
      const updated = await rejectFlashcardSet(set.id, rejectReason);
      setSet(updated);
      setShowRejectModal(false);
      alert("Set rejected successfully");
    } catch (error) {
      console.error("Failed to reject:", error);
      alert("Failed to reject. Please try again.");
    } finally {
      setIsModifying(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to PERMANENTLY delete "${set.title}"?`,
      )
    ) {
      try {
        await deleteFlashcardSet(set.id);
        router.push("/admin/flashcards");
      } catch (error) {
        console.error("Failed to delete:", error);
        alert("Failed to delete. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to List
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push(`/admin/flashcards/${set.id}/edit`)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>

          {set.status === "draft" && (
            <>
              <button
                onClick={handleApprove}
                disabled={isModifying}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isModifying}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </button>
            </>
          )}

          {set.status !== "archived" && (
            <button
              onClick={handleArchive}
              disabled={isModifying}
              className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </button>
          )}

          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 relative bg-blue-600">
              <div className="absolute -bottom-8 left-8 p-4 bg-white rounded-2xl shadow-lg border border-gray-50">
                <Layers className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <div className="p-8 pt-12">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {set.title}
                </h1>
                <StatusBadge status={set.status} />
              </div>
              <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                {set.description || "No description provided."}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-50">
                <div className="space-y-1">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Hash className="w-4 h-4 mr-1" /> Source
                  </div>
                  <p className="font-semibold text-gray-700 capitalize">
                    {set.sourceType}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-400 text-sm">
                    <User className="w-4 h-4 mr-1" /> Creator
                  </div>
                  <p className="font-semibold text-gray-700">
                    {set.user?.name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" /> Created
                  </div>
                  <p className="font-semibold text-gray-700">
                    {formatDate(set.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Layers className="w-4 h-4 mr-1" /> Cards
                  </div>
                  <p className="font-semibold text-gray-700">
                    {set.cardCount || set.cards?.length || 0} Total
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Flashcards List
              <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                {set.cardCount || set.cards?.length || 0}
              </span>
            </h2>

            <div className="space-y-4">
              {set.cards?.map((card, index) => (
                <div
                  key={card.id || index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 relative"
                >
                  <div className="absolute -left-3 top-6 w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                      Front Side
                    </p>
                    <p className="text-gray-800 text-lg font-medium">
                      {card.term}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                      Back Side
                    </p>
                    <p className="text-gray-800 text-lg font-medium">
                      {card.definition}
                    </p>
                  </div>
                  {card.explanation && (
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-50 flex items-start space-x-3">
                      <Info className="w-5 h-5 text-indigo-300 mt-0.5" />
                      <p className="text-sm text-gray-500 italic">
                        {card.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Moderation History / Status Details */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Review Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-500">Current Status</span>
                <StatusBadge status={set.status} />
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-400">Last Updated</span>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(set.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats or Tips */}
          <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-lg shadow-indigo-100">
            <h4 className="font-bold text-lg">Admin View</h4>
            <p className="text-indigo-100 text-sm mt-2">
              As an administrator, you are responsible for ensuring content
              quality and accuracy. Please review card texts carefully before
              approving.
            </p>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Reject Flashcard Set
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Please provide a reason why this flashcard set is being
                rejected. This will be shared with the creator.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Content is too brief, contains errors, or inappropriate language..."
              />
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isModifying || !rejectReason.trim()}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100 disabled:opacity-50"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
