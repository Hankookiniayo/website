
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, Clock, SearchX } from 'lucide-react';
import { TrendItem, Category } from '../types';
import { fetchTrends } from '../services/youtubeService';

const categoryMap: Record<string, Category> = {
  'KR': Category.KOREA,
  'US': Category.USA,
  'JP': Category.JAPAN,
};

const countryLabel: Record<string, string> = {
  'KR': '한국',
  'US': '미국',
  'JP': '일본',
};

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const country = (searchParams.get('country') || 'KR') as 'KR' | 'US' | 'JP';

  const [results, setResults] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        // 모든 국가의 트렌드를 가져와서 검색
        const countries: ('KR' | 'US' | 'JP')[] = ['KR', 'US', 'JP'];
        const allTrends: TrendItem[] = [];

        for (const c of countries) {
          const response = await fetchTrends(categoryMap[c]);
          allTrends.push(...response.trends);
        }

        // 키워드로 필터링 (제목, 태그, 카테고리에서 검색)
        const lowerQuery = query.toLowerCase();
        const filtered = allTrends.filter(trend =>
          trend.title.toLowerCase().includes(lowerQuery) ||
          trend.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          trend.videoCategory?.toLowerCase().includes(lowerQuery) ||
          trend.description?.toLowerCase().includes(lowerQuery)
        );

        setResults(filtered);
      } catch (err) {
        console.error('검색 오류:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [query]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&country=${country}`);
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
        {/* Back Button & Header */}
        <div className="mb-8">
          <Link to="/trends" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-6">
            <ArrowLeft size={16} />
            트렌드 리더보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-black">
            "<span className="text-blue-400">{query}</span>" 검색 결과
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            전체 국가(한국, 미국, 일본) YouTube 트렌드에서 검색합니다.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative mb-12 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="다른 키워드로 검색..."
            className="w-full pl-12 pr-20 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button
            onClick={() => {
              if (searchTerm.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}&country=${country}`);
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all"
          >
            검색
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <span className="ml-4 text-zinc-400 text-sm">검색 중...</span>
          </div>
        ) : results.length === 0 ? (
          /* 검색 결과 없음 - 죄송합니다 메시지 */
          <div className="glass rounded-3xl p-16 text-center">
            <SearchX className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-4">죄송합니다</h2>
            <p className="text-zinc-400 text-lg mb-2">
              "<span className="text-white font-bold">{query}</span>"에 대한 검색 결과를 찾을 수 없습니다.
            </p>
            <p className="text-zinc-500 text-sm mb-10">
              현재 YouTube 실시간 트렌드 데이터에 일치하는 키워드가 없습니다.<br />
              다른 키워드로 다시 검색해 주세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/trends"
                className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all"
              >
                트렌드 리더보드로 돌아가기
              </Link>
              <button
                onClick={() => {
                  setSearchTerm('');
                  document.querySelector('input')?.focus();
                }}
                className="px-8 py-3 glass text-white font-bold rounded-full hover:bg-white/5 transition-all"
              >
                다른 키워드 검색
              </button>
            </div>
          </div>
        ) : (
          /* 검색 결과 표시 */
          <div>
            <p className="text-zinc-400 text-sm mb-6">
              총 <span className="text-white font-bold">{results.length}개</span>의 결과를 찾았습니다.
            </p>
            <div className="glass rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">#</th>
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Title</th>
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest hidden md:table-cell">Category</th>
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest hidden md:table-cell">Country</th>
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Views</th>
                    <th className="px-8 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Vibe Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((trend, index) => (
                    <tr key={`${trend.id}-${index}`} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <span className="text-lg font-black italic text-zinc-600 group-hover:text-white transition-colors">
                          {index + 1}
                        </span>
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
                      <td className="px-8 py-6 hidden md:table-cell">
                        <span className="text-sm text-zinc-400">{trend.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-zinc-300">{formatViewCount(trend.viewCount)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${trend.volume}%` }} />
                          </div>
                          <span className="text-sm font-bold mono">{trend.volume}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
