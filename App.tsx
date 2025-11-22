import React, { useState, useEffect, useCallback } from 'react';
import { ExamState, ExamStats } from './types';
import { questions } from './data/questions';
import ExamHeader from './components/ExamHeader';
import QuestionViewer from './components/QuestionViewer';
import QuestionNavigator from './components/QuestionNavigator';
import ResultSummary from './components/ResultSummary';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const EXAM_DURATION = 150 * 60; // 150 minutes in seconds

const App: React.FC = () => {
  const [examState, setExamState] = useState<ExamState>({
    status: 'intro',
    currentQuestionIndex: 0,
    answers: {},
    markedForReview: [],
    timeLeft: EXAM_DURATION
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Timer Effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (examState.status === 'active' && examState.timeLeft > 0) {
      timer = setInterval(() => {
        setExamState(prev => {
          if (prev.timeLeft <= 1) {
            return { ...prev, timeLeft: 0, status: 'finished' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else if (examState.timeLeft === 0 && examState.status === 'active') {
      setExamState(prev => ({ ...prev, status: 'finished' }));
    }

    return () => clearInterval(timer);
  }, [examState.status, examState.timeLeft]);

  const startExam = () => {
    setExamState({
      status: 'active',
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: [],
      timeLeft: EXAM_DURATION
    });
  };

  const finishExam = useCallback(() => {
    setExamState(prev => ({ ...prev, status: 'finished' }));
  }, []);

  const quitExam = useCallback(() => {
    setExamState({
      status: 'intro',
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: [],
      timeLeft: EXAM_DURATION
    });
  }, []);

  const handleAnswer = (option: string) => {
    setExamState(prev => {
      const newAnswers = { ...prev.answers };
      if (option === "") {
        delete newAnswers[questions[prev.currentQuestionIndex].id];
      } else {
        newAnswers[questions[prev.currentQuestionIndex].id] = option;
      }
      return { ...prev, answers: newAnswers };
    });
  };

  const navigateTo = (index: number) => {
    setExamState(prev => ({ ...prev, currentQuestionIndex: index }));
    setIsSidebarOpen(false); // Close mobile sidebar on nav
  };

  const calculateStats = (): ExamStats => {
    let correct = 0;
    let incorrect = 0;
    let empty = 0;

    questions.forEach(q => {
      const answer = examState.answers[q.id];
      if (!answer) {
        empty++;
      } else if (answer === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    // 4 Incorrect removes 1 Correct (Standard TUS rule approximation)
    const netScore = correct - (incorrect / 4);

    return { correct, incorrect, empty, netScore };
  };

  if (examState.status === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">TUS Klinik Bilimler Simülasyonu</h1>
          <p className="text-slate-600 mb-6">
            Gerçek sınav deneyimi için hazırlanmış deneme sınavı. 
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-8 text-left text-sm space-y-2 text-slate-600">
            <p>• <strong>Soru Sayısı:</strong> {questions.length}</p>
            <p>• <strong>Süre:</strong> 150 Dakika</p>
            <p>• <strong>Puanlama:</strong> 4 Yanlış 1 Doğruyu Götürür</p>
          </div>

          <button 
            onClick={startExam}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
          >
            Sınavı Başlat
          </button>
        </div>
      </div>
    );
  }

  if (examState.status === 'finished') {
    return <ResultSummary 
      stats={calculateStats()} 
      questions={questions} 
      userAnswers={examState.answers}
      onRestart={() => setExamState(prev => ({ ...prev, status: 'intro' }))} 
    />;
  }

  const currentQuestion = questions[examState.currentQuestionIndex];
  const currentAnswer = examState.answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <ExamHeader 
        timeLeft={examState.timeLeft}
        totalQuestions={questions.length}
        currentQuestionNumber={examState.currentQuestionIndex + 1}
        onFinish={finishExam}
        onQuit={quitExam}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full border-r border-slate-200 shadow-sm z-10">
          <QuestionNavigator 
            questions={questions}
            currentQuestionIndex={examState.currentQuestionIndex}
            answers={examState.answers}
            onNavigate={navigateTo}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        {isSidebarOpen && (
           <div className="absolute inset-0 z-30 md:hidden flex">
             <div className="w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300">
               <div className="p-4 border-b flex justify-between items-center">
                 <h3 className="font-bold">Soru Listesi</h3>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               <div className="h-full overflow-y-auto pb-20">
                <QuestionNavigator 
                  questions={questions}
                  currentQuestionIndex={examState.currentQuestionIndex}
                  answers={examState.answers}
                  onNavigate={navigateTo}
                />
               </div>
             </div>
             <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
           </div>
        )}

        <main className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
             <QuestionViewer 
               question={currentQuestion} 
               selectedOption={currentAnswer}
               onSelectOption={handleAnswer}
             />
          </div>
        </main>
      </div>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 flex items-center justify-between md:justify-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex gap-4 w-full md:w-auto justify-end md:justify-center">
          <button
            disabled={examState.currentQuestionIndex === 0}
            onClick={() => setExamState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Önceki</span>
          </button>
          
          <button
            onClick={() => {
               if (examState.currentQuestionIndex < questions.length - 1) {
                 setExamState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
               } else {
                 // Suggest finishing if it's the last question
                 if (window.confirm("Son soruya ulaştınız. Sınavı bitirmek ister misiniz?")) {
                   finishExam();
                 }
               }
            }}
            className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors shadow-md ${
              examState.currentQuestionIndex === questions.length - 1 
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
            }`}
          >
            <span className="hidden sm:inline">
              {examState.currentQuestionIndex === questions.length - 1 ? "Sınavı Bitir" : "Sonraki"}
            </span>
            <span className="sm:hidden">
              {examState.currentQuestionIndex === questions.length - 1 ? "Bitir" : "İleri"}
            </span>
            {examState.currentQuestionIndex !== questions.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;