"use client";

import { useState, useEffect } from "react";
import { FlashcardSet } from "@/types/public/flashcard";
import {
  getPendingFlashcardSets,
  approveFlashcardSet,
  archiveFlashcardSet,
} from "@/api/flashcards";
import { formatDate } from "@/utils/admin";
import { Layers, Clock, CheckCircle, Archive } from "lucide-react";
import CustomLink from "../common/CustomLink";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function FlashcardPendingList() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getPendingFlashcardSets();
        setSets(data);
      } catch (error) {
        console.error("Failed to fetch pending sets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    if (window.confirm("Approve this flashcard set?")) {
      try {
        await approveFlashcardSet(id);
        setSets((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Failed to approve:", error);
      }
    }
  };

  const handleArchive = async (id: number) => {
    if (window.confirm("Archive this flashcard set?")) {
      try {
        await archiveFlashcardSet(id);
        setSets((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Failed to archive:", error);
      }
    }
  };

  if (isLoading)
    return <DataLoading text="Loading pending flashcard sets..." />;

  return (
    <div className="space-y-6">
      <AdminBreadcrumb currentPage="Pending Moderation" />

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pending Moderation
            </h1>
            <p className="text-gray-600">
              Review and approve flashcard sets submitted by users
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {sets.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              All caught up!
            </h3>
            <p className="text-gray-500">
              No flashcard sets are currently waiting for moderation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Flashcard Set
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cards
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sets.map((set) => (
                  <tr
                    key={set.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 bg-amber-600"
                        >
                          <Layers className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {set.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {set.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {set.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(set.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-indigo-600">
                        {set.cardCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <CustomLink
                          href={`/admin/flashcards/${set.id}`}
                          title="Review Details"
                          type="view"
                        />
                        <button
                          onClick={() => handleApprove(set.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Quick Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleArchive(set.id)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
