
import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{question}</h4>
        {isOpen ? <ChevronUp size={20} className="text-zinc-600" /> : <ChevronDown size={20} className="text-zinc-600" />}
      </button>
      {isOpen && (
        <div className="mt-6 text-zinc-500 leading-relaxed text-sm animate-in fade-in slide-in-from-top-2">
          {answer}
        </div>
      )}
    </div>
  );
};

const Support: React.FC = () => {
  const faqs = [
    { q: 'VibeTrend는 어떻게 작동하나요?', a: 'YouTube 및 TikTok의 실시간 데이터를 API로 수집하여, Gemini AI 엔진을 통해 화제성과 지속 가능성을 분석합니다. 노이즈를 제거하고 실제 콘텐츠 제작에 도움이 되는 인사이트를 추출합니다.' },
    { q: '무료 플랜과 유료 플랜의 차이는 무엇인가요?', a: '무료 플랜은 하루 3회의 검색 제한과 기본 랭킹만 제공됩니다. Pro 플랜은 무제한 검색, AI 상세 인사이트, 모든 국가(한국/미국/일본) 분석, 히스토리 저장 등 모든 핵심 기능을 제공합니다.' },
    { q: '데이터는 얼마나 자주 업데이트되나요?', a: 'VibeTrend의 모든 데이터는 매 15분마다 새롭게 갱신되어, 지금 이 순간 가장 뜨거운 트렌드를 놓치지 않고 확인할 수 있습니다.' },
    { q: '환불 정책은 어떻게 되나요?', a: '유료 결제 후 14일 이내에는 100% 환불이 가능합니다. 이후에는 사용 기간을 제외한 잔여 금액에 대해 비례 환불을 진행해 드립니다.' },
    { q: '기업용 API를 사용할 수 있나요?', a: '네, Business 플랜을 통해 제공되는 API를 사용하여 자사 서비스나 워크플로우에 트렌드 데이터를 통합할 수 있습니다. 자세한 연동 문서는 가입 후 제공됩니다.' }
  ];

  return (
    <div className="pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-black mb-6">도움이 필요하신가요?</h1>
          <p className="text-zinc-400 text-lg">궁금한 점이 있다면 언제든 문의해 주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
          <div className="glass p-10 rounded-3xl text-center">
            <Mail className="w-10 h-10 text-blue-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">이메일 문의</h3>
            <p className="text-zinc-500 text-sm mb-6">support@vibetrend.com</p>
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest leading-loose">평일 24시간 이내 응답 (Pro 우선)</p>
          </div>
          <div className="glass p-10 rounded-3xl text-center">
            <MessageSquare className="w-10 h-10 text-emerald-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">카카오톡 채널</h3>
            <p className="text-zinc-500 text-sm mb-6">@vibetrend</p>
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest leading-loose">실시간 채팅: 평일 10:00 - 18:00</p>
          </div>
          <div className="glass p-10 rounded-3xl text-center">
            <HelpCircle className="w-10 h-10 text-amber-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">가이드 문서</h3>
            <p className="text-zinc-500 text-sm mb-6">docs.vibetrend.com</p>
            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest leading-loose">시작 가이드 및 API 기술 문서</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">자주 묻는 질문</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
