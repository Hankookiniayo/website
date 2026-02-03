import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ── Types ──

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
  recentUploadRate: number;
}

// ── YouTube API helpers ──

async function searchVideos(keyword: string, regionCode: string, apiKey: string): Promise<string[]> {
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

async function getVideoDetails(videoIds: string[], apiKey: string): Promise<VideoItem[]> {
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
    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
    viewCount: parseInt(item.statistics.viewCount || "0", 10),
    likeCount: parseInt(item.statistics.likeCount || "0", 10),
    commentCount: parseInt(item.statistics.commentCount || "0", 10),
  }));
}

// ── Data Aggregation ──

function aggregateData(keyword: string, regionCode: string, videos: VideoItem[]): AggregatedData {
  const totalVideos = videos.length;
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.commentCount, 0);

  const avgViews = totalVideos > 0 ? Math.round(totalViews / totalVideos) : 0;
  const avgLikes = totalVideos > 0 ? Math.round(totalLikes / totalVideos) : 0;
  const avgComments = totalVideos > 0 ? Math.round(totalComments / totalVideos) : 0;

  const viewCounts = videos.map((v) => v.viewCount);
  const maxViews = viewCounts.length > 0 ? Math.max(...viewCounts) : 0;
  const minViews = viewCounts.length > 0 ? Math.min(...viewCounts) : 0;

  const channelMap = new Map<string, { videoCount: number; totalViews: number }>();
  for (const video of videos) {
    const existing = channelMap.get(video.channelTitle) || { videoCount: 0, totalViews: 0 };
    channelMap.set(video.channelTitle, {
      videoCount: existing.videoCount + 1,
      totalViews: existing.totalViews + video.viewCount,
    });
  }

  const topChannels = Array.from(channelMap.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5);

  const topVideos = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, 10);

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentVideos = videos.filter((v) => new Date(v.publishedAt).getTime() > sevenDaysAgo);
  const recentUploadRate = totalVideos > 0 ? Math.round((recentVideos.length / totalVideos) * 100) : 0;

  return {
    keyword, regionCode, totalVideos, totalViews, totalLikes, totalComments,
    avgViews, avgLikes, avgComments, maxViews, minViews,
    topChannels, topVideos, recentUploadRate,
  };
}

// ── Gemini API ──

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
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse Gemini response as JSON");
  return JSON.parse(jsonMatch[0]);
}

// ── Fallback score ──

function calculateFallbackScore(aggregated: AggregatedData) {
  let score = 0;
  if (aggregated.avgViews > 1000000) score += 40;
  else if (aggregated.avgViews > 500000) score += 35;
  else if (aggregated.avgViews > 100000) score += 28;
  else if (aggregated.avgViews > 50000) score += 20;
  else if (aggregated.avgViews > 10000) score += 12;
  else score += 5;

  const engagementRate = aggregated.avgViews > 0
    ? (aggregated.avgLikes + aggregated.avgComments) / aggregated.avgViews : 0;
  if (engagementRate > 0.05) score += 30;
  else if (engagementRate > 0.03) score += 24;
  else if (engagementRate > 0.02) score += 18;
  else if (engagementRate > 0.01) score += 12;
  else score += 5;

  if (aggregated.recentUploadRate > 50) score += 30;
  else if (aggregated.recentUploadRate > 30) score += 24;
  else if (aggregated.recentUploadRate > 15) score += 18;
  else if (aggregated.recentUploadRate > 5) score += 10;
  else score += 3;

  score = Math.min(100, Math.max(0, score));
  const level = score >= 80 ? "매우 높은" : score >= 60 ? "높은" : score >= 40 ? "보통" : score >= 20 ? "낮은" : "매우 낮은";

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

// ── Main Handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!youtubeApiKey) {
    return new Response(
      JSON.stringify({ error: "YOUTUBE_API_KEY is not set." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { keyword, regionCode = "KR" } = body;

  if (!keyword || typeof keyword !== "string") {
    return new Response(
      JSON.stringify({ error: "keyword is required and must be a string." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
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
      return new Response(
        JSON.stringify({
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
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Search YouTube
    const videoIds = await searchVideos(keyword, regionCode, youtubeApiKey);

    if (videoIds.length === 0) {
      return new Response(
        JSON.stringify({
          keyword, regionCode, vibeScore: 0,
          summary: `"${keyword}" 키워드에 대한 검색 결과가 없습니다.`,
          insights: [], opportunities: [], risks: [],
          aggregatedData: null, videos: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Get video details
    const videos = await getVideoDetails(videoIds, youtubeApiKey);

    // Step 3: Aggregate
    const aggregated = aggregateData(keyword, regionCode, videos);

    // Step 4: Analyze with Gemini or fallback
    let analysis: { vibeScore: number; summary: string; insights: string[]; opportunities: string[]; risks: string[] };

    if (geminiApiKey) {
      try {
        analysis = await analyzeWithGemini(aggregated, geminiApiKey);
      } catch (geminiError: any) {
        console.error("Gemini failed, using fallback:", geminiError.message);
        analysis = calculateFallbackScore(aggregated);
      }
    } else {
      analysis = calculateFallbackScore(aggregated);
    }

    // Step 5: Build result
    const result = {
      keyword, regionCode,
      vibeScore: analysis.vibeScore,
      summary: analysis.summary,
      insights: analysis.insights,
      opportunities: analysis.opportunities,
      risks: analysis.risks,
      aggregatedData: aggregated,
      videos,
    };

    // Step 6: Save to Supabase cache (6h TTL)
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

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("analyze-keyword error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze keyword.", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
