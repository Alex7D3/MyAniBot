import redis from './redis-config';
import type { MediaDocument } from '../types/media-document';
import { isAnime } from '../types/media-document';
import api from './malAPI';

const { client_id, client_secret } = process.env;

const ONE_DAY = 24 * 60 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;
export async function storeDocument(doc: MediaDocument, expiry = ONE_DAY): Promise<void> {
  const media = isAnime(doc) ? 'anime' : 'manga';
  await Promise.all([
    redis.json.set(`doc:${media}:${doc.id}`, '$', doc),
    redis.expire(`doc:${media}:${doc.id}`, expiry)
  ]).then(res => {
    if (!res[0]) console.error("Failed to store " + doc.id);
    if (!res[1]) console.error("Failed to add expiry to " + doc.id);
  });
}

export async function getDocument(media: 'anime' | 'manga', id: number): Promise<MediaDocument | null> {
  return await redis.json.get(`doc:${media}:${id}`) as MediaDocument | null;
}

type TokenData = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export async function getUser(discordId: string): Promise<TokenData & { timestamp: number }> {
  return await redis.hgetall(`user:${discordId}`) as TokenData & { timestamp: number };
}

export async function removeUser(discordId: string): Promise<void> {
  await redis.del(`user:${discordId}`);
}

export async function getUserToken(discordId: string): Promise<string> {
  const user =  await getUser(discordId);

  if (!user.access_token)
    throw new Error('User is not logged in');
  else if (user.expires_in < new Date().getSeconds() - user.timestamp) {
    const { refresh_token } = user;
    const res = await fetch(api.base_token_url, {
      method: 'POST',
      body: JSON.stringify({
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token
      })
    });

    if (!res.ok)
      throw new Error(`HTTP error refreshing token: ${res.status}.`);

    const data = await res.json() as TokenData;
    await storeUser(data, discordId);
    return data.access_token;
  }

  return user.access_token;
}

export async function storeUser(token: TokenData, discordId: string, expiry = THIRTY_DAYS): Promise<void> {
  const timestamp = new Date().getSeconds();
  await Promise.all([
    redis.hset(`user:${discordId}`, { ...token, timestamp }),
    redis.expire(`user:${discordId}`, expiry)
  ]).then(res => {
    if (!res[0]) console.error("Failed to store token for " + discordId);
    if (!res[1]) console.error("Failed to add expiry to " + discordId);
  });
}
