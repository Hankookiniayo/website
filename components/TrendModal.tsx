
import React from 'react';
import { TrendItem, Platform } from '../types';

interface TrendModalProps {
  trend: TrendItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const getPlatformColor = (platform: Platform) => {
  switch (platform) {
    case Platform.TIKTOK: return '#ffffff';
    case Platform.INSTAGRAM: return '#E1306C';
    case Platform.YOUTUBE: return '#FF0000';
    case Platform.SPOTIFY: return '#1DB954';
    case Platform.NETFLIX: return '#E50914';
    default: return '#888888';
  }
};

export const TrendModal: React.FC<TrendModalProps> = ({ trend, isOpen, onClose }) => {
  if (!isOpen || !trend) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative h-64 w-full">
          <img src={trend.imageUrl} alt={trend.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
          <div className="absolute bottom-6 left-8">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block"
              style={{ backgroundColor: getPlatformColor(trend.platform), color: trend.platform === Platform.TIKTOK ? 'black' : 'white' }}
            >
              {trend.platform}
            </span>
            <h2 className="text-4xl font-black text-white">{trend.title}</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">화제성 지수</div>
              <div className="text-2xl font-bold text-emerald-400">{trend.volume}%</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">카테고리</div>
              <div className="text-xl font-bold text-white">{trend.category}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">상태</div>
              <div className="text-lg font-bold text-blue-400">상승 중</div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">트렌드 상세 분석</h4>
            <p className="text-gray-300 leading-relaxed italic">
              "{trend.description}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {trend.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 text-gray-400 rounded-lg text-xs">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
              관련 콘텐츠 보러가기
            </button>
            <button className="px-6 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
              공유하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
