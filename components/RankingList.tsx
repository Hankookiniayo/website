
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
            className="group flex items-center justify-between py-3 border-b border-white/5 hover:bg-white/5 px-4 rounded-xl cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className="w-8 text-center text-base font-bold text-gray-500">
                {getRankIcon(index) || (index + 1)}
              </span>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2">
                  {trend.countryFlag && (
                    <span className="text-lg">{trend.countryFlag}</span>
                  )}
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                    {trend.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  {trend.videoCategory && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-medium">
                      {trend.videoCategory}
                    </span>
                  )}
                  {trend.viewCount && (
                    <span className="text-gray-500">
                      조회수 {trend.viewCount.toLocaleString()}회
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <span className="text-xs font-bold text-blue-400">
                #{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
