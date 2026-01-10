import { useState, useEffect } from "react";
import { getRatings } from "@/api/ratings";
import { Rating, RatingsResponse, RatingStats } from "@/types/public/rating";
import { Star, MessageSquare, User, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "@/components/admin/common/Avatar";

interface RatingListProps {
    type: "quiz" | "post" | "news" | "document";
    id: number;
    stats?: RatingStats;
}

const RatingList = ({ type, id, stats }: RatingListProps) => {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRatings, setTotalRatings] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRatings();
    }, [type, id, currentPage]);

    useEffect(() => {
        console.log("Stats received:", stats);
    }, [stats]);

    useEffect(() => {
        console.log("Ratings received:", ratings);
    }, [ratings]);

    const fetchRatings = async () => {
        try {
            setIsLoading(true);
            setError("");
            const response = await getRatings(type, id, currentPage, 10);
            const data: RatingsResponse = response.data;

            setRatings(data.data);
            setTotalPages(data.last_page);
            setTotalRatings(data.total);
        } catch (err: any) {
            setError("Lỗi khi tải đánh giá. Vui lòng thử lại.");
            console.error("Error fetching ratings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;

            return (
                <Star
                    key={starValue}
                    className={`w-4 h-4 ${isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            );
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getRatingText = (rating: number) => {
        if (rating === 1) return "Kém";
        if (rating === 2) return "Vừa phải";
        if (rating === 3) return "Tốt";
        if (rating === 4) return "Rất tốt";
        if (rating === 5) return "Xuất sắc";
        return "";
    };

    const renderRatingStats = () => {
        if (!stats) return null;

        return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Average Rating */}
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                            {stats.average_rating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                            {renderStars(Math.round(stats.average_rating))}
                        </div>
                        <div className="text-sm text-gray-600">
                            {stats.total_ratings} đánh giá
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Thống kê đánh giá</h4>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div key={star} className="flex items-center">
                                    <div className="flex items-center w-8">
                                        <span className="text-sm text-gray-600 mr-1">{star}</span>
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    </div>
                                    <div className="flex-1 mx-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full"
                                                style={{
                                                    width: `${stats.total_ratings > 0
                                                        ? (stats.rating_distribution[star as keyof typeof stats.rating_distribution] / stats.total_ratings) * 100
                                                        : 0}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-8 text-right">
                                        <span className="text-sm text-gray-600">
                                            {stats.rating_distribution[star as keyof typeof stats.rating_distribution]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRatingItem = (rating: Rating) => (
        <div key={rating.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                    <Avatar
                        src={rating.user.avatar}
                        name={rating.user.name}
                        size="md"
                    />
                </div>

                {/* Rating Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                {rating.user.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                                <div className="flex">
                                    {renderStars(rating.stars)}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {getRatingText(rating.stars)}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(rating.created_at || "")}
                        </div>
                    </div>

                    {rating.comment && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {rating.comment}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Đánh giá & Phản hồi
                </h3>
                {totalRatings > 0 && (
                    <span className="text-sm text-gray-600">
                        {totalRatings} đánh giá{totalRatings !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Rating Statistics */}
            {renderRatingStats()}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ratings List */}
            {!isLoading && ratings.length > 0 && (
                <div className="space-y-4">
                    {ratings.map(renderRatingItem)}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && ratings.length === 0 && (
                <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Không có đánh giá nào
                    </h4>
                    <p className="text-gray-600">
                        Hãy là người đầu tiên để chia sẻ suy nghĩ của bạn về bài kiểm tra này!
                    </p>
                </div>
            )}

            {/* Pagination */}
            {renderPagination()}
        </div>
    );
};

export default RatingList; 