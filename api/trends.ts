import type { VercelRequest, VercelResponse } from "@vercel/node";
import { refreshTrendsFromYouTube, getCachedTrends, isCacheStale } from "../lib/youtube.js";
import { dbRowToTrendItem, getRegionLabel } from "../lib/transforms.js";

const VALID_REGIONS = ["KR", "US", "JP"];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const region = ((req.query.region as string) || "KR").toUpperCase();

  if (!VALID_REGIONS.includes(region)) {
    return res.status(400).json({ error: `Invalid region. Use: ${VALID_REGIONS.join(", ")}` });
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  if (!youtubeApiKey) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY is not set." });
  }

  try {
    // Check if cache is stale
    const stale = await isCacheStale(region);

    if (stale) {
      try {
        await refreshTrendsFromYouTube(region, youtubeApiKey);
      } catch (refreshError: any) {
        console.error(`YouTube refresh failed for ${region}:`, refreshError.message);
        // Continue to serve cached data even if refresh fails
      }
    }

    // Serve from cache
    const cachedTrends = await getCachedTrends(region);

    if (!cachedTrends || cachedTrends.length === 0) {
      return res.status(200).json({
        trends: [],
        globalInsight: `${getRegionLabel(region)} YouTube 트렌드 데이터가 아직 없습니다.`,
      });
    }

    const trendItems = cachedTrends.map(dbRowToTrendItem);

    return res.status(200).json({
      trends: trendItems,
      globalInsight: `${getRegionLabel(region)} YouTube에서 가장 인기 있는 실시간 트렌드입니다.`,
    });
  } catch (error: any) {
    console.error("Trends API error:", error);
    return res.status(500).json({
      error: "Failed to fetch trends.",
      message: error.message,
    });
  }
}
