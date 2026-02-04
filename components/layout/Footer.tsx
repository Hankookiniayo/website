
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Link to="/" className="text-2xl font-black tracking-tighter mb-6 block">VIBETREND</Link>
            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed mb-8">
              글로벌 유튜브 트렌드 분석을 통해 크리에이터와 마케터의 성장을 돕는 인텔리전스 플랫폼입니다.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer" />
              <Github className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-zinc-600 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">플랫폼</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/trends" className="hover:text-white">실시간 트렌드</Link></li>
              <li><Link to="/service" className="hover:text-white">AI 인사이트</Link></li>
              <li><Link to="/pricing" className="hover:text-white">요금제 안내</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">리소스</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/blog" className="hover:text-white">블로그</Link></li>
              <li><Link to="/cases" className="hover:text-white">성공 사례</Link></li>
              <li><Link to="/support" className="hover:text-white">고객 센터</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">회사</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/about" className="hover:text-white">회사 소개</Link></li>
              <li><Link to="/about" className="hover:text-white">채용</Link></li>
              <li><span className="hover:text-white cursor-pointer">이용약관</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-zinc-500">&copy; 2025 VibeTrend. All rights reserved.</p>
          <div className="flex gap-8 text-xs text-zinc-500">
            <span>Cookie Preferences</span>
            <span>Trust Center</span>
            <span>Legal and Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
