import redis from './redis-config';

const REFRESH_EX_SECONDS = 1_814_000;
type Platform = 'mal' | 'anilist';

export async function getUser(discordId: string, platform: Platform): Promise<string | undefined> {
    return redis.hGet(`${discordId}:${platform}`, 'token');
}

export async function logoutUser(discordId: string, platform: Platform): Promise<boolean> {
    return Boolean(redis.hDel(`${discordId}:${platform}`, 'token'));
}

export async function setUser(token: string, discordId: string, platform: Platform): Promise<boolean> {
    return Boolean(redis.HSET(`${discordId}:${platform}`,
		'access_token', token_data.access_token,
		'refresh_token', token_data.refresh_token,
		'timestamp', new Date().getSeconds(),
		'expires_in', token_data.expires_in,
		{ EX: REFRESH_EX_SECONDS }
	));
	console.log("successful token store");
    return Boolean(redis.hSet(discordId, platform, token));
}
