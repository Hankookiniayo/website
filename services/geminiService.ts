
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, Category, TrendResponse } from "../types";

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTrends = async (category: Category): Promise<TrendResponse> => {
  const prompt = `당신은 유튜브 전문 트렌드 분석가입니다. 
  현재 '${category}' 지역에서 가장 화제가 되고 있는 실시간 유튜브 트렌드 10개를 한국어로 생성하세요.
  오직 'YouTube' 플랫폼의 데이터만을 기반으로 해야 합니다.
  
  데이터 요구사항:
  1. title: 유튜브에서 유행하는 핵심 키워드 또는 영상 주제
  2. description: 해당 트렌드가 왜 유행하는지에 대한 구체적인 설명 (한국어)
  3. volume: 해당 키워드의 유튜브 내 조회수 상승률 또는 화제성 (10에서 100 사이의 정수)
  4. stats: 화제성을 나타내는 지표 (예: '24시간 내 조회수 200만 돌파', '급상승 동영상 1위')
  5. globalInsight: 현재 '${category}' 유튜브 생태계의 전반적인 흐름에 대한 요약 (한국어)

  응답은 반드시 JSON 형식이어야 합니다.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  category: { type: Type.STRING },
                  stats: { type: Type.STRING },
                  volume: { type: Type.NUMBER },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "title", "description", "platform", "category", "stats", "volume", "tags"]
              }
            },
            globalInsight: { type: Type.STRING }
          },
          required: ["trends", "globalInsight"]
        }
      }
    });

    const data = JSON.parse(response.text) as TrendResponse;
    
    data.trends = data.trends.map((t, idx) => ({
      ...t,
      id: t.id || `yt-trend-${category}-${idx}`,
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: `https://picsum.photos/seed/${t.id || idx}/600/400`,
      link: `https://www.youtube.com/results?search_query=${encodeURIComponent(t.title)}`
    }));

    return data;
  } catch (error) {
    console.error("Error fetching YouTube trends:", error);
    throw error;
  }
};
