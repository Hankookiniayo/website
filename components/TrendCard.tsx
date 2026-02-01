
import React from 'react';
import { TrendItem, Platform } from '../types';

interface TrendCardProps {
  trend: TrendItem;
}

const getPlatformColor = (platform: Platform) => {
  switch (platform) {
    case Platform.TIKTOK: return 'bg-black text-white';
    case Platform.INSTAGRAM: return 'bg-pink-600 text-white';
    case Platform.YOUTUBE: return 'bg-red-600 text-white';
    case Platform.SPOTIFY: return 'bg-green-500 text-black';
    default: return 'bg-gray-800 text-white';
  }
};

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  return (
    <div className="group relative bg-[#121212] border border-white/5 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:translate-y-[-4px] flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={trend.imageUrl} 
          alt={trend.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPlatformColor(trend.platform)} shadow-lg`}>
          {trend.platform}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{trend.category}</span>
          <span className="text-xs text-emerald-400 font-medium">{trend.stats}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-white transition-colors">
          {trend.title}
        </h3>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
          {trend.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {trend.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 pt-0 mt-4">
        <button className="w-full py-3 bg-white text-black text-sm font-bold rounded-lg transition-transform active:scale-95 hover:bg-gray-200">
          Explore the Vibe
        </button>
      </div>
    </div>
  );
};
