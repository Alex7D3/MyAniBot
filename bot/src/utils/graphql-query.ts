import redis from './redis-config';
import { MediaDocument } from '@anibot-types/media-document';

type MediaOptions = {
    page?: number;
    type?: 'ANIME' | 'MANGA';
    format?: ['TV', 'TV_SHORT', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC', 'MANGA', 'NOVEL', 'ONE_SHOT'];
    isAdult?: boolean;
    status?: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
    countryOfOrigin?: 'JP' | 'KR' | 'CN' | 'TW';
};

type headers = {
    [key: string]: string;
}

const baseURL = process.env.ANILIST_API_URL || 'https://graphql.anilist.co';

export async function anilistRequest<Query>(variables: {}, token?: string): Promise<any> {
    const headers = {
        'Content-type': 'application/json'
    } as headers;

    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await fetch(baseURL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!res.ok) throw Error(res.statusText);
        const data = await res.json();
        return data;
    } catch (e) {
        console.error(e);
    }
}

function getUserRecents(user_id) {
    return redis.GET(`${user_id}:recent`);
}

async function fzSearchUserRecents(user_id, query) {
    redis
}

async function getRecent() {

}