
import { Platform, Category, TrendResponse, TrendItem } from "../types";

const YOUTUBE_API_KEY = "AIzaSyBQOg8euRZd8ksXj4rdcM2g5EuDdcsMm_M";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// Category to YouTube region code mapping
const getCategoryRegionCode = (category: Category): string => {
  switch (category) {
    case Category.KOREA:
      return "KR";
    case Category.USA:
      return "US";
    case Category.JAPAN:
      return "JP";
    default:
      return "KR";
  }
};

export const fetchTrends = async (category: Category): Promise<TrendResponse> => {
  const regionCode = getCategoryRegionCode(category);

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=10&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    const trends: TrendItem[] = data.items.map((item: any, index: number) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      stats: `조회수 ${formatViews(item.statistics.viewCount)}회`,
      volume: calculateVolume(item.statistics.viewCount, index),
      link: `https://www.youtube.com/watch?v=${item.id}`,
      tags: item.snippet.tags?.slice(0, 5) || []
    }));

    return {
      trends,
      globalInsight: `${category} YouTube에서 가장 인기 있는 실시간 트렌드입니다.`
    };
  } catch (error) {
    console.error("Error fetching YouTube trends:", error);
    throw error;
  }
};

// Format view count to Korean format
const formatViews = (views: string): string => {
  const num = parseInt(views);
  if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`;
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`;
  return num.toLocaleString();
};

// Calculate volume score based on view count and ranking
const calculateVolume = (views: string, index: number): number => {
  const num = parseInt(views);
  const baseScore = Math.min(100, Math.floor(num / 100000)); // 10만 조회수당 1점
  const rankBonus = (10 - index) * 5; // 순위 보너스
  return Math.min(100, baseScore + rankBonus);
};
