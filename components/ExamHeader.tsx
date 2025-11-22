import React from 'react';
import { Clock, LogOut, CheckCircle2 } from 'lucide-react';

interface ExamHeaderProps {
  timeLeft: number;
  totalQuestions: number;
  currentQuestionNumber: number;
  onFinish: () => void;
  onQuit: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ timeLeft, totalQuestions, currentQuestionNumber, onFinish, onQuit }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 600; // Less than 10 mins

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-3 md:px-6 sticky top-0 z-20 shadow-sm">
      
      {/* Left Section: Title and Question Count */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="font-bold text-lg text-slate-800 hidden md:block">TUS Deneme</div>
        <div className="text-xs md:text-sm text-slate-500 px-2 py-1 bg-slate-100 rounded-full whitespace-nowrap border border-slate-200">
          <span className="hidden sm:inline">Soru </span>{currentQuestionNumber} / {totalQuestions}
        </div>
      </div>

      {/* Center Section: Timer (Absolutely centered) */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 font-mono text-lg md:text-xl font-medium ${isLowTime ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
        <Clock className="w-4 h-4 md:w-5 md:h-5" />
        <span>{formatTime(timeLeft)}</span>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.confirm("Sınavdan çıkmak istediğinize emin misiniz? İlerlemeniz kaydedilmeyecek ve ana sayfaya döneceksiniz.")) {
              onQuit();
            }
          }}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 md:px-3 md:py-2 rounded-md transition-colors flex items-center gap-2"
          title="Sınavdan Çık"
        >
          <LogOut className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:inline text-sm font-medium">Çık</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Sınavı bitirmek ve sonucunuzu hesaplamak istediğinize emin misiniz?")) {
              onFinish();
            }
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors text-xs md:text-sm flex items-center gap-2 shadow-sm shadow-emerald-200"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Bitir</span>
        </button>
      </div>
    </header>
  );
};

export default ExamHeader;