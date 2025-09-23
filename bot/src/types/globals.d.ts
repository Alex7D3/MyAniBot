export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      discord_token: string;
      discord_client_id: string;
      guild_id: string;
      client_id: string;
      client_secret_mal: string;
      client_secret: string;
      anilist_client_id: string;
      port: string;
      redis_host: string;
      redis_port: string;
      redis_password: string;
      redirect_uri: string;
      NODE_ENV: string;
    }
  }
}
