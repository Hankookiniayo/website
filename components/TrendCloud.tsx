
import React from 'react';
import { TrendItem } from '../types';

interface TrendCloudProps {
  trends: TrendItem[];
  onSelectTrend: (trend: TrendItem) => void;
}

export const TrendCloud: React.FC<TrendCloudProps> = ({ trends, onSelectTrend }) => {
  // 워드클라우드 배치를 위한 랜덤 위치 생성 (중앙 집중형)
  const cloudItems = React.useMemo(() => {
    return trends.map((trend, index) => {
      // 볼륨에 따른 폰트 크기 결정 (14px ~ 48px)
      const fontSize = 14 + (trend.volume / 100) * 34;
      // 투명도 조절
      const opacity = 0.4 + (trend.volume / 100) * 0.6;
      
      // 나선형 배치를 위한 계산
      const angle = index * 0.8;
      const radius = index * 15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        ...trend,
        fontSize,
        opacity,
        x,
        y
      };
    });
  }, [trends]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      <div className="relative">
        {cloudItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTrend(item)}
            className="absolute whitespace-nowrap transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer text-center font-bold"
            style={{
              fontSize: `${item.fontSize}px`,
              opacity: item.opacity,
              left: `calc(50% + ${item.x}px)`,
              top: `calc(50% + ${item.y}px)`,
              transform: 'translate(-50%, -50%)',
              color: item.volume > 80 ? '#ffffff' : item.volume > 50 ? '#94a3b8' : '#64748b'
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
};
