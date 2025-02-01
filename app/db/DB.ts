import sqlite3 from 'sqlite3';




export async function initializeDatabase(db: sqlite3.Database) {
    const checkTablesExistQuery = `
        SELECT name FROM sqlite_master WHERE type='table' AND name IN ('games', 'genres', 'tags', 'game_genres', 'game_tags', 'screenshots');
    `;

    db.all(checkTablesExistQuery, (err, rows: { name: string }[]) => {
        if (err) {
            console.error('Error checking tables:', err);
            return;
        }

        const existingTables = rows.map((row: { name: string }) => row.name);
        const tablesToCreate = [
            { name: 'games', query: createGamesTable },
            { name: 'genres', query: createGenresTable },
            { name: 'tags', query: createTagsTable },
            { name: 'game_genres', query: createGameGenresTable },
            { name: 'game_tags', query: createGameTagsTable },
            { name: 'screenshots', query: createScreenshotsTable },
            { name: 'esrb_ratings', query: createEsrbRatingsTable },
            { name: 'platforms', query: createPlatformsTable },
            { name: 'game_platforms', query: createGamePlatformsTable },
            { name: 'metacritic_platforms', query: createMetacriticPlatformsTable },
            { name: 'esrb_ratings_games', query: createEsrbRatingsGamesTable }

        ];

        tablesToCreate.forEach(table => {
            if (!existingTables.includes(table.name)) {
                db.exec(table.query);
            }
        });
    });

    // Define the SQL to create the tables only if they do not exist
    const createGamesTable = `
        CREATE TABLE IF NOT EXISTS games (
            path VARCHAR(255) PRIMARY KEY,
            date_added DATE,
            id INT NOT NULL,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            name_original VARCHAR(255),
            description TEXT,
            metacritic INT,
            released DATE,
            tba BOOLEAN,
            updated DATE,
            background_image VARCHAR(512),
            background_image_additional VARCHAR(512),
            website VARCHAR(255),
            rating FLOAT,
            rating_top INT,
            added INT,
            playtime INT,
            screenshots_count INT,
            movies_count INT,
            creators_count INT,
            achievements_count INT,
            parent_achievements_count VARCHAR(255),
            reddit_url VARCHAR(255),
            reddit_name VARCHAR(255),
            reddit_description TEXT,
            reddit_logo VARCHAR(255),
            reddit_count INT,
            twitch_count VARCHAR(255),
            youtube_count VARCHAR(255),
            reviews_text_count VARCHAR(255),
            ratings_count INT,
            suggestions_count INT,
            alternative_names TEXT,
            metacritic_url VARCHAR(255),
            parents_count INT,
            additions_count INT,
            game_series_count INT,
            esrb_rating_id INT,
            FOREIGN KEY (esrb_rating_id) REFERENCES esrb_ratings(id)
        );
    `;

    const createEsrbRatingsGamesTable = `
        CREATE TABLE IF NOT EXISTS esrb_ratings_games (
            game_id INT,
            esrb_rating_id INT,
            PRIMARY KEY (game_id, esrb_rating_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (esrb_rating_id) REFERENCES esrb_ratings(id) ON DELETE CASCADE
        );
    `;

    const createEsrbRatingsTable = `
        CREATE TABLE IF NOT EXISTS esrb_ratings (
            id INT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `;

    const createPlatformsTable = `
        CREATE TABLE IF NOT EXISTS platforms (
            id INT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `;

    const createGamePlatformsTable = `
        CREATE TABLE IF NOT EXISTS game_platforms (
            game_id INT,
            platform_id INT,
            released_at DATE,
            requirements_minimum TEXT,
            requirements_recommended TEXT,
            PRIMARY KEY (game_id, platform_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
        );
    `;

    const createMetacriticPlatformsTable = `
        CREATE TABLE IF NOT EXISTS metacritic_platforms (
            game_id INT,
            metascore INT,
            url VARCHAR(255),
            PRIMARY KEY (game_id, url),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `;

    const createScreenshotsTable = `
        CREATE TABLE IF NOT EXISTS screenshots (
            game_id INT,
            url VARCHAR(512),
            PRIMARY KEY (game_id, url),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `;

    

    const createGenresTable = `
        CREATE TABLE IF NOT EXISTS genres (
            id INT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL
        );
    `;

    const createTagsTable = `
        CREATE TABLE IF NOT EXISTS tags (
            id INT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            language VARCHAR(10),
            games_count INT
        );
    `;

    const createGameGenresTable = `
        CREATE TABLE IF NOT EXISTS game_genres (
            game_id INT,
            genre_id INT,
            PRIMARY KEY (game_id, genre_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
        );
    `;

    const createGameTagsTable = `
        CREATE TABLE IF NOT EXISTS game_tags (
            game_id INT,
            tag_id INT,
            PRIMARY KEY (game_id, tag_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
    `;
    
}

