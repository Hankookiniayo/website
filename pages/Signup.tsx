
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Globe } from 'lucide-react';

const Signup: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 bg-black">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black tracking-tighter mb-6 inline-block">VIBETREND</Link>
          <h1 className="text-2xl font-black mb-2">무료로 시작하기</h1>
          <p className="text-zinc-500 text-sm">14일 무료 체험, 신용카드 불필요</p>
        </div>

        <div className="space-y-4 mb-8">
          <button className="w-full py-4 glass border-white/10 rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-white/5 transition-all">
            <Mail className="w-5 h-5" /> Google로 시작하기
          </button>
          <button className="w-full py-4 glass border-white/10 rounded-xl flex items-center justify-center gap-3 font-bold hover:bg-white/5 transition-all">
            <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] text-black">K</div> 카카오로 시작하기
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px bg-white/5 flex-1" />
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Or with email</span>
          <div className="h-px bg-white/5 flex-1" />
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-sm"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/20 text-sm"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
            가입하기
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-10">
          가입 시 VibeTrend의 <span className="underline cursor-pointer">이용약관</span> 및 <span className="underline cursor-pointer">개인정보처리방침</span>에 동의하게 됩니다.
        </p>

        <p className="text-center text-sm text-zinc-400 mt-6">
          이미 계정이 있으신가요? <Link to="/login" className="text-white font-bold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
