import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase.js";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ── Types ──────────────────────────────────────────────

interface VideoItem {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface AggregatedData {
  keyword: string;
  regionCode: string;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  maxViews: number;
  minViews: number;
  topChannels: { name: string; videoCount: number; totalViews: number }[];
  topVideos: VideoItem[];
  recentUploadRate: number; // percentage of videos uploaded in last 7 days
}

interface AnalysisResult {
  keyword: string;
  regionCode: string;
  vibeScore: number;
  summary: string;
  insights: string[];
  opportunities: string[];
  risks: string[];
  aggregatedData: AggregatedData;
  videos: VideoItem[];
}

// ── YouTube API helpers ────────────────────────────────

async function searchVideos(
  keyword: string,
  regionCode: string,
  apiKey: string
): Promise<string[]> {
  const params = new URLSearchParams({
    part: "snippet",
    q: keyword,
    type: "video",
    regionCode,
    maxResults: "50",
    order: "relevance",
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube Search API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.items.map((item: any) => item.id.videoId).filter(Boolean);
}

async function getVideoDetails(
  videoIds: string[],
  apiKey: string
): Promise<VideoItem[]> {
  // YouTube API allows max 50 IDs per request
  const params = new URLSearchParams({
    part: "snippet,statistics",
    id: videoIds.join(","),
    key: apiKey,
  });

  const response = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`YouTube Videos API error (${response.status}): ${error}`);
  }

  const data = await response.json();

  return data.items.map((item: any) => ({
    videoId: item.id,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnail:
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.default?.url ||
      "",
    viewCount: parseInt(item.statistics.viewCount || "0", 10),
    likeCount: parseInt(item.statistics.likeCount || "0", 10),
    commentCount: parseInt(item.statistics.commentCount || "0", 10),
  }));
}

// ── Data Aggregation ───────────────────────────────────

function aggregateData(
  keyword: string,
  regionCode: string,
  videos: VideoItem[]
): AggregatedData {
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.commentCount, 0);

  const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;
  const avgLikes = totalVideos > 0 ? Math.round(totalLikes / totalVideos) : 0;
  const avgComments =
    totalVideos > 0 ? Math.round(totalComments / totalVideos) : 0;

  const viewCounts = videos.map((v) => v.viewCount);
  const maxViews = viewCounts.length > 0 ? Math.max(...viewCounts) : 0;
  const minViews = viewCounts.length > 0 ? Math.min(...viewCounts) : 0;

  // Top channels by video count
  const channelMap = new Map<
    string,
    { videoCount: number; totalViews: number }
  >();
  for (const video of videos) {
    const existing = channelMap.get(video.channelTitle) || {
      videoCount: 0,
      totalViews: 0,
    };
    channelMap.set(video.channelTitle, {
      videoCount: existing.videoCount + 1,
      totalViews: existing.totalViews + video.viewCount,
    });
  }

  const topChannels = Array.from(channelMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5);

  // Top videos by views
  const topVideos = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10);

  // Recent upload rate (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentVideos = videos.filter(
    (v) => new Date(v.publishedAt).getTime() > sevenDaysAgo
  );
  const recentUploadRate =
    totalVideos > 0 ? Math.round((recentVideos.length / totalVideos) * 100) : 0;

  return {
    keyword,
    regionCode,
    totalVideos,
    totalViews,
    totalLikes,
    totalComments,
    avgViews,
    avgLikes,
    avgComments,
    maxViews,
    minViews,
    topChannels,
    topVideos,
    recentUploadRate,
  };
}

// ── Gemini API ─────────────────────────────────────────

