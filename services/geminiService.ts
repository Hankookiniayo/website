import { TrendItem } from "../types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// ── Types ──────────────────────────────────────────────

export interface GeminiAnalysis {
  vibeScore: number;
  summary: string;
  insights: string[];
  opportunities: string[];
  risks: string[];
  categoryBreakdown: { category: string; percentage: number }[];
}

export interface TrendInsight {
  videoId: string;
  summary: string;
}

// ── Gemini API call (for batch analysis) ───────────────

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(
    `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

function parseJsonResponse(text: string): any {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini 응답에서 JSON을 파싱할 수 없습니다.");
  }
  return JSON.parse(jsonMatch[0]);
}

// ── Trend Analysis ─────────────────────────────────────

export async function analyzeTrends(
  trends: TrendItem[],
  regionLabel: string
): Promise<GeminiAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn("VITE_GEMINI_API_KEY not set, using fallback analysis.");
    return buildFallbackAnalysis(trends, regionLabel);
  }

  const totalViews = trends.reduce((sum, t) => sum + (t.viewCount || 0), 0);
  const avgViews =
    trends.length > 0 ? Math.round(totalViews / trends.length) : 0;

  const categoryCount: Record<string, number> = {};
  for (const t of trends) {
    const cat = t.videoCategory || "기타";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  }

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, count]) => `${cat}(${count}개)`)
    .join(", ");

  const topVideos = trends
    .slice(0, 5)
    .map(
      (t, i) =>
        `${i + 1}. "${t.title}" - 조회수 ${(t.viewCount || 0).toLocaleString()}회`
    )
    .join("\n");

  const prompt = `당신은 YouTube 트렌드 분석 전문가입니다. 아래 ${regionLabel} YouTube 인기 트렌드 데이터를 분석해주세요.

데이터 요약:
- 분석 영상 수: ${trends.length}개
- 총 조회수: ${totalViews.toLocaleString()}회
- 평균 조회수: ${avgViews.toLocaleString()}회
- 카테고리 분포: ${topCategories}

인기 영상 TOP 5:
${topVideos}

다음 JSON 형식으로 응답해주세요 (마크다운 코드블록 없이 순수 JSON만):
{
  "vibeScore": <0-100 사이 숫자, 현재 트렌드 활성도>,
  "summary": "<현재 트렌드를 2-3문장으로 요약>",
  "insights": ["<인사이트1>", "<인사이트2>", "<인사이트3>"],
  "opportunities": ["<기회요인1>", "<기회요인2>"],
  "risks": ["<리스크1>", "<리스크2>"],
  "categoryBreakdown": [{"category": "<카테고리명>", "percentage": <비율>}]
}

점수 기준:
- 80-100: 폭발적 트렌드, 매우 높은 참여도
- 60-79: 강한 트렌드, 좋은 참여도
- 40-59: 보통 관심도
- 20-39: 낮은 관심도
- 0-19: 매우 니치하거나 하락세`;

  try {
    const text = await callGemini(prompt);
    const parsed = parseJsonResponse(text);

    return {
      vibeScore: Math.min(100, Math.max(0, parsed.vibeScore || 0)),
      summary: parsed.summary || "",
      insights: parsed.insights || [],
      opportunities: parsed.opportunities || [],
      risks: parsed.risks || [],
      categoryBreakdown: parsed.categoryBreakdown || [],
    };
  } catch (error: any) {
    console.error("Gemini 분석 실패, fallback 사용:", error.message);
    return buildFallbackAnalysis(trends, regionLabel);
  }
}

// ── Keyword Analysis ───────────────────────────────────

export async function analyzeKeyword(
  keyword: string,
  regionCode: string
): Promise<GeminiAnalysis> {
  const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/analyze-keyword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword, regionCode }),
  });

  if (!response.ok) {
    throw new Error(`분석 API 호출 실패 (${response.status})`);
  }

  const data = await response.json();

  return {
    vibeScore: data.vibeScore || 0,
    summary: data.summary || "",
    insights: data.insights || [],
    opportunities: data.opportunities || [],
    risks: data.risks || [],
    categoryBreakdown: [],
  };
}

// ── Single Video Analysis ──────────────────────────────

export const analyzeTrendItem = async (trend: TrendItem): Promise<TrendInsight> => {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API Key가 없습니다. 기본 요약을 반환합니다.');
    return {
      videoId: trend.id,
      summary: getDefaultSummary(trend),
    };
  }

  try {
    const prompt = `
다음 YouTube 영상을 2-3문장으로 간결하게 요약해주세요:

제목: ${trend.title}
카테고리: ${trend.videoCategory || 'YouTube'}
조회수: ${trend.viewCount?.toLocaleString() || '알 수 없음'}회
설명: ${trend.description?.substring(0, 200) || '설명 없음'}

요구사항:
- 2-3문장으로 간결하게
- 핵심 내용만 포함
- 존댓말 사용
- 이모지 사용 금지
`;

    const response = await fetch(
      `${GEMINI_API_BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }],
          }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.candidates[0].content.parts[0].text.trim();

    return {
      videoId: trend.id,
      summary,
    };
  } catch (error) {
    console.error('Gemini AI 분석 실패:', error);
    return {
      videoId: trend.id,
      summary: getDefaultSummary(trend),
    };
  }
};

