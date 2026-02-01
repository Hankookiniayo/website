
import React, { useMemo } from 'react';
import { TrendItem, Platform } from '../types';

interface MindMapProps {
  trends: TrendItem[];
  centerLabel: string; // "TREND"로 고정될 예정
  onSelectTrend: (trend: TrendItem) => void;
}

const getPlatformColor = (platform: Platform) => {
  switch (platform) {
    case Platform.TIKTOK: return '#ffffff';
    case Platform.INSTAGRAM: return '#E1306C';
    case Platform.YOUTUBE: return '#FF0000';
    case Platform.SPOTIFY: return '#1DB954';
    case Platform.NETFLIX: return '#E50914';
    default: return '#888888';
  }
};

export const MindMap: React.FC<MindMapProps> = ({ trends, centerLabel, onSelectTrend }) => {
  const width = 1000;
  const height = 700;
  const centerX = width / 2;
  const centerY = height / 2;

  const nodes = useMemo(() => {
    return trends.map((trend, i) => {
      // 반원씩 나누어 배치 (좌우 대칭형 마인드맵 스타일)
      const isRight = i < trends.length / 2;
      const sideIndex = isRight ? i : i - Math.floor(trends.length / 2);
      const sideCount = isRight ? Math.floor(trends.length / 2) : trends.length - Math.floor(trends.length / 2);
      
      const angleStep = Math.PI / (sideCount + 1);
      const angle = isRight 
        ? -Math.PI / 2 + angleStep * (sideIndex + 1)
        : Math.PI / 2 + angleStep * (sideIndex + 1);

      const distance = 280 + (trend.volume * 0.5);
      
      return {
        ...trend,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        isRight,
        angle
      };
    });
  }, [trends, centerX, centerY]);

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl p-4 min-h-[700px]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 연결 브랜치 (곡선) */}
        {nodes.map((node) => {
          const color = getPlatformColor(node.platform);
          // 큐빅 베지어 곡선으로 부드러운 연결선 구현
          const controlX = centerX + (node.x - centerX) * 0.5;
          const pathData = `M ${centerX} ${centerY} C ${controlX} ${centerY}, ${controlX} ${node.y}, ${node.x} ${node.y}`;
          
          return (
            <path
              key={`path-${node.id}`}
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="3"
              className="opacity-40 transition-all duration-500"
            />
          );
        })}

        {/* 중앙 노드 (TREND) */}
        <rect
          x={centerX - 70}
          y={centerY - 35}
          width="140"
          height="70"
          rx="20"
          fill="#1a1a1a"
          stroke="white"
          strokeWidth="3"
          filter="url(#glow)"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          className="text-2xl font-black tracking-tighter select-none"
        >
          TREND
        </text>

        {/* 트렌드 노드 (캡슐형) */}
        {nodes.map((node) => {
          const color = getPlatformColor(node.platform);
          const boxWidth = 160;
          const boxHeight = 45;
          const xPos = node.isRight ? node.x : node.x - boxWidth;
          const yPos = node.y - boxHeight / 2;

          return (
            <g 
              key={node.id} 
              className="cursor-pointer group"
              onClick={() => onSelectTrend(node)}
            >
              {/* 노드 배경 */}
              <rect
                x={xPos}
                y={yPos}
                width={boxWidth}
                height={boxHeight}
                rx="12"
                fill="#121212"
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-300 group-hover:fill-white/10 group-hover:stroke-white shadow-lg"
              />
              
              {/* 텍스트 내용 */}
              <text
                x={xPos + boxWidth / 2}
                y={yPos + boxHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                className="text-xs font-bold pointer-events-none select-none"
              >
                {node.title}
              </text>

              {/* 하단 플랫폼 표시선 */}
              <line 
                x1={xPos + 20} 
                y1={yPos + boxHeight + 8} 
                x2={xPos + boxWidth - 20} 
                y2={yPos + boxHeight + 8} 
                stroke={color} 
                strokeWidth="1.5"
                strokeDasharray="2 2"
                className="opacity-60"
              />
              
              {/* 플랫폼 명칭 */}
              <text
                x={xPos + boxWidth / 2}
                y={yPos + boxHeight + 22}
                textAnchor="middle"
                fill={color}
                className="text-[9px] font-black uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity"
              >
                {node.platform}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute top-6 left-8">
        <div className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em]">트렌드 아키텍처</div>
      </div>

      <div className="absolute bottom-6 right-8 text-right pointer-events-none">
        <div className="flex gap-4 justify-end flex-wrap max-w-[200px]">
          {Object.values(Platform).map(p => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ backgroundColor: getPlatformColor(p as Platform) }}></div>
              <span className="text-[9px] text-gray-400 uppercase tracking-tighter font-bold">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
