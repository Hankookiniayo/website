import React from 'react';

const beforeItems = [
  '크리에이터가 어떤 주제가 뜨고 있는지 파악하기 어려움',
  '수동으로 여러 채널을 돌아다니며 리서치 (하루 1-2시간)',
  '국가별 트렌드 차이를 한눈에 비교하기 어려움',
];

const afterItems = [
  '실시간 트렌드를 한 페이지에서 확인 → 즉각적 인사이트',
  '트렌드 리서치 시간 단축 (1-2시간 → 5분 이내)',
  '한국·미국·일본 탭 전환으로 간편하게 비교',
];

export const ValueProposition: React.FC = () => {
  return (
    <section id="value" className="py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#2E75B6] font-bold">WHY VIBETREND</span>
          <h2 className="text-3xl font-black mt-2">트렌드 분석의 패러다임을 바꿉니다</h2>
          <p className="text-gray-500 mt-3 text-sm">기존 방식과 VibeTrend를 비교해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400">기존 방식</h3>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <svg className="w-5 h-5 text-red-400/60 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-[#2E75B6]/10 border border-[#2E75B6]/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#2E75B6]/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#2E75B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2E75B6]">VibeTrend 사용 후</h3>
            </div>
            <ul className="space-y-4">
              {afterItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <svg className="w-5 h-5 text-[#2E75B6] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
