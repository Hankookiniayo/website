
export enum Platform {
  YOUTUBE = 'YouTube',
  TIKTOK = 'TikTok',
  INSTAGRAM = 'Instagram',
  SPOTIFY = 'Spotify',
  NETFLIX = 'Netflix'
}

export enum Category {
  KOREA = '한국',
  USA = '미국',
  JAPAN = '일본'
}

export interface TrendItem {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  category: Category;
  imageUrl: string;
  stats: string;
  volume: number; // 1-100 scale for search volume visualization
  link: string;
  tags: string[];
  videoCategory?: string; // YouTube video category (e.g., "음악", "게임")
  viewCount?: number; // Actual view count number
  countryFlag?: string; // Country flag emoji
}

export interface TrendResponse {
  trends: TrendItem[];
  globalInsight: string;
}