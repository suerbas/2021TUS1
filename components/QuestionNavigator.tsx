import React from 'react';
import { Question } from '../types';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  onNavigate: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({ questions, currentQuestionIndex, answers, onNavigate }) => {
  // Calculate stats for the sidebar
  const answeredCount = Object.keys(answers).length;
  const emptyCount = questions.length - answeredCount;

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200 w-full md:w-72 flex-shrink-0">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-700 mb-2">Soru Gezgini</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span className="text-slate-600">Cevaplandı</span>
          </div>
           <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
            <span className="text-slate-600">Boş</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500 font-mono">
          {answeredCount} / {questions.length} Tamamlandı
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            
            let bgClass = "bg-slate-100 text-slate-600 hover:bg-slate-200";
            if (isAnswered) bgClass = "bg-emerald-100 text-emerald-700 border border-emerald-200";
            if (isCurrent) bgClass = "ring-2 ring-blue-500 ring-offset-1 bg-blue-50 text-blue-700 font-bold";

            return (
              <button
                key={q.id}
                onClick={() => onNavigate(idx)}
                className={`
                  h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all
                  ${bgClass}
                `}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;