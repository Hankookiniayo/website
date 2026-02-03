
import React from 'react';
import { ArrowRight, Search, Tag } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = [
    {
      category: '트렌드 분석',
      title: '2025 유튜브 트렌드 예측: 올해 뜰 10가지 키워드',
      excerpt: '유튜브 알고리즘의 변화와 2025년 상반기를 관통할 핵심 트렌드 10가지를 정리했습니다.',
      date: '2025.02.01',
      readTime: '8 min read',
      author: '이OO 대표'
    },
    {
      category: '가이드',
      title: '크리에이터를 위한 키워드 리서치 완벽 가이드',
      excerpt: '단순한 검색량 추이를 넘어, 경쟁도를 분석하고 틈새 시장을 찾는 실질적인 방법을 공개합니다.',
      date: '2025.01.28',
      readTime: '12 min read',
      author: '김OO 매니저'
    },
    {
      category: '비교 분석',
      title: 'TikTok vs YouTube: 플랫폼별 트렌드 차이 분석',
      excerpt: '숏폼의 강자 틱톡과 롱폼의 제왕 유튜브, 두 플랫폼에서 트렌드가 전파되는 속도와 방식의 차이를 알아봅니다.',
      date: '2025.01.20',
      readTime: '10 min read',
      author: '박OO 마케터'
    }
  ];

  return (
    <div className="pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h1 className="text-5xl font-black mb-6">인텔리전스 허브</h1>
          <p className="text-zinc-400 text-lg">성장을 가속화하는 최신 트렌드 리포트와 분석 가이드를 만나보세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {posts.map((post, i) => (
              <div key={i} className="glass p-10 rounded-[40px] group cursor-pointer hover:border-white/10 transition-all flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
                  <img src={`https://picsum.photos/seed/post-${i}/600/400`} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60" />
                </div>
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 bg-white/5 text-[10px] font-black text-zinc-400 rounded uppercase tracking-widest">{post.category}</span>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">{post.date}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 group-hover:text-blue-500 transition-colors">{post.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800" />
                      <span className="text-xs font-bold">{post.author}</span>
                    </div>
                    <span className="text-xs text-zinc-600 font-bold">{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <div>
              <h4 className="font-bold mb-6 flex items-center gap-2 text-zinc-400 uppercase text-xs tracking-widest">
                <Search size={14} /> Search Articles
              </h4>
              <div className="relative">
                 <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm focus:outline-none" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 flex items-center gap-2 text-zinc-400 uppercase text-xs tracking-widest">
                <Tag size={14} /> Categories
              </h4>
              <ul className="space-y-3">
                {['전체보기', '트렌드 분석', '가이드', '비교 분석', '인터뷰', '주간 리포트'].map((c, i) => (
                  <li key={i} className={`text-sm font-bold cursor-pointer hover:text-white transition-colors ${i === 0 ? 'text-white' : 'text-zinc-500'}`}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl glow-blue border-blue-500/20">
              <h4 className="text-xl font-black mb-4">지금 바로<br />시작해보세요</h4>
              <p className="text-xs text-zinc-500 mb-8 leading-relaxed">트렌드 세터들을 위한 데이터 인텔리전스 플랫폼</p>
              <button className="w-full py-4 bg-white text-black font-black rounded-xl text-xs">무료 체험하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
