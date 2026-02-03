import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-white/10 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-lg font-bold text-white pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-400 leading-relaxed text-sm">
          {answer}
        </p>
      )}
    </div>
  );
};

const faqData: FAQItemProps[] = [
  {
    question: 'VibeTrend는 어떤 데이터를 제공하나요?',
    answer: '한국, 미국, 일본의 유튜브에서 가장 인기 있는 영상의 제목, 카테고리, 조회수, 썸네일 등을 제공합니다.',
  },
  {
    question: '데이터는 얼마나 자주 업데이트되나요?',
    answer: 'YouTube Data API를 통해 실시간으로 업데이트됩니다.',
  },
  {
    question: '무료인가요?',
    answer: '현재 베타 버전은 완전 무료로 제공되고 있습니다.',
  },
  {
    question: '더 많은 국가가 추가될 예정인가요?',
    answer: '네, 향후 더 많은 국가를 지원할 계획입니다.',
  },
  {
    question: '트렌드 데이터를 내보낼 수 있나요?',
    answer: '현재는 웹에서만 확인 가능하며, 내보내기 기능은 추후 지원 예정입니다.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-20 px-6 border-t border-white/5 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#2E75B6] font-bold">FAQ</span>
          <h2 className="text-3xl font-black mt-2">자주 묻는 질문</h2>
        </div>

        <div>
          {faqData.map((item, i) => (
            <FAQItem key={i} {...item} />
          ))}
          <div className="border-t border-white/10" />
        </div>
      </div>
    </section>
  );
};
