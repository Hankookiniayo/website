import React from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-colors">
    <div className="w-12 h-12 bg-[#2E75B6]/10 rounded-xl flex items-center justify-center text-[#2E75B6] mb-6">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const features: Feature[] = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '국가별 트렌드 필터링',
    description: '한국, 미국, 일본 3개국의 유튜브 트렌드를 탭 전환으로 간편하게 비교할 수 있습니다.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: '실시간 TOP 10 트렌드',
    description: 'YouTube Data API v3를 통해 실시간으로 가장 인기 있는 영상 TOP 10을 확인하세요.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: '키워드 검색',
    description: '키워드 기반으로 트렌드를 검색하여 관심 분야의 인기 콘텐츠를 빠르게 찾을 수 있습니다.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: '카테고리별 분류',
    description: '음악, 게임, 엔터테인먼트 등 카테고리별로 트렌드를 분류하여 보여줍니다.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: '조회수 및 화제성',
    description: '조회수와 화제성 지수를 표시하여 트렌드의 인기도를 한눈에 파악할 수 있습니다.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    title: '다크 모드 UI',
    description: '데이터 중심의 미니멀한 다크 모드 UI로 장시간 사용에도 눈의 피로를 최소화합니다.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 px-6 border-t border-white/5 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#2E75B6] font-bold">FEATURES</span>
          <h2 className="text-3xl font-black mt-2">VibeTrend의 핵심 기능</h2>
          <p className="text-gray-500 mt-3 text-sm">유튜브 트렌드 분석에 필요한 모든 것</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
