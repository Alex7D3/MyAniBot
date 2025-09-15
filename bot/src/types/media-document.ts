export interface UserStatus {
  status: 'watching' | 'completed' | 'on_hold' | 'plan_to_watch';
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  start_date: null | string;
  finish_date: null | string;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  comments: string;
  updated_at: string;
};

export interface Person { id: number; first_name: string; last_name: string; };

export interface Studio { id: number; name: string; };

export interface Magazine { id: number; name: string; };

export interface Picture { large: string; medium: null | string; };

type RelationType = 'sequel' | 'prequel' | 'alternative_setting' | 'alternative_version' | 'side_story' | 'parent_story' | 'summary' | 'full_story' ;

export interface MiniDocument {
  [key: string]: any;
  media: 'anime' | 'manga';
  id: number;
  title: number;
  mean: number;
  rank: number;
  popularity: number;
};

export interface MediaDocument {
  [key: string]: any;
  id: number;
  title: string;
  main_picture: Picture;
  pictures: null | Picture[];
  alternative_titles: { synonyms: string[]; en: string; ja: string; };
  start_date: string;
  end_date: string;
  synopsis: string;
  mean: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  num_favorites: number;
  nsfw: 'white' | 'grey' | 'black';
  created_at: string;
  updated_at: string;
  status: 'finished_airing' | 'currently_airing' | 'not_yet_aired';
  genres: { id: number; name: string; }[];
  my_list_status: null | UserStatus;
  related_anime: null | { node: AnimeDocument; relation_type: RelationType; }[];
  related_manga: null | { node: MangaDocument; relation_type: RelationType; }[];
};

export interface AnimeDocument extends MediaDocument {
  num_episodes: number;
  start_season: null | { year: number; season: 'winter' | 'spring' | 'summer' | 'fall'; };
  broadcast: null | { day_of_the_week: string; start_time: string | null; };
  media_type: 'unknown' | 'tv' | 'ova' | 'movie' | 'special' | 'ona' | 'music';
  source: 'other' | 'original' | 'manga' | '4_koma_manga' | 'web_manga' | 'digital_manga' | 'novel' | 'light_novel' | 'visual_novel' | 'game' | 'card_game' | 'book' | 'picture_book' | 'radio' | 'music';
  average_episode_duration: null | number;
  rating: null | 'g' | 'pg' | 'pg_13' | 'r' | 'r+' | 'rx';
  studios: Studio[];
  statistics: {
    num_list_users: number;
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
  };
};

export interface MangaDocument extends MediaDocument {
  num_chapters: number;
  num_volumes: number;
  media_type: 'unknown' | 'manga' | 'novel' | 'one_shot' | 'doujinshi' | 'manhwa' | 'manhua' | 'oel';
  authors: { node: Person; role: string; }[];
  serialization: null | { node: Magazine; role: string; }[];
};

export function isAnime(document: MediaDocument): document is AnimeDocument {
  return 'num_episodes' in document;
}

export function isManga(document: MediaDocument): document is MangaDocument {
  return 'num_chapters' in document;
}
