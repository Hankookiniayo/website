import { supabase } from "./supabase.js";
import { youtubeItemToDbRow } from "./transforms.js";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

// Fetch trending videos from YouTube API and save to Supabase
export async function refreshTrendsFromYouTube(
  regionCode: string,
  apiKey: string
): Promise<void> {
  const response = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=10&key=${apiKey}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `YouTube API error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();
  const fetchedAt = new Date().toISOString();

  const rows = data.items.map((item: any, index: number) =>
    youtubeItemToDbRow(item, regionCode, index, fetchedAt)
  );

  // Insert new batch
  const { error: insertError } = await supabase
    .from("trending_videos")
    .insert(rows);

  if (insertError) {
    throw new Error(`Supabase insert error: ${insertError.message}`);
  }

  // Update cache metadata
  const nextRefresh = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  await supabase
    .from("cache_metadata")
    .upsert(
      {
        cache_key: `trends:${regionCode}`,
        last_refreshed: fetchedAt,
        next_refresh: nextRefresh,
        status: "ok",
      },
      { onConflict: "cache_key" }
    );
}

// Get latest cached trends from Supabase
export async function getCachedTrends(regionCode: string) {
  // Find the latest batch timestamp
  const { data: latestBatch } = await supabase
    .from("trending_videos")
    .select("fetched_at")
    .eq("region_code", regionCode)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  if (!latestBatch) {
    return null;
  }

  // Get all videos from that batch
  const { data: trends } = await supabase
    .from("trending_videos")
    .select("*")
    .eq("region_code", regionCode)
    .eq("fetched_at", latestBatch.fetched_at)
    .order("trending_rank", { ascending: true });

  return trends;
}

// Check if cache is stale (older than 30 minutes)
export async function isCacheStale(regionCode: string): Promise<boolean> {
  const { data: meta } = await supabase
    .from("cache_metadata")
    .select("*")
    .eq("cache_key", `trends:${regionCode}`)
    .single();

  if (!meta) return true;

  const lastRefreshed = new Date(meta.last_refreshed).getTime();
  const thirtyMinutes = 30 * 60 * 1000;

  return Date.now() - lastRefreshed > thirtyMinutes;
}
