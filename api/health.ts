import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasYoutubeKey: !!process.env.YOUTUBE_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    },
  });
}
