
export interface GetAllGamesResultType {
    path:                        string;
    date_added:                  Date;
    id:                          number;
    slug:                        string;
    name:                        string;
    name_original:               string;
    description:                 string;
    metacritic:                  number;
    released:                    Date;
    tba:                         boolean;
    updated:                     Date;
    background_image:            string;
    background_image_additional: string;
    website:                     string;
    rating:                      number;
    rating_top:                  number;
    added:                       number;
    playtime:                    number;
    screenshots_count:           number;
    movies_count:                number;
    creators_count:              number;
    achievements_count:          number;
    parent_achievements_count:   string;
    reddit_url:                  string;
    reddit_name:                 string;
    reddit_description:          string;
    reddit_logo:                 string;
    reddit_count:                number;
    twitch_count:                string;
    youtube_count:               string;
    reviews_text_count:          string;
    ratings_count:               number;
    suggestions_count:           number;
    alternative_names:           string[];
    metacritic_url:              string;
    parents_count:               number;
    additions_count:             number;
    game_series_count:           number;
    esrb_rating_id:              number;
    esrb_slug:                   string;
    esrb_name:                   string;
}



