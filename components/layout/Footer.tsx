import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black font-black text-sm">V</span>
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">VibeTrend</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              트렌드세터를 위한 가장 강력한 도구.
              <br />
              바이브코딩의 첫 번째 웹 프로젝트.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">서비스</h4>
            <ul className="space-y-3">
              <li><a href="#trend-tool" className="text-sm text-gray-500 hover:text-white transition-colors">한국 트렌드</a></li>
              <li><a href="#trend-tool" className="text-sm text-gray-500 hover:text-white transition-colors">미국 트렌드</a></li>
              <li><a href="#trend-tool" className="text-sm text-gray-500 hover:text-white transition-colors">일본 트렌드</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">정보</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-gray-500 hover:text-white transition-colors">서비스 소개</a></li>
              <li><a href="#faq" className="text-sm text-gray-500 hover:text-white transition-colors">도움말</a></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">기술 스택</h4>
            <ul className="space-y-3">
              <li className="text-sm text-gray-500">React 19 + TypeScript</li>
              <li className="text-sm text-gray-500">YouTube Data API v3</li>
              <li className="text-sm text-gray-500">Vercel</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            &copy; 2025 VibeTrend by 바이브코딩. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Claude AI와 함께 개발
          </p>
        </div>
      </div>
    </footer>
  );
};
