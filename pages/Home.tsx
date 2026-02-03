
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, TrendingUp, Search, Layers, Star, Play, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: '10:00', value: 400 },
  { name: '11:00', value: 600 },
  { name: '12:00', value: 550 },
  { name: '13:00', value: 800 },
  { name: '14:00', value: 1200 },
  { name: '15:00', value: 1100 },
  { name: '16:00', value: 1500 },
];

const FeatureCard = ({ icon: Icon, title, before, after, details }: any) => (
  <div className="glass p-8 rounded-2xl group hover:border-white/10 transition-all">
    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 group-hover:bg-white transition-all group-hover:text-black">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-6">{title}</h3>
    <div className="space-y-4 mb-8">
      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-xs text-red-400 font-bold uppercase mb-1">Before</p>
        <p className="text-sm text-zinc-300">"{before}"</p>
      </div>
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <p className="text-xs text-emerald-400 font-bold uppercase mb-1">After</p>
        <p className="text-sm text-zinc-200">"{after}"</p>
      </div>
    </div>
    <ul className="space-y-3 text-sm text-zinc-500">
      {details.map((item: string, i: number) => (
        <li key={i} className="flex items-center gap-2">
          <div className="w-1 h-1 bg-white rounded-full" /> {item}
        </li>
      ))}
    </ul>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 hero-grid">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-zinc-400">127+ CREATORS CHOSE VIBETREND</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1] gradient-text max-w-5xl mx-auto">
            트렌드세터를 위한<br />가장 강력한 도구
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            유튜브에서 매일 빠르게 변화하는 트렌드를 추적하고 분석하여,<br className="hidden md:block" /> 다음 바이럴 콘텐츠를 먼저 발견하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/signup" className="px-8 py-4 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 group shadow-xl shadow-white/10">
              무료로 시작하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/trends" className="px-8 py-4 glass text-white font-bold rounded-full hover:bg-white/5 transition-all">
              실시간 트렌드 보기
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto glass p-2 rounded-3xl glow-blue">
            <div className="bg-zinc-950 rounded-2xl overflow-hidden p-6 border border-white/5">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs text-zinc-500 mono">vibetrend.dashboard.v3</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-[300px] bg-white/5 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">실시간 화제성</p>
                    <p className="text-3xl font-black">94.8%</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">누적 분석 데이터</p>
                    <p className="text-3xl font-black">12.8k</p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 mb-1">예측 도달수</p>
                    <p className="text-3xl font-black text-emerald-500">+340%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: '누적 분석 트렌드', value: '12,847개' },
              { label: '사용자 만족도', value: '4.8/5.0' },
              { label: '평균 조회수 증가', value: '+340%' },
              { label: '재사용률', value: '92%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-zinc-500 text-sm mb-2">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">데이터로 증명하는 비즈니스 임팩트</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">유튜브 생태계의 모든 시그널을 하나로 연결하여 유의미한 비즈니스 기회로 전환합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={TrendingUp}
              title="실시간 트렌드 추적"
              before="어떤 콘텐츠를 만들어야 할지 막막했어요"
              after="실시간 트렌드를 보고 3일만에 조회수 100만 달성!"
              details={["국가별(한국/미국/일본) 트렌드", "카테고리별 필터링", "실시간 화제성 점수"]}
            />
            <FeatureCard
              icon={Zap}
              title="AI 기반 인사이트"
              before="데이터는 많은데 뭘 봐야 할지 모르겠어요"
              after="AI가 추천한 키워드로 3개월간 구독자 5,000명 증가"
              details={["Gemini 3.0 Pro 엔진", "데이터 노이즈 제거", "콘텐츠 제작 가이드"]}
            />
            <FeatureCard
              icon={Layers}
              title="플랫폼 교차 분석"
              before="유튜브만 보다가 트렌드를 놓쳤어요"
              after="틱톡 트렌드를 미리 발견해서 선점했습니다"
              details={["YouTube ↔ TikTok 연동", "파급력 측정 시스템", "오디언스 중첩 분석"]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-zinc-950 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">성공을 위한 3단계 프로세스</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 hidden md:block" />
            {[
              { step: 'Step 1', title: '탐색', desc: '급상승 키워드 & 시드 키워드 확장' },
              { step: 'Step 2', title: '분석', desc: 'AI 필터링 & 화제성 점수 산출' },
              { step: 'Step 3', title: '실행', desc: '콘텐츠 제작 가이드 & 타겟 제안' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 glass p-8 rounded-2xl text-center">
                <div className="w-10 h-10 bg-white text-black font-black rounded-full flex items-center justify-center mx-auto mb-6">
                  {i + 1}
                </div>
                <h4 className="text-zinc-500 font-bold mb-2">{item.step}</h4>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Teaser */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl font-black mb-6">실제 성공한 크리에이터들</h2>
              <p className="text-zinc-400">VibeTrend를 통해 정체기를 극복하고 제2의 전성기를 맞이한 사례들입니다.</p>
            </div>
            <Link to="/cases" className="text-white font-bold flex items-center gap-2 hover:underline">
              모든 사례 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <div className="mb-8">
                <p className="font-bold text-lg mb-1">김OO님</p>
                <p className="text-zinc-500 text-sm">뷰티 크리에이터, 구독자 3만</p>
              </div>
              <p className="text-2xl font-bold mb-10 leading-snug">
                "이제 트렌드를 쫓지 않고 선도합니다. 조회수가 평균 15만에서 80만으로 5배 이상 뛰었어요."
              </p>
              <div className="flex items-center gap-4 py-6 border-t border-white/5">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase mb-1">조회수 증가</p>
                  <p className="text-2xl font-black text-emerald-500">5.3배↑</p>
                </div>
                <div className="flex-1 border-l border-white/5 pl-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">기간</p>
                  <p className="text-2xl font-black">3개월</p>
                </div>
              </div>
            </div>
            <div className="glass p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
              </div>
              <div className="mb-8">
                <p className="font-bold text-lg mb-1">박OO님</p>
                <p className="text-zinc-500 text-sm">게임 스트리머, 구독자 1만</p>
              </div>
              <p className="text-2xl font-bold mb-10 leading-snug">
                "남들보다 2주 빠르게 트렌드를 잡으니까 검색 결과 1위를 차지할 수 있었습니다."
              </p>
              <div className="flex items-center gap-4 py-6 border-t border-white/5">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 uppercase mb-1">구독자 증가</p>
                  <p className="text-2xl font-black text-emerald-500">+250%</p>
                </div>
                <div className="flex-1 border-l border-white/5 pl-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">성과</p>
                  <p className="text-2xl font-black">국내 1위</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section Teaser */}
      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-16">모든 성장을 위한 합리적인 요금제</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="glass p-8 rounded-2xl flex flex-col">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-black mb-6">₩0</p>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 하루 3회 트렌드 조회</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1개 국가 선택</li>
              </ul>
              <Link to="/signup" className="w-full py-3 border border-white/10 rounded-full text-center font-bold hover:bg-white/5 transition-all">시작하기</Link>
            </div>
            <div className="glass p-8 rounded-2xl flex flex-col relative glow-emerald border-emerald-500/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-black mb-6">₩29,000<span className="text-sm text-zinc-500">/월</span></p>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 무제한 트렌드 조회</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI 인사이트 & 점수</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 모든 국가 분석</li>
              </ul>
              <Link to="/signup" className="w-full py-3 bg-white text-black rounded-full text-center font-black hover:bg-zinc-200 transition-all">14일 무료 체험</Link>
            </div>
            <div className="glass p-8 rounded-2xl flex flex-col">
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <p className="text-4xl font-black mb-6">₩99,000<span className="text-sm text-zinc-500">/월</span></p>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 팀 협업 (최대 5명)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> API 액세스</li>
              </ul>
              <Link to="/pricing" className="w-full py-3 border border-white/10 rounded-full text-center font-bold hover:bg-white/5 transition-all">문의하기</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-black relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 gradient-text">다음 바이럴 콘텐츠를<br />지금 발견하세요</h2>
          <p className="text-lg text-zinc-400 mb-12">14일 무료 체험, 신용카드 불필요. 이미 127명의 크리에이터가 사용 중입니다.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="px-12 py-5 bg-white text-black font-black rounded-full text-lg shadow-2xl shadow-white/10 hover:scale-105 transition-all">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
