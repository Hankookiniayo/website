
import React from 'react';
import { TrendItem } from '../types';

interface RankingListProps {
  trends: TrendItem[];
  onSelectTrend: (trend: TrendItem) => void;
}

export const RankingList: React.FC<RankingListProps> = ({ trends, onSelectTrend }) => {
  // 볼륨 순으로 정렬하여 정확히 10개 표시
  const sortedTrends = [...trends].sort((a, b) => b.volume - a.volume).slice(0, 10);

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  return (
    <div className="w-full max-w-2xl bg-transparent">
      <div className="space-y-0.5">
        {sortedTrends.map((trend, index) => (
          <div 
            key={trend.id}
            onClick={() => onSelectTrend(trend)}
            className="group flex items-center justify-between py-2 border-b border-white/5 hover:bg-white/5 px-4 rounded-xl cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-6">
              <span className="w-8 text-center text-base font-bold text-gray-500">
                {getRankIcon(index) || (index + 1)}
              </span>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">
                    {trend.title}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    관련 뉴스 <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-blue-400">
                +{trend.volume > 90 ? (trend.volume/4).toFixed(1) : trend.volume}만
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
