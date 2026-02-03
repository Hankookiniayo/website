import React from 'react';

interface StatCardProps {
  flag: string;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ flag, label, value, sub, accent }) => (
  <div className={`${accent ? 'bg-[#2E75B6]/10 border-[#2E75B6]/30' : 'bg-white/5 border-white/10'} border rounded-2xl p-8 text-center transition-colors hover:bg-white/[0.07]`}>
    <div className="text-3xl mb-3">{flag}</div>
    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">{label}</div>
    <div className={`text-3xl font-black mb-1 ${accent ? 'text-[#2E75B6]' : 'text-white'}`}>{value}</div>
    <div className="text-sm text-gray-500">{sub}</div>
  </div>
);

export const StatsSection: React.FC = () => {
  return (
    <section id="stats" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#2E75B6] font-bold">DATA COVERAGE</span>
          <h2 className="text-3xl font-black mt-2">실시간 트렌드 커버리지</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            flag="🇰🇷"
            label="대한민국"
            value="TOP 10"
            sub="실시간 인기 급상승"
          />
          <StatCard
            flag="🇺🇸"
            label="미국"
            value="TOP 10"
            sub="실시간 인기 급상승"
          />
          <StatCard
            flag="🇯🇵"
            label="일본"
            value="TOP 10"
            sub="실시간 인기 급상승"
          />
          <StatCard
            flag="🌍"
            label="한미일 합산"
            value="TOP 30"
            sub="3개국 통합 트렌드"
            accent
          />
        </div>
      </div>
    </section>
  );
};
