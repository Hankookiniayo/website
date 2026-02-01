
import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  const shareIcons = [
    { label: 'TALK', color: 'bg-[#FEE500]', textColor: 'text-[#3C1E1E]', icon: 'TALK' },
    { label: 'Facebook', color: 'bg-[#1877F2]', textColor: 'text-white', icon: 'f' },
    { label: 'Twitter', color: 'bg-[#1DA1F2]', textColor: 'text-white', icon: '𝕏' },
    { label: 'Link', color: 'bg-[#E2E8F0]', textColor: 'text-[#475569]', icon: '🔗', action: handleCopyLink },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-8 text-center animate-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-3xl font-bold text-gray-900 mb-2">공유하기</h3>
        <p className="text-gray-500 mb-8">이 페이지를 주변 사람들에게 공유해보세요.</p>

        <div className="flex justify-center gap-4">
          {shareIcons.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action || (() => alert(`${item.label} 공유 기능이 곧 추가됩니다.`))}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-90 ${item.color} ${item.textColor} font-black text-xs`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