// ── Fallback helpers ───────────────────────────────────

const getDefaultSummary = (trend: TrendItem): string => {
  const category = trend.videoCategory || 'YouTube';
  const views = trend.viewCount
    ? `조회수 ${formatViews(trend.viewCount)}회를 기록한`
    : '';

  return `${views} ${category} 카테고리의 인기 영상입니다. "${trend.title}" 제목으로 많은 관심을 받고 있습니다.`;
};

const formatViews = (views: number): string => {
  if (views >= 100000000) return `${(views / 100000000).toFixed(1)}억`;
  if (views >= 10000) return `${(views / 10000).toFixed(0)}만`;
  return views.toLocaleString();
};

// ── Fallback Analysis (for batch) ──────────────────────

function buildFallbackAnalysis(
  trends: TrendItem[],
  regionLabel: string
): GeminiAnalysis {
  const totalViews = trends.reduce((sum, t) => sum + (t.viewCount || 0), 0);
  const avgViews =
    trends.length > 0 ? Math.round(totalViews / trends.length) : 0;

  const categoryCount: Record<string, number> = {};
  for (const t of trends) {
    const cat = t.videoCategory || "기타";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  }

  const categoryBreakdown = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      percentage: Math.round((count / trends.length) * 100),
    }));

  const topCategory = categoryBreakdown[0]?.category || "기타";

  let score = 50;
  if (avgViews > 5000000) score += 30;
  else if (avgViews > 1000000) score += 20;
  else if (avgViews > 500000) score += 10;

  if (trends.length >= 10) score += 10;
  else if (trends.length >= 5) score += 5;

  score = Math.min(100, Math.max(0, score));

  const level =
    score >= 80
      ? "매우 높은"
      : score >= 60
        ? "높은"
        : score >= 40
          ? "보통"
          : "낮은";

  return {
    vibeScore: score,
    summary: `${regionLabel} YouTube에서 ${level} 트렌드 활성도를 보이고 있습니다. 평균 조회수 ${avgViews.toLocaleString()}회이며, ${topCategory} 카테고리가 가장 인기있습니다.`,
    insights: [
      `평균 조회수 ${avgViews.toLocaleString()}회로 ${level} 관심도를 보입니다.`,
      `${topCategory} 카테고리가 전체의 ${categoryBreakdown[0]?.percentage || 0}%를 차지합니다.`,
      `총 ${trends.length}개 인기 영상이 분석되었습니다.`,
    ],
    opportunities: [
      `${topCategory} 관련 콘텐츠 제작 시 높은 노출 가능성이 있습니다.`,
      `트렌드 키워드를 활용한 시의적절한 콘텐츠가 효과적입니다.`,
    ],
    risks: [
      `인기 카테고리의 경쟁이 치열하여 차별화가 필요합니다.`,
      `트렌드 변화가 빠르므로 지속적인 모니터링이 중요합니다.`,
    ],
    categoryBreakdown,
  };
}
