import React from 'react';
import { Question } from '../types';
import { CheckCircle, Circle } from 'lucide-react';

interface QuestionViewerProps {
  question: Question;
  selectedOption?: string;
  onSelectOption: (option: string) => void;
}

const QuestionViewer: React.FC<QuestionViewerProps> = ({ question, selectedOption, onSelectOption }) => {
  const options = ['A', 'B', 'C', 'D', 'E'] as const;

  return (
    <div className="max-w-3xl mx-auto w-full p-1 md:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex gap-3 mb-4">
             <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
               {question.id}
             </span>
             <h2 className="text-lg md:text-xl text-slate-800 leading-relaxed font-medium">
               {question.text}
             </h2>
          </div>
        </div>
        
        <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt;
            const text = question.options[opt];
            
            return (
              <button
                key={opt}
                onClick={() => onSelectOption(opt)}
                className={`
                  group w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-start gap-3
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' 
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }
                `}
              >
                <div className={`
                  flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mt-0.5 transition-colors
                  ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 text-slate-400 group-hover:border-blue-400'}
                `}>
                  {isSelected ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold">{opt}</span>}
                </div>
                <span className={`text-base ${isSelected ? 'text-blue-900 font-medium' : 'text-slate-700'}`}>
                  {text}
                </span>
              </button>
            );
          })}
        </div>
        
        {selectedOption && (
          <div className="px-8 pb-6 bg-slate-50/50 flex justify-end">
             <button 
               onClick={(e) => { e.stopPropagation(); onSelectOption(""); }}
               className="text-sm text-slate-400 hover:text-red-500 transition-colors"
             >
               Seçimi Temizle
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionViewer;