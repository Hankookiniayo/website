import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const VALID_REGIONS = ["KR", "US", "JP"];
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

// ── Category / Region helpers ──

const VIDEO_CATEGORIES: Record<string, string> = {
  "1": "영화/애니메이션", "2": "자동차/교통", "10": "음악",
  "15": "동물", "17": "스포츠", "19": "여행/이벤트",
  "20": "게임", "22": "일상/브이로그", "23": "코미디",
  "24": "엔터테인먼트", "25": "뉴스/정치", "26": "노하우/스타일",
  "27": "교육", "28": "과학/기술",
};

const REGION_FLAGS: Record<string, string> = { KR: "🇰🇷", US: "🇺🇸", JP: "🇯🇵" };
const REGION_LABELS: Record<string, string> = { KR: "한국", US: "미국", JP: "일본" };

function getCategoryName(id: string) { return VIDEO_CATEGORIES[id] || "기타"; }
function getFlag(code: string) { return REGION_FLAGS[code] || "🌍"; }
function getLabel(code: string) { return REGION_LABELS[code] || code; }

function calcVibeScore(views: number, rank: number): number {
  const trendingScore = Math.max(0, 70 - rank * 7);
  let viewScore = 0;
  if (views >= 10_000_000) viewScore = 30;
  else if (views >= 5_000_000) viewScore = 25;
  else if (views >= 3_000_000) viewScore = 22;
  else if (views >= 1_000_000) viewScore = 18;
  else if (views >= 500_000) viewScore = 14;
  else if (views >= 300_000) viewScore = 10;
  else if (views >= 100_000) viewScore = 6;
  else viewScore = Math.floor(views / 20000);
  return Math.min(100, trendingScore + viewScore);
}

function formatViews(v: number): string {
  if (v >= 100_000_000) return `${(v / 100_000_000).toFixed(1)}억`;
  if (v >= 10_000) return `${(v / 10_000).toFixed(1)}만`;
  return v.toLocaleString();
}

// ── YouTube → DB row ──

function youtubeItemToDbRow(item: any, regionCode: string, rank: number, fetchedAt: string) {
  const viewCount = parseInt(item.statistics.viewCount || "0", 10);
  const categoryId = item.snippet.categoryId || "";
  return {
    video_id: item.id,
    region_code: regionCode,
    title: item.snippet.title,
    description: item.snippet.description || "",
    channel_title: item.snippet.channelTitle || "",
    thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || "",
    video_category_id: categoryId,
    video_category_name: getCategoryName(categoryId),
    tags: item.snippet.tags?.slice(0, 5) || [],
    view_count: viewCount,
    like_count: parseInt(item.statistics.likeCount || "0", 10),
    comment_count: parseInt(item.statistics.commentCount || "0", 10),
    trending_rank: rank,
    vibe_score: calcVibeScore(viewCount, rank),
    fetched_at: fetchedAt,
  };
}

// ── DB row → Frontend TrendItem ──

function dbRowToTrendItem(row: any) {
  return {
    id: row.video_id,
    title: row.title,
    description: row.description || "",
    platform: "YouTube",
    category: getLabel(row.region_code),
    imageUrl: row.thumbnail_url || "",
    stats: `조회수 ${formatViews(row.view_count)}회`,
    volume: row.vibe_score,
    link: `https://www.youtube.com/watch?v=${row.video_id}`,
    tags: row.tags || [],
    videoCategory: row.video_category_name,
    viewCount: row.view_count,
    countryFlag: getFlag(row.region_code),
  };
}

// ── Main handler ──

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const region = (url.searchParams.get("region") || "KR").toUpperCase();

  if (!VALID_REGIONS.includes(region)) {
    return new Response(
      JSON.stringify({ error: `Invalid region. Use: ${VALID_REGIONS.join(", ")}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");
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

  try {
    // 1. Check if cache is stale
    const { data: meta } = await supabase
      .from("cache_metadata")
      .select("*")
      .eq("cache_key", `trends:${region}`)
      .single();

    const isStale = !meta || (Date.now() - new Date(meta.last_refreshed).getTime() > CACHE_DURATION_MS);

    // 2. Refresh from YouTube if stale
    if (isStale) {
      try {
        const ytRes = await fetch(
          `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${region}&maxResults=10&key=${youtubeApiKey}`
        );
        if (!ytRes.ok) {
          const errText = await ytRes.text();
          throw new Error(`YouTube API error (${ytRes.status}): ${errText}`);
        }
        const ytData = await ytRes.json();
        const fetchedAt = new Date().toISOString();

        const rows = ytData.items.map((item: any, i: number) =>
          youtubeItemToDbRow(item, region, i, fetchedAt)
        );

        const { error: insertErr } = await supabase.from("trending_videos").insert(rows);
        if (insertErr) throw new Error(`Supabase insert: ${insertErr.message}`);

        await supabase.from("cache_metadata").upsert(
          {
            cache_key: `trends:${region}`,
            last_refreshed: fetchedAt,
            next_refresh: new Date(Date.now() + CACHE_DURATION_MS).toISOString(),
            status: "ok",
          },
          { onConflict: "cache_key" }
        );
      } catch (refreshErr) {
        console.error(`YouTube refresh failed for ${region}:`, refreshErr);
        // Continue to serve cached data
      }
    }

    // 3. Serve from cache
    const { data: latestBatch } = await supabase
      .from("trending_videos")
      .select("fetched_at")
      .eq("region_code", region)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (!latestBatch) {
      return new Response(
        JSON.stringify({
          trends: [],
          globalInsight: `${getLabel(region)} YouTube 트렌드 데이터가 아직 없습니다.`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: trends } = await supabase
      .from("trending_videos")
      .select("*")
      .eq("region_code", region)
      .eq("fetched_at", latestBatch.fetched_at)
      .order("trending_rank", { ascending: true });

    const trendItems = (trends || []).map(dbRowToTrendItem);

    return new Response(
      JSON.stringify({
        trends: trendItems,
        globalInsight: `${getLabel(region)} YouTube에서 가장 인기 있는 실시간 트렌드입니다.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Trends function error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch trends.", message: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
