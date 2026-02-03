
import { Platform, Category, TrendResponse, TrendItem } from "../types";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// Category to region code mapping
const getCategoryRegionCode = (category: Category): string => {
  switch (category) {
    case Category.KOREA:
      return "KR";
    case Category.USA:
      return "US";
    case Category.JAPAN:
      return "JP";
    default:
      return "KR";
  }
};

// Get flag emoji for category
const getCategoryFlag = (category: Category): string => {
  switch (category) {
    case Category.KOREA:
      return "🇰🇷";
    case Category.USA:
      return "🇺🇸";
    case Category.JAPAN:
      return "🇯🇵";
    default:
      return "🌍";
  }
};

// Mock data for testing
const getMockTrends = (category: Category): TrendResponse => {
  const flag = getCategoryFlag(category);
  const mockTrends: TrendItem[] = [
    {
      id: "mock-1",
      title: "🔥 2025년 최신 K-POP 메들리 | 인기곡 모음",
      description: "2025년 가장 인기있는 K-POP 곡들을 모아봤습니다!",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/kpop1/600/400",
      stats: "조회수 1,234만회",
      volume: 95,
      link: "#",
      tags: ["KPOP", "음악", "메들리"],
      videoCategory: "음악",
      viewCount: 12340000,
      countryFlag: flag
    },
    {
      id: "mock-2",
      title: "프로게이머의 완벽한 플레이! 롤 하이라이트",
      description: "프로게이머의 신급 플레이 모음집",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/lol1/600/400",
      stats: "조회수 890만회",
      volume: 88,
      link: "#",
      tags: ["게임", "LOL", "하이라이트"],
      videoCategory: "게임",
      viewCount: 8900000,
      countryFlag: flag
    },
    {
      id: "mock-3",
      title: "요즘 핫한 먹방! 신메뉴 리뷰",
      description: "최신 트렌드 먹방 리뷰",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/food1/600/400",
      stats: "조회수 560만회",
      volume: 82,
      link: "#",
      tags: ["먹방", "리뷰", "음식"],
      videoCategory: "엔터테인먼트",
      viewCount: 5600000,
      countryFlag: flag
    },
    {
      id: "mock-4",
      title: "충격! 이번주 연예계 이슈 총정리",
      description: "이번주 화제가 된 연예계 소식",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/celeb1/600/400",
      stats: "조회수 430만회",
      volume: 76,
      link: "#",
      tags: ["연예", "이슈", "셀럽"],
      videoCategory: "엔터테인먼트",
      viewCount: 4300000,
      countryFlag: flag
    },
    {
      id: "mock-5",
      title: "프리미어리그 하이라이트 | 손흥민 골",
      description: "손흥민의 환상적인 골 장면",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/soccer1/600/400",
      stats: "조회수 380만회",
      volume: 72,
      link: "#",
      tags: ["축구", "손흥민", "프리미어리그"],
      videoCategory: "스포츠",
      viewCount: 3800000,
      countryFlag: flag
    },
    {
      id: "mock-6",
      title: "일상 브이로그 | 도쿄 여행 Day 1",
      description: "도쿄 여행 첫째날 브이로그",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/vlog1/600/400",
      stats: "조회수 290만회",
      volume: 68,
      link: "#",
      tags: ["브이로그", "여행", "도쿄"],
      videoCategory: "일상/브이로그",
      viewCount: 2900000,
      countryFlag: flag
    },
    {
      id: "mock-7",
      title: "AI 기술의 미래 | 2025 전망",
      description: "인공지능 기술의 최신 트렌드",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/tech1/600/400",
      stats: "조회수 210만회",
      volume: 64,
      link: "#",
      tags: ["AI", "기술", "미래"],
      videoCategory: "과학/기술",
      viewCount: 2100000,
      countryFlag: flag
    },
    {
      id: "mock-8",
      title: "웃긴 동물 영상 모음 🐶🐱",
      description: "귀여운 동물들의 재미있는 순간들",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/animal1/600/400",
      stats: "조회수 180만회",
      volume: 60,
      link: "#",
      tags: ["동물", "귀여움", "웃긴"],
      videoCategory: "동물",
      viewCount: 1800000,
      countryFlag: flag
    },
    {
      id: "mock-9",
      title: "오늘의 뉴스 | 주요 이슈 정리",
      description: "오늘의 핫한 뉴스 총정리",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/news1/600/400",
      stats: "조회수 150만회",
      volume: 56,
      link: "#",
      tags: ["뉴스", "이슈", "시사"],
      videoCategory: "뉴스/정치",
      viewCount: 1500000,
      countryFlag: flag
    },
    {
      id: "mock-10",
      title: "인기 코미디 클립 모음",
      description: "웃음을 참을 수 없는 개그 영상",
      platform: Platform.YOUTUBE,
      category: category,
      imageUrl: "https://picsum.photos/seed/comedy1/600/400",
      stats: "조회수 120만회",
      volume: 52,
      link: "#",
      tags: ["코미디", "웃긴", "개그"],
      videoCategory: "코미디",
      viewCount: 1200000,
      countryFlag: flag
    }
  ];

  return {
    trends: mockTrends,
    globalInsight: `${category} YouTube에서 가장 인기 있는 실시간 트렌드입니다. (테스트 데이터)`
  };
};

export const fetchTrends = async (category: Category): Promise<TrendResponse> => {
  if (USE_MOCK_DATA) {
    console.log('Mock 데이터 사용 중');
    return getMockTrends(category);
  }

  const regionCode = getCategoryRegionCode(category);

  try {
    // Call Supabase Edge Function
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/trends?region=${regionCode}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      trends: data.trends,
      globalInsight: data.globalInsight
    };
  } catch (error: any) {
    console.error("Error fetching trends:", error);
    console.warn("API 실패, mock 데이터를 사용합니다:", error.message);
    return getMockTrends(category);
  }
};
