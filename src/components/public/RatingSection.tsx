import { useState, useEffect } from "react";
import RatingForm from "./RatingForm";
import RatingList from "./RatingList";
import { getRatingStats } from "@/api/ratings";
import { RatingStats } from "@/types/public/rating";

interface RatingSectionProps {
    type: "quiz" | "post" | "news";
    id: number;
}

const RatingSection = ({ type, id }: RatingSectionProps) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState<RatingStats | undefined>(undefined);

    // Fetch stats khi mount hoặc id/type thay đổi
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getRatingStats(type, id);
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, [type, id, refreshKey]); // thêm refreshKey để update stats khi user submit

    // Khi user đánh giá xong => tăng key => reload lại RatingList + stats
    const handleRatingSubmitted = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-8">
            {/* User Rating Form */}
            <RatingForm
                type={type}
                id={id}
                onRatingSubmitted={handleRatingSubmitted}
            />

            {/* Reviews List */}
            <RatingList
                key={refreshKey}
                type={type}
                id={id}
                stats={stats}
            />
        </div>
    );
};

export default RatingSection;
