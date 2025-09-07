declare namespace NodeJS {
    export interface ProcessEnv {
        DISCORD_TOKEN: string;
        DISCORD_GUILD_ID: string;
        DISCORD_CLIENT_ID: string;
        MAL_CLIENT_ID: string;
        MAL_CLIENT_SECRET: string
        ANILIST_CLIENT_SECRET: string;
        ANILIST_CLIENT_ID: string;
        ANILIST_API_URL: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASSWORD: string;
    }
}