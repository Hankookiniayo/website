
import React, { useState, useEffect, useCallback } from 'react';
import { Category, TrendItem } from './types';
import { fetchTrends } from './services/youtubeService';
import { RankingList } from './components/RankingList';
import { TrendModal } from './components/TrendModal';
import { ShareModal } from './components/ShareModal';
import { ExtractionMechanism } from './components/ExtractionMechanism';

const CATEGORIES = Object.values(Category);

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.KOREA);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTrends = useCallback(async (cat: Category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrends(cat);
      setTrends(data.trends);
    } catch (err) {
      setError("데이터를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrends(activeCategory);
  }, [activeCategory, loadTrends]);

  const handleSelectTrend = (trend: TrendItem) => {
    setSelectedTrend(trend);
    setIsModalOpen(true);
  };

  const handleGoHome = () => {
    setActiveCategory(Category.KOREA);
    setSearchQuery('');
    setIsServicesOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComingSoon = () => {
    alert('준비 중입니다.');
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const filteredTrends = trends.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 flex flex-col overflow-y-auto">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleGoHome}>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black font-black text-sm">V</span>
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">VibeTrend</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <div className="relative">
                <button 
                  onClick={toggleServices}
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
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setActiveCategory(cat); setIsServicesOpen(false); }}
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
                onClick={() => setIsShareModalOpen(true)}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                공유하기
              </button>
              
              <a 
                href="https://notion.so" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                도움말 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={handleComingSoon} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">로그인</button>
            <button onClick={handleComingSoon} className="text-sm font-bold text-gray-400 hover:text-white transition-colors">가입하기</button>
          </div>
          
          <button className="md:hidden" onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-4 text-center px-6">
        <h1 className="text-4xl md:text-5xl mb-6 flex flex-wrap items-center justify-center leading-tight tracking-tight">
          <span className="font-light">트렌드세터를 위한 가장 강력한 도구,&nbsp;</span>
          <span className="font-black italic">Vibetrend</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-medium text-center w-full mb-10 whitespace-nowrap opacity-80">
          {activeCategory} 유튜브에서 매일 빠르게 변화하는 트렌드를 추적해보세요.
        </p>

        {/* Search Bar - Width matched with RankingList (max-w-2xl) */}
        <div className="max-w-2xl mx-auto relative group px-4 mb-12">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text"
            placeholder={`${activeCategory} 유튜브 키워드를 검색해보세요`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-sm placeholder:text-gray-600 shadow-2xl"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 flex flex-col justify-start min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => loadTrends(activeCategory)} className="px-6 py-2 bg-white text-black font-bold rounded-full">다시 시도</button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="mb-6 flex gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <RankingList trends={filteredTrends} onSelectTrend={handleSelectTrend} />
          </div>
        )}
      </main>

      {/* Extraction Mechanism Section */}
      <ExtractionMechanism />

      <TrendModal 
        trend={selectedTrend} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      {/* Mobile Nav */}
      {isNavMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0a] p-8 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="text-lg font-black tracking-tighter uppercase cursor-pointer" onClick={() => { handleGoHome(); setIsNavMenuOpen(false); }}>VibeTrend</span>
            <button onClick={() => setIsNavMenuOpen(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            <button onClick={() => {setIsShareModalOpen(true); setIsNavMenuOpen(false);}} className="text-left text-2xl font-black text-gray-300">공유하기</button>
            <a href="https://notion.so" className="text-left text-2xl font-black text-gray-300">도움말</a>
            <hr className="border-white/10" />
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">국가 선택</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setIsNavMenuOpen(false); }}
                className={`text-left text-2xl font-black ${activeCategory === cat ? 'text-white' : 'text-gray-700'}`}
              >
                {cat} 트렌드
              </button>
            ))}
            <hr className="border-white/10" />
            <button onClick={handleComingSoon} className="text-left text-2xl font-black text-gray-500">로그인</button>
            <button onClick={handleComingSoon} className="text-left text-2xl font-black text-gray-500">가입하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
