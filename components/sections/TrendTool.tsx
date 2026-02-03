import React from 'react';
import { Category, TrendItem } from '../../types';
import { RankingList } from '../RankingList';

interface TrendToolProps {
  activeCategory: Category;
  categories: Category[];
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  trends: TrendItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectTrend: (trend: TrendItem) => void;
}

export const TrendTool: React.FC<TrendToolProps> = ({
  activeCategory,
  categories,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  trends,
  loading,
  error,
  onRetry,
  onSelectTrend,
}) => {
  return (
    <section id="trend-tool" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#2E75B6] font-bold">REAL-TIME TRENDS</span>
          <h2 className="text-3xl font-black mt-2">국가별 실시간 TOP 10 트렌드</h2>
          <p className="text-gray-500 mt-3 text-sm">한국, 미국, 일본의 유튜브 인기 영상을 실시간으로 확인하세요.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group px-4 mb-8">
          <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 group-focus-within:text-[#2E75B6] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={`${activeCategory} 유튜브 키워드를 검색해보세요`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#2E75B6]/50 focus:bg-white/10 transition-all text-sm placeholder:text-gray-600 shadow-2xl"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center w-full min-h-[400px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#2E75B6]/20 border-t-[#2E75B6] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <p className="text-gray-500 mb-4">{error}</p>
              <button onClick={onRetry} className="px-6 py-2 bg-white text-black font-bold rounded-full">다시 시도</button>
            </div>
          ) : (
            <RankingList trends={trends} onSelectTrend={onSelectTrend} />
          )}
        </div>
      </div>
    </section>
  );
};
