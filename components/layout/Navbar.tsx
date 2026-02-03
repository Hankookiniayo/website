import React, { useState } from 'react';
import { Category } from '../../types';

interface NavbarProps {
  onGoHome: () => void;
  onOpenShare: () => void;
  activeCategory: Category;
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenShare,
  activeCategory,
  categories,
  onSelectCategory,
  onToggleMobileMenu,
}) => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handleComingSoon = () => {
    alert('준비 중입니다.');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onGoHome}>
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-black text-sm">V</span>
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">VibeTrend</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                모든 서비스
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServicesOpen && (
                <div className="absolute top-full left-0 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-48 py-4">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { onSelectCategory(cat); setIsServicesOpen(false); }}
                        className={`w-full text-left px-5 py-2.5 text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                      >
                        {cat} 트렌드
                      </button>
                    ))}
                    <div className="border-t border-white/5 mt-2 pt-2 px-5">
                      <button onClick={handleComingSoon} className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors">기타 국가 준비중...</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onOpenShare}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              공유하기
            </button>

            <a
              href="#faq"
              className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              도움말
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button onClick={handleComingSoon} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">로그인</button>
          <button onClick={handleComingSoon} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">가입하기</button>
        </div>

        <button className="md:hidden" onClick={onToggleMobileMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </nav>
  );
};
