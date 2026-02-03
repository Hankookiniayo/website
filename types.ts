
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
  volume: number;
  link: string;
  tags: string[];
  videoCategory?: string;
  viewCount?: number;
  countryFlag?: string;
}

export interface TrendResponse {
  trends: TrendItem[];
  globalInsight: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  role: string;
  subscribers: string;
  problem: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];
  quote: string;
  image: string;
}

export enum PlanType {
  FREE = 'Free',
  PRO = 'Pro',
  BUSINESS = 'Business'
}
