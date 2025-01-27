export interface SearchResults {
    count: number;
    next: string | null;
    previous: string | null;
    results: Result[];
}

export interface Result {
    id: number;
    slug: string;
    name: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: Rating[];
    ratings_count: number;
    reviews_text_count: string;
    added: number;
    added_by_status: AddedByStatus;
    metacritic: number;
    playtime: number;
    suggestions_count: number;
    updated: string;
    esrb_rating: EsrbRating;
    platforms: PlatformElement[];
}

export interface AddedByStatus {
    [key: string]: number;
}

export interface EsrbRating {
    id: number;
    slug: string;
    name: string;
}

export interface PlatformElement {
    platform: PlatformPlatform;
    released_at: string;
    requirements: Requirements;
}

export interface PlatformPlatform {
    id: number;
    slug: string;
    name: string;
}

export interface Requirements {
    minimum: string;
    recommended: string;
}

export interface Rating {
    [key: string]: string;
}

