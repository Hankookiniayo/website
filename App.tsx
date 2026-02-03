
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Zap, TrendingUp, Search, Layers, ShieldCheck, HelpCircle, Mail, Github, Twitter, Linkedin, Star, Play } from 'lucide-react';
import Home from './pages/Home';
import Service from './pages/Service';
import Pricing from './pages/Pricing';
import Cases from './pages/Cases';
import Trends from './pages/Trends';
import Blog from './pages/Blog';
import About from './pages/About';
import Support from './pages/Support';
import Signup from './pages/Signup';
import SearchResults from './pages/SearchResults';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '서비스', path: '/service' },
    { name: '트렌드', path: '/trends' },
    { name: '성공사례', path: '/cases' },
    { name: '가격안내', path: '/pricing' },
    { name: '블로그', path: '/blog' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <TrendingUp className="text-black w-5 h-5" />
          </div>
          VIBETREND
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-white ${location.pathname === link.path ? 'text-white' : 'text-zinc-400'}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/signup" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95">
            무료로 시작하기
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-lg font-bold"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/signup"
            className="block w-full text-center py-4 bg-white text-black font-black rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            무료로 시작하기
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
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

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
