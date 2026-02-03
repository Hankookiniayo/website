
import React, { useState } from 'react';
import { Check, X, ShieldCheck, CreditCard, Lock, RefreshCw } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '0',
      desc: '기본적인 트렌드 흐름을 파악하고 싶은 크리에이터',
      features: ['하루 3회 트렌드 조회', '1개 국가 선택 (한국/미국/일본)', '기본 트렌드 랭킹', '-', '-', '-', '-', '-'],
      cta: '무료로 시작',
      featured: false,
    },
    {
      name: 'Pro',
      price: isAnnual ? '223,000' : '29,000',
      unit: isAnnual ? '/년' : '/월',
      desc: '데이터 기반 성장을 원하는 프로 크리에이터',
      features: ['무제한 트렌드 조회', '모든 국가 분석 (3개국)', 'AI 인사이트 & 점수', '콘텐츠 제작 가이드', '7일 히스토리 저장', '키워드 알림 (5개)', '-', '-'],
      cta: '14일 무료 체험',
      featured: true,
    },
    {
      name: 'Business',
      price: '99,000',
      unit: '/월',
      desc: '팀 단위 협업과 대규모 데이터 분석이 필요한 에이전시',
      features: ['Pro의 모든 기능 포함', '모든 국가 분석', 'AI 인사이트 무제한', '팀 협업 (최대 5명)', '30일 히스토리 저장', 'API 액세스', '우선 고객 지원', '전용 매니저'],
      cta: '영업팀 문의',
      featured: false,
    }
  ];

  const comparisonRows = [
    { label: '일일 조회 제한', free: '3회', pro: '무제한', biz: '무제한' },
    { label: '분석 가능 국가', free: '1개', pro: '전체', biz: '전체' },
    { label: 'AI 인사이트', free: false, pro: true, biz: true },
    { label: '히스토리 저장', free: false, pro: '7일', biz: '30일' },
    { label: '키워드 알림', free: false, pro: '5개', biz: '50개' },
    { label: '팀 협업', free: false, pro: false, biz: '5명' },
    { label: 'API 액세스', free: false, pro: false, biz: true },
  ];

  return (
    <div className="pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6">모든 크리에이터를 위한 플랜</h1>
          <p className="text-zinc-400 text-lg mb-10">30일 무료 체험으로 시작하세요. 언제든 취소 가능합니다.</p>

          <div className="inline-flex items-center glass p-1 rounded-full mb-12">
            <button
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual ? 'bg-white text-black' : 'text-zinc-400'}`}
              onClick={() => setIsAnnual(false)}
            >
              월간 결제
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative ${isAnnual ? 'bg-white text-black' : 'text-zinc-400'}`}
              onClick={() => setIsAnnual(true)}
            >
              연간 결제
              <span className="absolute -top-3 -right-6 bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">20% 할인</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, i) => (
            <div key={i} className={`glass p-10 rounded-3xl flex flex-col ${plan.featured ? 'border-emerald-500/30 glow-emerald scale-105 z-10' : 'border-white/5'}`}>
              {plan.featured && <div className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-4">가장 인기 있는 선택</div>}
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black">₩{plan.price}</span>
                <span className="text-zinc-500">{plan.unit}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-10 leading-relaxed min-h-[48px]">{plan.desc}</p>
              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    {feat === '-' ? (
                      <X className="w-5 h-5 text-zinc-700 mt-0.5" />
                    ) : (
                      <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                    )}
                    <span className={feat === '-' ? 'text-zinc-700' : 'text-zinc-300'}>{feat === '-' ? '기능 제한' : feat}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-full font-black transition-all ${plan.featured ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mb-32 overflow-x-auto">
          <h2 className="text-3xl font-black mb-12 text-center">기능 상세 비교</h2>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-6 font-bold text-zinc-500">기능</th>
                <th className="py-6 font-bold">Free</th>
                <th className="py-6 font-bold">Pro</th>
                <th className="py-6 font-bold">Business</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-6 text-sm font-bold text-zinc-400">{row.label}</td>
                  <td className="py-6 text-sm">
                    {typeof row.free === 'boolean' ? (row.free ? <Check className="text-emerald-500" /> : <X className="text-zinc-800" />) : row.free}
                  </td>
                  <td className="py-6 text-sm">
                    {typeof row.pro === 'boolean' ? (row.pro ? <Check className="text-emerald-500" /> : <X className="text-zinc-800" />) : row.pro}
                  </td>
                  <td className="py-6 text-sm font-bold">
                    {typeof row.biz === 'boolean' ? (row.biz ? <Check className="text-emerald-500" /> : <X className="text-zinc-800" />) : row.biz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16 border-t border-white/5">
          <div className="flex gap-4 items-start">
            <ShieldCheck className="w-10 h-10 text-zinc-500" />
            <div>
              <h4 className="font-bold mb-2">안전한 결제</h4>
              <p className="text-sm text-zinc-500">Stripe 보안 시스템을 통해 고객님의 결제 정보를 안전하게 처리합니다.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <RefreshCw className="w-10 h-10 text-zinc-500" />
            <div>
              <h4 className="font-bold mb-2">언제든 취소 가능</h4>
              <p className="text-sm text-zinc-500">결제 전 3일 이내에 알림을 보내드리며, 언제든 클릭 한 번으로 해지할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Lock className="w-10 h-10 text-zinc-500" />
            <div>
              <h4 className="font-bold mb-2">데이터 보안</h4>
              <p className="text-sm text-zinc-500">ISO 27001 인증을 준수하여 모든 비즈니스 데이터는 암호화되어 관리됩니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
