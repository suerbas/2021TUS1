import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle, Lightbulb, X, BookOpen } from 'lucide-react';

interface QuestionViewerProps {
  question: Question;
  selectedOption?: string;
  onSelectOption: (option: string) => void;
}

const QuestionViewer: React.FC<QuestionViewerProps> = ({ question, selectedOption, onSelectOption }) => {
  const options = ['A', 'B', 'C', 'D', 'E'] as const;
  const [showSolution, setShowSolution] = useState(false);

  // Close solution modal when question changes
  React.useEffect(() => {
    setShowSolution(false);
  }, [question.id]);

  return (
    <div className="max-w-3xl mx-auto w-full p-1 md:p-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
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
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
           {selectedOption ? (
             <button 
               onClick={(e) => { e.stopPropagation(); onSelectOption(""); }}
               className="text-sm text-slate-400 hover:text-red-500 transition-colors"
             >
               Seçimi Temizle
             </button>
           ) : <div></div>}

           <button
             onClick={() => setShowSolution(true)}
             className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
           >
             <Lightbulb className="w-4 h-4" />
             Çözümü Gör
           </button>
        </div>
      </div>

      {/* Solution Modal */}
      {showSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white font-bold">
                <BookOpen className="w-5 h-5" />
                <span>Çözüm & Açıklama</span>
              </div>
              <button 
                onClick={() => setShowSolution(false)}
                className="text-indigo-100 hover:text-white hover:bg-indigo-500 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doğru Cevap</span>
                <div className="flex items-center gap-3 mt-1 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                    {question.correctAnswer}
                  </div>
                  <span className="text-emerald-900 font-medium">
                    {question.options[question.correctAnswer as keyof typeof question.options]}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açıklama</span>
                <p className="mt-2 text-slate-700 leading-relaxed text-sm md:text-base">
                  {question.explanation}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowSolution(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionViewer;