
import React from 'react';
import { ArrowRight, Star, TrendingUp, Users, Target, Clock } from 'lucide-react';

const CaseCard = ({ data, reversed }: any) => (
  <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 mb-32 group`}>
    <div className="lg:w-1/2 relative">
      <div className="aspect-video bg-zinc-900 rounded-[32px] overflow-hidden border border-white/5 relative group-hover:border-white/10 transition-all">
        <img src={`https://picsum.photos/seed/${data.id}/800/450`} alt={data.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex gap-4 mb-4">
            {data.metrics.map((m: any, i: number) => (
              <div key={i} className="glass px-4 py-2 rounded-xl">
                <p className="text-[10px] text-zinc-400 font-black uppercase mb-0.5">{m.label}</p>
                <p className="text-lg font-black text-emerald-500">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="lg:w-1/2 flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
          <img src={`https://picsum.photos/seed/user-${data.id}/100/100`} alt={data.name} />
        </div>
        <div>
          <h3 className="font-bold text-lg">{data.name}</h3>
          <p className="text-xs text-zinc-500">{data.role}, {data.subscribers}</p>
        </div>
      </div>
      <h2 className="text-3xl font-black mb-8 leading-tight">{data.solution}</h2>

      <div className="space-y-6 mb-10">
        <div className="flex gap-4">
          <div className="w-1 bg-red-500/30 rounded-full" />
          <div>
            <p className="text-xs text-zinc-500 font-black uppercase mb-1">Problem</p>
            <p className="text-zinc-300">"{data.problem}"</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1 bg-emerald-500/30 rounded-full" />
          <div>
            <p className="text-xs text-zinc-500 font-black uppercase mb-1">Result</p>
            <p className="text-zinc-200 font-semibold leading-relaxed">{data.result}</p>
          </div>
        </div>
      </div>

      <blockquote className="glass p-6 rounded-2xl italic text-zinc-400 mb-8 border-l-4 border-white relative">
        <span className="absolute -top-4 -left-2 text-6xl text-white/5 font-serif">"</span>
        {data.quote}
      </blockquote>

      <button className="inline-flex items-center gap-2 text-white font-bold group">
        상세 분석 리포트 보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const Cases: React.FC = () => {
  const cases = [
    {
      id: 'case1',
      name: '김OO님',
      role: '뷰티 크리에이터',
      subscribers: '구독자 3만',
      problem: '신규 콘텐츠 아이디어가 고갈되고 경쟁 채널들 사이에서 성장이 정체되었습니다.',
      solution: 'VibeTrend AI가 포착한 조기 트렌드로 3개월 만에 구독자 73% 성장',
      result: '조회수 평균 15만에서 80만으로 5.3배 증가하였으며, 수익은 월 180만원으로 3.6배 성장했습니다.',
      metrics: [{ label: '조회수', value: '5.3배↑' }, { label: '구독자', value: '+2.2만' }],
      quote: '이제 트렌드를 쫓지 않고 선도합니다. AI가 추천해준 키워드 덕분에 제 채널의 두 번째 전성기가 시작되었어요.',
    },
    {
      id: 'case2',
      name: '박OO님',
      role: '게임 스트리머',
      subscribers: '구독자 1만',
      problem: '핫한 게임을 하려 해도 이미 대형 유튜버들이 선점하여 노출 기회를 잡기 어려웠습니다.',
      solution: '플랫폼 교차 분석을 통한 검색 결과 1위 달성 전략',
      result: 'TikTok에서 시작된 인디 게임 유행을 YouTube에서 누구보다 빠르게 공략하여 국내 검색 1위를 차지했습니다.',
      metrics: [{ label: '검색 순위', value: '1위' }, { label: '조회수', value: '50만+' }],
      quote: 'VibeTrend 없었으면 불가능했을 거예요. 남들보다 2주 빠르게 트렌드를 잡는 것이 얼마나 강력한지 깨달았습니다.',
    },
    {
      id: 'case3',
      name: 'ㅇㅇ컴퍼니',
      role: '마케팅 에이전시',
      subscribers: '팀원 5명',
      problem: '수작업 트렌드 리서치에 매주 15시간 이상 소요되어 업무 효율이 매우 낮았습니다.',
      solution: 'Business API 연동으로 리서치 업무 87% 자동화 및 고객 만족도 향상',
      result: '리서치 시간을 주 2시간으로 단축하고, 데이터 기반의 캠페인 전략으로 광고 성과를 40% 향상시켰습니다.',
      metrics: [{ label: '시간 단축', value: '87%↓' }, { label: '광고 성과', value: '+40%' }],
      quote: '우리 워크플로우에 VibeTrend를 통합한 것이 최고의 선택이었습니다. 생산성이 비교할 수 없을 만큼 달라졌어요.',
    },
  ];

  return (
    <div className="pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-black mb-6">성공은 우연이 아닙니다</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">VibeTrend와 함께 트렌드를 지배한 크리에이터들의 실제 이야기를 확인하세요.</p>
        </div>

        {cases.map((c, i) => (
          <CaseCard key={c.id} data={c} reversed={i % 2 !== 0} />
        ))}

        <div className="bg-zinc-950 p-16 rounded-[48px] text-center border border-white/5">
          <h2 className="text-4xl font-black mb-8">당신의 성공 스토리를 만들어보세요</h2>
          <p className="text-zinc-500 mb-12 max-w-lg mx-auto">지금 바로 14일 무료 체험을 시작하고, 데이터가 만드는 놀라운 변화를 경험하세요.</p>
          <button className="px-12 py-5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-2xl shadow-white/5">
            무료 체험 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cases;
