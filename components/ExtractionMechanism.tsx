
import React, { useState } from 'react';

interface StageProps {
  number: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}

const StageItem: React.FC<StageProps> = ({ number, title, summary, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-white/10 py-6">
      <div 
        className="flex items-start justify-between cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-6">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-medium text-gray-400 shrink-0 group-hover:border-white/40 transition-colors">
            {number}
          </div>
          <div className="flex flex-col">
            <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
            <p className="text-sm text-gray-500 font-light">{summary}</p>
          </div>
        </div>
        <button className={`mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

const Card: React.FC<{ title: string; items: string[]; icon: React.ReactNode }> = ({ title, items, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
      {icon}
    </div>
    <h5 className="text-lg font-bold text-white mb-4">{title}</h5>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
    <button className="mt-6 flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-white transition-colors">
      자세히 보기 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
    </button>
  </div>
);

export const ExtractionMechanism: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto w-full px-6 py-20 border-t border-white/5">
      <div className="mb-12">
        <h3 className="text-3xl font-black mb-2">추출 매커니즘</h3>
        <p className="text-gray-500 text-sm">VibeTrend가 데이터를 분석하고 가치를 창출하는 3단계 프로세스</p>
      </div>

      <div className="space-y-2">
        <StageItem 
          number="01" 
          title="탐색 단계" 
          summary="급상승·시즌 키워드로 시장 기회를 포착하고, 시드 키워드로 아이디어를 확장합니다."
        >
          <Card 
            title="트렌드" 
            items={["인기 급상승 키워드에서 아이디어 획득", "트렌드 인사이트 리포트", "월별 시즌성 키워드 파악"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.966 7.966 0 01-2.343 5.657z" /></svg>}
          />
          <Card 
            title="키워드 확장" 
            items={["시드 키워드 기반으로 롱테일 키워드 발굴", "단어 포함/제외 필터", "고성능 확장 옵션"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>}
          />
        </StageItem>

        <StageItem 
          number="02" 
          title="분석 단계" 
          summary="Gemini 3.0 Pro 엔진을 통해 수집된 데이터의 문맥과 화제성을 심층 분석합니다."
        >
          <Card 
            title="지능형 필터링" 
            items={["노이즈 데이터 및 스팸 제거", "지역별 문화 맥락 분석", "유효 트렌드 점수 산출"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>}
          />
          <Card 
            title="플랫폼 통합" 
            items={["유튜브·틱톡 교차 검증", "실시간 화제성 가중치 적용", "글로벌 파급력 측정"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
          />
        </StageItem>

        <StageItem 
          number="03" 
          title="최적화 단계" 
          summary="추출된 트렌드를 사용자 맞춤형 인사이트로 가공하여 최종 제공합니다."
        >
          <Card 
            title="결과 시각화" 
            items={["직관적인 랭킹 리스트", "화제성 변화 추이 제공", "연관 태그 클러스터링"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <Card 
            title="액션 인사이트" 
            items={["콘텐츠 제작 가이드라인", "타겟 오디언스 제안", "마케팅 활용 팁"]}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </StageItem>
      </div>
    </section>
  );
};
