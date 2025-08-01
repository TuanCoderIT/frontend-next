import { createRating, getMyRating, updateRating, deleteRating } from "@/api/ratings";
import { useAuth } from "@/context/AuthContext";
import { Rating } from "@/types/public/rating";
import { useEffect, useState } from "react";
import { Star, MessageSquare, Edit3, Trash2, LogIn, Send, X } from "lucide-react";

interface RatingFormProps {
    type: "quiz" | "post" | "news";
    id: number;
    onRatingSubmitted?: () => void;
}

const RatingForm = ({ type, id, onRatingSubmitted }: RatingFormProps) => {
    const { user, token } = useAuth();
    const [stars, setStars] = useState(0);
    const [comment, setComment] = useState("");
    const [myRating, setMyRating] = useState<Rating | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingRating, setIsLoadingRating] = useState(true);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (token) {
            fetchMyRating();
        } else {
            setIsLoadingRating(false);
        }
    }, [type, id, token]);

    const fetchMyRating = async () => {
        try {
            const response = await getMyRating(type, id, token!);
            const rating = response.data;
            setMyRating(rating);
            if (rating) {
                setStars(rating.stars);
                setComment(rating.comment || "");
            }
        } catch (error) {
            // User hasn't rated yet, which is fine
            console.log("No existing rating found");
        } finally {
            setIsLoadingRating(false);
        }
    };

    const handleStarClick = (starValue: number) => {
        setStars(starValue);
        setError("");
    };

    const handleSubmit = async () => {
        if (!token || !user) return;

        if (stars === 0) {
            setError("Please select a rating");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            if (myRating && !isEditing) {
                // Update existing rating
                await updateRating(myRating.id, { stars, comment }, token);
                setMyRating({ ...myRating, stars, comment });
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                onRatingSubmitted?.();
            } else if (myRating && isEditing) {
                // Update existing rating (editing mode)
                await updateRating(myRating.id, { stars, comment }, token);
                setMyRating({ ...myRating, stars, comment });
                setIsEditing(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                onRatingSubmitted?.();
            } else {
                // Create new rating
                const response = await createRating(type, id, { stars, comment }, token);
                setMyRating(response.data);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
                onRatingSubmitted?.();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit rating. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!token || !myRating) return;

        if (!confirm("Are you sure you want to delete your rating?")) return;

        setIsLoading(true);
        setError("");

        try {
            await deleteRating(myRating.id, token);
            setMyRating(null);
            setStars(0);
            setComment("");
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            onRatingSubmitted?.();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete rating. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setError("");
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (myRating) {
            setStars(myRating.stars);
            setComment(myRating.comment || "");
        }
        setError("");
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredStar || stars);
            const isHovered = starValue <= hoveredStar;

            return (
                <button
                    key={starValue}
                    type="button"
                    onClick={() => handleStarClick(starValue)}
                    onMouseEnter={() => setHoveredStar(starValue)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`transition-all duration-200 transform hover:scale-110 ${isFilled
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                        } ${isHovered ? 'animate-pulse' : ''}`}
                    disabled={isLoading}
                >
                    <Star
                        className={`w-8 h-8 ${isFilled ? 'fill-current' : ''}`}
                    />
                </button>
            );
        });
    };

    const getRatingText = () => {
        if (stars === 0) return "Select a rating";
        if (stars === 1) return "Poor";
        if (stars === 2) return "Fair";
        if (stars === 3) return "Good";
        if (stars === 4) return "Very Good";
        if (stars === 5) return "Excellent";
        return "";
    };

    // Not logged in state
    if (!user || !token) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="text-center py-8">
                    <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sign in to Rate
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Please log in to share your rating and feedback
                    </p>
                    <a
                        href="/auth/login"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                    </a>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoadingRating) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="flex space-x-2 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            {/* Success Message */}
            {showSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-800 text-sm">
                        {myRating && !isEditing ? "Rating updated successfully!" : "Rating submitted successfully!"}
                    </span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-red-800 text-sm">{error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        {myRating && !isEditing ? "Your Rating" : "Rate this Quiz"}
                    </h3>
                    {myRating && !isEditing && (
                        <p className="text-sm text-gray-600 mt-1">
                            You rated this on {new Date(myRating.created_at || Date.now()).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Edit/Delete buttons for existing rating */}
                {myRating && !isEditing && (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleEdit}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit rating"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete rating"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Star Rating */}
            <div className="mb-6">
                <div className="flex items-center justify-center space-x-1 mb-2">
                    {renderStars()}
                </div>
                <p className="text-center text-sm text-gray-600">
                    {getRatingText()}
                </p>
            </div>

            {/* Comment Section */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share your thoughts (optional)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think about this quiz..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isLoading}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
                {isEditing && (
                    <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || stars === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {myRating && !isEditing ? "Updating..." : "Submitting..."}
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" />
                            {myRating && !isEditing ? "Update Rating" : "Submit Rating"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RatingForm;
