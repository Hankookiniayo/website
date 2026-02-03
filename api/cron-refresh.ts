import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase.js";
import { getCachedTrends } from "../lib/youtube.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify cron secret
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const regions = ["KR", "US", "JP"];
  const results: string[] = [];

  try {
    // 1. Generate daily snapshots for each region
    for (const region of regions) {
      const trends = await getCachedTrends(region);

      if (!trends || trends.length === 0) {
        results.push(`${region}: No cached data, skipped snapshot.`);
        continue;
      }

      const totalViews = trends.reduce(
        (sum: number, t: any) => sum + (t.view_count || 0),
        0
      );
      const avgViews =
        trends.length > 0 ? Math.round(totalViews / trends.length) : 0;

      // Count categories
      const categoryCount: Record<string, number> = {};
      for (const t of trends) {
        const cat = t.video_category_name || "기타";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      }

      const categoryBreakdown = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => ({
          category,
          count,
          percentage: Math.round((count / trends.length) * 100),
        }));

      const topCategory = categoryBreakdown[0]?.category || "기타";
      const topVideo = trends[0];

      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("trend_snapshots").upsert(
        {
          region_code: region,
          snapshot_date: today,
          total_views: totalViews,
          avg_views: avgViews,
          top_category: topCategory,
          top_video_id: topVideo?.video_id || null,
          top_video_title: topVideo?.title || null,
          video_count: trends.length,
          category_breakdown: categoryBreakdown,
        },
        { onConflict: "region_code,snapshot_date" }
      );

      if (error) {
        results.push(`${region}: Snapshot error - ${error.message}`);
      } else {
        results.push(`${region}: Snapshot saved.`);
      }
    }

    // 2. Clean up expired keyword analyses
    const { error: cleanupError } = await supabase
      .from("keyword_analyses")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (cleanupError) {
      results.push(`Keyword cleanup error: ${cleanupError.message}`);
    } else {
      results.push("Expired keyword analyses cleaned.");
    }

    // 3. Clean old trending videos (keep last 90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const { error: purgeError } = await supabase
      .from("trending_videos")
      .delete()
      .lt("fetched_at", cutoffDate.toISOString());

    if (purgeError) {
      results.push(`Purge error: ${purgeError.message}`);
    } else {
      results.push("Old trending videos purged (90+ days).");
    }

    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    console.error("Cron refresh error:", error);
    return res.status(500).json({
      error: "Cron refresh failed.",
      message: error.message,
    });
  }
}
