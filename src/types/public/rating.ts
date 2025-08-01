export interface Rating {
    id: number;
    user_id: number;
    rateable_id: number;
    rateable_type: string;
    stars: number;
    comment: string;
    created_at?: string;
    updated_at?: string;
    user: {
        name: string;
        avatar?: string;
    };
}

export interface RatingsResponse {
    data: Rating[];
    last_page: number;
    total: number;
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface RatingStats {
    average_rating: number;
    total_ratings: number;
    rating_distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}
