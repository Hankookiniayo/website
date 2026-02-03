
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { TrendItem, Category } from '../types';
import { fetchTrends } from '../services/youtubeService';
import { analyzeTrendItem } from '../services/geminiService';

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
  const [summaryCache, setSummaryCache] = useState<{ [videoId: string]: string }>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [showVibeScoreInfo, setShowVibeScoreInfo] = useState(false);
  const [showAiInsightsInfo, setShowAiInsightsInfo] = useState(false);
  const lastRequestTime = useRef<number>(0);

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

  const handleGetSummary = async (trend: TrendItem) => {
    if (summaryCache[trend.id]) {
      return;
    }

    if (analyzingId) {
      return;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;
    if (timeSinceLastRequest < 4000) {
      console.warn('⏳ 요청이 너무 빠릅니다. 4초 후 다시 시도해주세요.');
      return;
    }

    if (requestCount >= 15) {
      console.warn('⚠️ 분당 요청 제한(15회)에 도달했습니다. 잠시 후 다시 시도해주세요.');
      setSummaryCache(prev => ({
        ...prev,
        [trend.id]: '⚠️ API 요청 제한에 도달했습니다. 잠시 후 다시 시도해주세요.'
      }));
      return;
    }

    setAnalyzingId(trend.id);
    lastRequestTime.current = now;
    setRequestCount(prev => prev + 1);

    try {
      const insight = await analyzeTrendItem(trend);
      setSummaryCache(prev => ({
        ...prev,
        [trend.id]: insight.summary,
      }));
    } catch (error) {
      console.error('요약 생성 실패:', error);
      setSummaryCache(prev => ({
        ...prev,
        [trend.id]: `${trend.videoCategory || 'YouTube'} 카테고리의 인기 영상입니다. "${trend.title}" 제목으로 많은 관심을 받고 있습니다.`
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRequestCount(0);
      console.log('✅ API 요청 카운터가 리셋되었습니다.');
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Views</th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest relative">
                    <div className="flex items-center gap-2">
                      <span>Vibe Score</span>
                      <button
                        onClick={() => setShowVibeScoreInfo(!showVibeScoreInfo)}
                        className="relative"
                      >
                        <HelpCircle size={14} className="text-zinc-600 hover:text-white transition-colors cursor-help" />
                        {showVibeScoreInfo && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 glass p-4 rounded-xl border border-white/10 z-50 shadow-2xl">
                            <div className="flex items-start gap-2 mb-2">
                              <BarChart3 size={14} className="text-blue-400 mt-0.5" />
                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">VIBE SCORE란?</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              조회수와 순위를 종합하여 계산된 화제성 점수입니다. 높을수록 현재 더 뜨거운 트렌드를 의미합니다.
                            </p>
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-900 border-l border-t border-white/10 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <span>AI Insights</span>
                      <button
                        onClick={() => setShowAiInsightsInfo(!showAiInsightsInfo)}
                        className="relative"
                      >
                        <HelpCircle size={14} className="text-zinc-600 hover:text-white transition-colors cursor-help" />
                        {showAiInsightsInfo && (
                          <div className="absolute top-full right-0 mt-2 w-72 glass p-4 rounded-xl border border-white/10 z-50 shadow-2xl">
                            <div className="flex items-start gap-2 mb-2">
                              <Sparkles size={14} className="text-blue-400 mt-0.5" />
                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI INSIGHTS란?</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              Gemini AI가 영상 제목, 카테고리, 조회수를 분석하여 2-3문장으로 핵심 내용을 요약해드립니다.
                            </p>
                            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-zinc-900 border-l border-t border-white/10 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  </th>
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
                        <div className="flex items-center gap-2 mb-2">
                          {trend.countryFlag && <span className="text-sm">{trend.countryFlag}</span>}
                          <p className="font-bold text-sm group-hover:text-white transition-colors">{trend.title}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {trend.videoCategory || 'YouTube'}
                          </span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {trend.tags?.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-zinc-600 bg-white/5 px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
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
                    <td className="px-8 py-6 text-right relative group">
                      <button
                        className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg hover:bg-zinc-200 transition-all"
                        onClick={() => handleGetSummary(trend)}
                        disabled={analyzingId === trend.id}
                      >
                        {analyzingId === trend.id ? '분석 중...' : summaryCache[trend.id] ? '요약 보기' : '영상 요약'}
                      </button>

                      {summaryCache[trend.id] && (
                        <div className={`absolute ${index > trends.length - 3 ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-80 glass p-5 rounded-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-2xl`}>
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-blue-400 text-xs">✨</span>
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">AI 요약</span>
                          </div>
                          <p className="text-sm text-zinc-200 leading-relaxed">
                            {summaryCache[trend.id]}
                          </p>
                          <div className={`absolute ${index > trends.length - 3 ? '-bottom-2 rotate-[225deg]' : '-top-2 rotate-45'} right-6 w-4 h-4 bg-zinc-900 border-l border-t border-white/10`}></div>
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
