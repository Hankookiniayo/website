// YouTube category ID to Korean name mapping
const VIDEO_CATEGORIES: Record<string, string> = {
  "1": "영화/애니메이션",
  "2": "자동차/교통",
  "10": "음악",
  "15": "동물",
  "17": "스포츠",
  "19": "여행/이벤트",
  "20": "게임",
  "22": "일상/브이로그",
  "23": "코미디",
  "24": "엔터테인먼트",
  "25": "뉴스/정치",
  "26": "노하우/스타일",
  "27": "교육",
  "28": "과학/기술",
};

const REGION_FLAGS: Record<string, string> = {
  KR: "🇰🇷",
  US: "🇺🇸",
  JP: "🇯🇵",
};

const REGION_LABELS: Record<string, string> = {
  KR: "한국",
  US: "미국",
  JP: "일본",
};

export function getVideoCategoryName(categoryId: string): string {
  return VIDEO_CATEGORIES[categoryId] || "기타";
}

export function getRegionFlag(regionCode: string): string {
  return REGION_FLAGS[regionCode] || "🌍";
}

export function getRegionLabel(regionCode: string): string {
  return REGION_LABELS[regionCode] || regionCode;
}

// Vibe Score calculation: 급상승(70%) + 조회수(30%)
export function calculateVibeScore(viewCount: number, rank: number): number {
  const trendingScore = Math.max(0, 70 - rank * 7);

  let viewScore = 0;
  if (viewCount >= 10000000) viewScore = 30;
  else if (viewCount >= 5000000) viewScore = 25;
  else if (viewCount >= 3000000) viewScore = 22;
  else if (viewCount >= 1000000) viewScore = 18;
  else if (viewCount >= 500000) viewScore = 14;
  else if (viewCount >= 300000) viewScore = 10;
  else if (viewCount >= 100000) viewScore = 6;
  else viewScore = Math.floor(viewCount / 20000);

  return Math.min(100, trendingScore + viewScore);
}

// Format view count to Korean format
export function formatViews(views: number): string {
  if (views >= 100000000) return `${(views / 100000000).toFixed(1)}억`;
  if (views >= 10000) return `${(views / 10000).toFixed(1)}만`;
  return views.toLocaleString();
}

// YouTube API item -> DB row for insertion
export function youtubeItemToDbRow(
  item: any,
  regionCode: string,
  rank: number,
  fetchedAt: string
) {
  const viewCount = parseInt(item.statistics.viewCount || "0", 10);
  const categoryId = item.snippet.categoryId || "";

  return {
    video_id: item.id,
    region_code: regionCode,
    title: item.snippet.title,
    description: item.snippet.description || "",
    channel_title: item.snippet.channelTitle || "",
    thumbnail_url:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    video_category_id: categoryId,
    video_category_name: getVideoCategoryName(categoryId),
    tags: item.snippet.tags?.slice(0, 5) || [],
    view_count: viewCount,
    like_count: parseInt(item.statistics.likeCount || "0", 10),
    comment_count: parseInt(item.statistics.commentCount || "0", 10),
    trending_rank: rank,
    vibe_score: calculateVibeScore(viewCount, rank),
    fetched_at: fetchedAt,
  };
}

// DB row -> Frontend-compatible TrendItem shape
export function dbRowToTrendItem(row: any) {
  return {
    id: row.video_id,
    title: row.title,
    description: row.description || "",
    platform: "YouTube",
    category: getRegionLabel(row.region_code),
    imageUrl: row.thumbnail_url || "",
    stats: `조회수 ${formatViews(row.view_count)}회`,
    volume: row.vibe_score,
    link: `https://www.youtube.com/watch?v=${row.video_id}`,
    tags: row.tags || [],
    videoCategory: row.video_category_name,
    viewCount: row.view_count,
    countryFlag: getRegionFlag(row.region_code),
  };
}
