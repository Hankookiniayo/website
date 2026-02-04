
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const Navbar: React.FC = () => {
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

export default Navbar;
