import api from '../malAPI.json'
import { storeDocument, getDocument } from './redis-helpers';
import type { MediaDocument, MiniDocument } from '../types/media-document';
import dotenv from 'dotenv';
dotenv.config();

const headers = { 'X-MAL-CLIENT-ID': process.env.client_id };

export async function fetchDetails(media: 'anime' | 'manga', id: number): Promise<MediaDocument> {
  const document: MediaDocument | null = await getDocument(media, id);  
  if (document) return document;

  const extraFields = api[`${media}_only_fields`];
  const req = `${api.base_api_url}/${media}/${id}?fields=${api.all_fields},${extraFields}`;
  const res = await fetch(req, { method: 'GET', headers });

  if (!res.ok) throw new Error(`HTTP error fetching details: ${res.status}`);

  const data = await res.json() as MediaDocument;
  storeDocument(data); 
  return data; 
}

type SearchData = { data: [{ node: MiniDocument }], paging: { next: string }};
export async function search(media: 'anime' | 'manga', query: string, limit = 100, offset = 10): Promise<MiniDocument[]> {
  const documents: MiniDocument[] = [];
  const params = new URLSearchParams({
    q: query,
    fields: api.mini_fields,
    limit: String(limit),
    offset: String(offset)
  });
  let req = `${api.base_api_url}/${media}?${params}`;
  while (req) {
    const res = await fetch(req, { method: 'GET', headers }); 
    if (!res.ok) throw new Error(`HTTP error fetching search results: ${res.status}`);

    const dataList = await res.json() as SearchData;
    documents.push(...dataList.data.map(({ node }) => node));
    req = dataList.paging.next;
  }
  return documents;
}
