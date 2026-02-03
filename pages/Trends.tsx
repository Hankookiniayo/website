
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Globe, BarChart3, Clock, Lock, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendItem, Category } from '../types';
import { fetchTrends } from '../services/youtubeService';

const categoryMap: Record<string, Category> = {
  'KR': Category.KOREA,
  'US': Category.USA,
  'JP': Category.JAPAN,
};

const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'KR' | 'US' | 'JP'>('KR');
  const [searchTerm, setSearchTerm] = useState('');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAnalyzed, setTotalAnalyzed] = useState(0);

  const loadTrends = async (tab: 'KR' | 'US' | 'JP') => {
    setLoading(true);
    setError(null);
    try {
      const category = categoryMap[tab];
      const response = await fetchTrends(category);
      setTrends(response.trends);
      setTotalAnalyzed(prev => prev === 0 ? response.trends.length * 1284 : prev);
    } catch (err: any) {
      setError(err.message || 'YouTube API 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends(activeTab);
  }, [activeTab]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&country=${activeTab}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&country=${activeTab}`);
    }
  };

  const formatViewCount = (count?: number): string => {
    if (!count) return '-';
    if (count >= 100000000) return `${(count / 100000000).toFixed(1)}억회`;
    if (count >= 10000) return `${(count / 10000).toFixed(0)}만회`;
    return `${count.toLocaleString()}회`;
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Clock size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">YOUTUBE TRENDING NOW</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl font-black">실시간 트렌드 리더보드</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 glass rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/5">
              <Filter size={16} /> 필터링
            </button>
            <button className="px-6 py-3 bg-white text-black rounded-full text-sm font-black hover:bg-zinc-200">
              맞춤 리포트 생성
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="text"
                  placeholder="트렌드 키워드 검색... (Enter로 검색)"
                  className="w-full pl-12 pr-20 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <button
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all"
                >
                  검색
                </button>
              </div>
              <div className="flex glass p-1 rounded-xl">
                {(['KR', 'US', 'JP'] as const).map((country) => (
                  <button
                    key={country}
                    onClick={() => setActiveTab(country)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === country ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {country === 'KR' ? '한국' : country === 'US' ? '미국' : '일본'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-emerald-500" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-black">분석된 총 트렌드</p>
                <p className="font-bold">{totalAnalyzed.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-xs text-emerald-500 font-bold">LIVE</div>
          </div>
        </div>

        {/* Trends List */}
        <div className="glass rounded-3xl overflow-hidden mb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <span className="ml-4 text-zinc-400 text-sm">YouTube 트렌드를 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-zinc-400 mb-4">{error}</p>
              <button onClick={() => loadTrends(activeTab)} className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-zinc-200">
                다시 시도
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Title</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest hidden md:table-cell">Category</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Views</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Vibe Score</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">AI Insights</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend, index) => (
                  <tr key={trend.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black italic text-zinc-600 group-hover:text-white transition-colors">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {trend.countryFlag && <span className="text-sm">{trend.countryFlag}</span>}
                          <p className="font-bold text-sm line-clamp-1 group-hover:text-white transition-colors">{trend.title}</p>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {trend.tags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {trend.videoCategory || 'YouTube'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-zinc-300">{formatViewCount(trend.viewCount)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${trend.volume}%` }} />
                        </div>
                        <span className="text-sm font-bold mono">{trend.volume}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {index < 2 ? (
                        <button className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg hover:scale-105 transition-all">
                          인사이트 보기
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                          <Lock size={12} />
                          <span className="text-xs font-bold">Pro 전용</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Upgrade Prompt */}
        <div className="glass p-12 rounded-[40px] text-center relative overflow-hidden glow-blue">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">모든 트렌드의 숨은 기회를 발견하세요</h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-10 text-lg">
            Pro 플랜으로 업그레이드하면 100위까지의 모든 트렌드와<br className="hidden md:block" /> AI가 분석한 세부 전략 리포트를 실시간으로 받아보실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-10 py-4 bg-white text-black font-black rounded-full shadow-2xl hover:bg-zinc-200 transition-all">
              14일 무료 체험 시작
            </button>
            <button className="px-10 py-4 glass text-white font-bold rounded-full hover:bg-white/5 transition-all">
              요금제 더 알아보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