async function analyzeWithGemini(
  aggregated: AggregatedData,
  apiKey: string
): Promise<{ vibeScore: number; summary: string; insights: string[]; opportunities: string[]; risks: string[] }> {
  const prompt = `You are a YouTube trend analyst. Analyze the following YouTube search data for the keyword "${aggregated.keyword}" in region "${aggregated.regionCode}".

Data:
- Total videos analyzed: ${aggregated.totalVideos}
- Total views: ${aggregated.totalViews.toLocaleString()}
- Average views per video: ${aggregated.avgViews.toLocaleString()}
- Average likes per video: ${aggregated.avgLikes.toLocaleString()}
- Average comments per video: ${aggregated.avgComments.toLocaleString()}
- Max views on a single video: ${aggregated.maxViews.toLocaleString()}
- Min views: ${aggregated.minViews.toLocaleString()}
- Recent upload rate (last 7 days): ${aggregated.recentUploadRate}%
- Top channels: ${aggregated.topChannels.map((c) => `${c.name} (${c.videoCount} videos, ${c.totalViews.toLocaleString()} views)`).join(", ")}

Please respond in Korean with a JSON object (no markdown, no code blocks, just raw JSON):
{
  "vibeScore": <number 0-100, representing how trendy/viral this keyword is>,
  "summary": "<1-2 sentence summary of the trend>",
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>"],
  "risks": ["<risk 1>", "<risk 2>"]
}

Scoring guide:
- 80-100: Extremely viral, massive engagement
- 60-79: Strong trend, good engagement
- 40-59: Moderate interest
- 20-39: Low interest
- 0-19: Very niche or declining`;

  const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse JSON from Gemini response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

// ── Fallback score calculation ─────────────────────────

function calculateFallbackScore(aggregated: AggregatedData): {
  vibeScore: number;
  summary: string;
  insights: string[];
  opportunities: string[];
  risks: string[];
} {
  // Simple heuristic-based scoring
  let score = 0;

  // View-based score (0-40 points)
  if (aggregated.avgViews > 1000000) score += 40;
  else if (aggregated.avgViews > 500000) score += 35;
  else if (aggregated.avgViews > 100000) score += 28;
  else if (aggregated.avgViews > 50000) score += 20;
  else if (aggregated.avgViews > 10000) score += 12;
  else score += 5;

  // Engagement score (0-30 points)
  const engagementRate =
    aggregated.avgViews > 0
      ? (aggregated.avgLikes + aggregated.avgComments) / aggregated.avgViews
      : 0;
  if (engagementRate > 0.05) score += 30;
  else if (engagementRate > 0.03) score += 24;
  else if (engagementRate > 0.02) score += 18;
  else if (engagementRate > 0.01) score += 12;
  else score += 5;

  // Recency score (0-30 points)
  if (aggregated.recentUploadRate > 50) score += 30;
  else if (aggregated.recentUploadRate > 30) score += 24;
  else if (aggregated.recentUploadRate > 15) score += 18;
  else if (aggregated.recentUploadRate > 5) score += 10;
  else score += 3;

  score = Math.min(100, Math.max(0, score));

  const level =
    score >= 80
      ? "매우 높은"
      : score >= 60
        ? "높은"
        : score >= 40
          ? "보통"
          : score >= 20
            ? "낮은"
            : "매우 낮은";

  return {
    vibeScore: score,
    summary: `"${aggregated.keyword}" 키워드는 현재 ${level} 관심도를 보이고 있습니다. 평균 조회수 ${aggregated.avgViews.toLocaleString()}회, 최근 7일 업로드 비율 ${aggregated.recentUploadRate}%.`,
    insights: [
      `평균 조회수: ${aggregated.avgViews.toLocaleString()}회`,
      `평균 좋아요: ${aggregated.avgLikes.toLocaleString()}개`,
      `상위 채널: ${aggregated.topChannels.map((c) => c.name).join(", ") || "데이터 없음"}`,
    ],
    opportunities: [
      aggregated.recentUploadRate > 20
        ? "최근 업로드가 활발하여 트렌드에 참여할 좋은 시기입니다."
        : "경쟁이 적어 선점 기회가 있습니다.",
    ],
    risks: [
      aggregated.avgViews < 10000
        ? "전체적인 관심도가 낮아 성장이 더딜 수 있습니다."
        : "경쟁이 치열하여 차별화 전략이 필요합니다.",
    ],
  };
}

// ── Main Handler ───────────────────────────────────────

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!youtubeApiKey) {
    return res
      .status(500)
      .json({ error: "YOUTUBE_API_KEY environment variable is not set." });
  }

  const { keyword, regionCode = "KR" } = req.body || {};

  if (!keyword || typeof keyword !== "string") {
    return res
      .status(400)
      .json({ error: "keyword is required and must be a string." });
  }

  try {
    // Step 0: Check Supabase cache
    const { data: cached } = await supabase
      .from("keyword_analyses")
      .select("*")
      .eq("keyword", keyword.toLowerCase())
      .eq("region_code", regionCode)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (cached) {
      return res.status(200).json({
        keyword: cached.keyword,
        regionCode: cached.region_code,
        vibeScore: cached.vibe_score,
        summary: cached.summary,
        insights: cached.insights,
        opportunities: cached.opportunities,
        risks: cached.risks,
        aggregatedData: cached.aggregated_data,
        videos: cached.videos,
        fromCache: true,
      });
    }

    // Step 1: Search YouTube for videos
    const videoIds = await searchVideos(keyword, regionCode, youtubeApiKey);

    if (videoIds.length === 0) {
      return res.status(200).json({
        keyword,
        regionCode,
        vibeScore: 0,
        summary: `"${keyword}" 키워드에 대한 검색 결과가 없습니다.`,
        insights: [],
        opportunities: [],
        risks: [],
        aggregatedData: null,
        videos: [],
      });
    }

    // Step 2: Get detailed video statistics
    const videos = await getVideoDetails(videoIds, youtubeApiKey);

    // Step 3: Aggregate data
    const aggregated = aggregateData(keyword, regionCode, videos);

    // Step 4: Analyze with Gemini (or fallback)
    let analysis: {
      vibeScore: number;
      summary: string;
      insights: string[];
      opportunities: string[];
      risks: string[];
    };

    if (geminiApiKey) {
      try {
        analysis = await analyzeWithGemini(aggregated, geminiApiKey);
      } catch (geminiError: any) {
        console.error("Gemini API failed, using fallback:", geminiError.message);
        analysis = calculateFallbackScore(aggregated);
      }
    } else {
      console.warn("GEMINI_API_KEY not set, using fallback score calculation.");
      analysis = calculateFallbackScore(aggregated);
    }

    // Step 5: Build result
    const result: AnalysisResult = {
      keyword,
      regionCode,
      vibeScore: analysis.vibeScore,
      summary: analysis.summary,
      insights: analysis.insights,
      opportunities: analysis.opportunities,
      risks: analysis.risks,
      aggregatedData: aggregated,
      videos,
    };

    // Step 6: Save to Supabase cache (6 hour TTL)
    await supabase.from("keyword_analyses").upsert(
      {
        keyword: keyword.toLowerCase(),
        region_code: regionCode,
        vibe_score: result.vibeScore,
        summary: result.summary,
        insights: result.insights,
        opportunities: result.opportunities,
        risks: result.risks,
        aggregated_data: result.aggregatedData,
        videos: result.videos,
        analyzed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "keyword,region_code" }
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("analyze-keyword error:", error);
    return res.status(500).json({
      error: "Failed to analyze keyword.",
      message: error.message,
    });
  }
}
