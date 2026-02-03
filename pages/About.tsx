
import React from 'react';
import { Mail, Linkedin, Github } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Story */}
        <div className="max-w-4xl mx-auto mb-40 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-16 gradient-text">"저도 매일 야근하는<br />PM이었습니다"</h1>
          <div className="space-y-8 text-lg text-zinc-400 text-left glass p-12 rounded-[48px] leading-relaxed">
            <p>안녕하세요, VibeTrend 대표 [이름]입니다.</p>
            <p>
              저는 3년간 스타트업에서 콘텐츠 마케터로 일하며 매일 트렌드를 찾느라 유튜브, 틱톡, 인스타그램을
              5시간씩 뒤지고 다녔습니다. 핫한 유행을 누구보다 먼저 찾아야 한다는 압박감에 매일 밤늦게까지
              스크롤을 멈추지 못했죠.
            </p>
            <p className="text-white font-bold">"분명 더 효율적인 방법이 있을 텐데..."</p>
            <p>
              그렇게 시작된 VibeTrend는 이제 127명의 크리에이터가 매일 사용하는 트렌드 인텔리전스 플랫폼이 되었습니다.
              우리의 목표는 단순합니다: "모든 크리에이터가 데이터 기반으로 성공하는 세상"을 만드는 것입니다.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-40">
          <h2 className="text-3xl font-black mb-20 text-center">우리의 핵심 가치</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Data-Driven', desc: '모든 인사이트는 데이터에 기반합니다. 직감이 아닌 숫자로 증명합니다.' },
              { title: 'Creator-First', desc: '크리에이터의 성공이 곧 우리의 성공입니다. 사용자의 목소리를 가장 먼저 듣습니다.' },
              { title: 'Transparency', desc: '데이터 수집 방식과 분석 알고리즘을 투명하게 공개하여 신뢰를 구축합니다.' },
            ].map((v, i) => (
              <div key={i} className="glass p-10 rounded-3xl text-center">
                <div className="text-4xl font-black mb-6 text-zinc-800">0{i + 1}</div>
                <h3 className="text-2xl font-black mb-4">{v.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-black mb-20 text-center">팀 VibeTrend</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: '이OO', role: 'CEO & Product', bio: '전 AA 컴퍼니 PM, 콘텐츠 마케팅 전문가' },
              { name: '김OO', role: 'CTO & Dev', bio: '전 BB 테크 시니어 개발자, AI 시스템 설계' },
              { name: '박OO', role: 'Design Lead', bio: '전 CC 스튜디오 UI/UX 리드 디자이너' },
            ].map((t, i) => (
              <div key={i} className="glass p-10 rounded-3xl text-center group">
                <div className="w-24 h-24 bg-zinc-900 rounded-full mx-auto mb-8 overflow-hidden border border-white/5">
                  <img src={`https://picsum.photos/seed/team-${i}/200/200`} alt={t.name} className="grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <h4 className="text-xl font-bold mb-1">{t.name}</h4>
                <p className="text-xs text-blue-500 font-black uppercase mb-4">{t.role}</p>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">{t.bio}</p>
                <div className="flex justify-center gap-4 text-zinc-700">
                  <Mail size={16} className="hover:text-white cursor-pointer" />
                  <Linkedin size={16} className="hover:text-white cursor-pointer" />
                  <Github size={16} className="hover:text-white cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
