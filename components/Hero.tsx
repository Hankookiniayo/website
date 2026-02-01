
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-16 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-400">실시간 글로벌 트렌드 • {new Date().toLocaleTimeString('ko-KR')}</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-gradient">
          글로벌 바이브를 <br />실시간으로 포착하세요.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
          VibeTrend는 TikTok, YouTube 등 글로벌 플랫폼의 파도를 통합하여 오늘날의 문화를 형성하는 트렌드를 보여줍니다. 트렌드를 단순히 따르지 말고, 그 파도에 올라타세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            지금 시작하기
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 font-bold rounded-full transition-all">
            서비스 소개
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
    </section>
  );
};
