
import React from 'react';
import { Layers, Zap, Search, ShieldCheck, Cpu, Globe2, BarChart4, ArrowRight } from 'lucide-react';

const Service: React.FC = () => {
  return (
    <div className="pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <h1 className="text-5xl font-black mb-8 leading-tight">모든 크리에이터가<br />데이터 기반으로<br />성공하는 세상</h1>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              VibeTrend는 단순한 키워드 랭킹 제공을 넘어, 인공지능과 실시간 데이터 스트리밍을 통해
              실행 가능한(Actionable) 인사이트를 제공하는 글로벌 #1 트렌드 인텔리전스 플랫폼입니다.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black mb-2">95%+</p>
                <p className="text-zinc-500 text-sm">자체 테스트 데이터 정확도</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">15분</p>
                <p className="text-zinc-500 text-sm">실시간 데이터 업데이트 주기</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square glass rounded-[48px] p-8 flex flex-col justify-center items-center gap-8 glow-blue">
               <Cpu size={120} className="text-blue-500 animate-pulse" />
               <div className="text-center">
                 <p className="text-xl font-black mb-2">Gemini 3.0 Pro 엔진</p>
                 <p className="text-zinc-500 text-sm">업계 최고 수준의 AI 분석 성능</p>
               </div>
            </div>
          </div>
        </div>

        {/* Mechanism */}
        <div className="mb-40">
          <h2 className="text-4xl font-black mb-20 text-center">어떻게 작동하나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                stage: 'Stage 1',
                title: '탐색 단계',
                icon: Search,
                items: ['급상승 키워드 실시간 모니터링', '시드 기반 롱테일 키워드 발굴', '월별 시즌 키워드 파악']
              },
              {
                stage: 'Stage 2',
                title: '분석 단계',
                icon: Cpu,
                items: ['AI 필터링 (노이즈/스팸 제거)', 'YouTube ↔ TikTok 교차 검증', '실시간 화제성 점수 산출']
              },
              {
                stage: 'Stage 3',
                title: '최적화 단계',
                icon: BarChart4,
                items: ['직관적 랭킹 및 추이 시각화', '콘텐츠 제작 가이드라인 제공', '타겟 오디언스 및 키워드 제안']
              }
            ].map((s, i) => (
              <div key={i} className="glass p-10 rounded-3xl group hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all">
                  <s.icon size={32} />
                </div>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">{s.stage}</p>
                <h3 className="text-2xl font-black mb-8">{s.title}</h3>
                <ul className="space-y-4">
                  {s.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-40">
          <h2 className="text-4xl font-black mb-20 text-center">왜 VibeTrend인가?</h2>
          <div className="glass rounded-[40px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-10 py-8 text-zinc-500">기능</th>
                  <th className="px-10 py-8 text-zinc-500">기존 방식</th>
                  <th className="px-10 py-8 text-white font-black">VibeTrend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '데이터 업데이트', old: '일간/주간 수동 업데이트', new: '매 15분 자동 실시간 분석' },
                  { label: '인사이트 깊이', old: '단순 랭킹 리스트', new: 'AI 인사이트 + 액션 가이드' },
                  { label: '플랫폼 커버리지', old: 'YouTube 단일 분석', new: 'YouTube + TikTok 교차분석' },
                  { label: '가격 효율성', old: '월 ₩80,000 이상', new: '월 ₩29,000 (Pro 기준)' },
                ].map((row, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="px-10 py-8 font-bold text-zinc-400">{row.label}</td>
                    <td className="px-10 py-8 text-zinc-600">{row.old}</td>
                    <td className="px-10 py-8 text-white font-bold">{row.new}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-4xl font-black mb-20 text-center">로드맵</h2>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="flex gap-8 items-start relative">
              <div className="absolute left-[19px] top-10 bottom-0 w-px bg-white/5" />
              <div className="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center shrink-0 z-10 font-black">&#10003;</div>
              <div className="glass p-8 rounded-2xl flex-1 border-emerald-500/20">
                <h4 className="font-black text-xl mb-4">2025 Q1 - 베이스 구축</h4>
                <p className="text-zinc-400 text-sm">YouTube 한국/미국/일본 트렌드 및 Gemini AI 분석 엔진 구축 완료</p>
              </div>
            </div>
            <div className="flex gap-8 items-start relative">
               <div className="absolute left-[19px] top-10 bottom-0 w-px bg-white/5" />
              <div className="w-10 h-10 glass text-zinc-500 rounded-full flex items-center justify-center shrink-0 z-10 font-bold">...</div>
              <div className="glass p-8 rounded-2xl flex-1 border-white/5">
                <h4 className="font-black text-xl mb-4">2025 Q2 - 플랫폼 확장</h4>
                <p className="text-zinc-400 text-sm mb-4">TikTok 통합 (3월), Instagram Reels (4월), Spotify 차트 연동 (5월)</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white/5 text-[10px] rounded uppercase font-bold text-zinc-500">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
