import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 text-center px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-400">실시간 글로벌 유튜브 트렌드 분석</span>
        </div>

        <h1 className="text-4xl md:text-6xl mb-6 leading-tight tracking-tight">
          <span className="font-light">트렌드세터를 위한 가장 강력한 도구,&nbsp;</span>
          <br className="hidden md:block" />
          <span className="font-black italic text-white">VibeTrend</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 opacity-80 leading-relaxed">
          유튜브에서 매일 빠르게 변화하는 트렌드를 추적해보세요.<br className="hidden md:block" />
          한국, 미국, 일본의 실시간 인기 영상을 한눈에 확인할 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#trend-tool"
            className="px-8 py-4 bg-white text-black font-bold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            트렌드 보기
          </a>
          <a
            href="#features"
            className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 font-bold rounded-full transition-all"
          >
            서비스 소개
          </a>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
    </section>
  );
};
