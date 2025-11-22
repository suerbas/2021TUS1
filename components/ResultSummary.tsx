import React from 'react';
import { Question, ExamStats } from '../types';
import { CheckCircle, XCircle, MinusCircle, Trophy } from 'lucide-react';

interface ResultSummaryProps {
  stats: ExamStats;
  questions: Question[];
  userAnswers: Record<number, string>;
  onRestart: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ stats, questions, userAnswers, onRestart }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Sınav Tamamlandı</h1>
        <p className="text-slate-500 mt-2">İşte sonuçlarınız ve performans analiziniz.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-sm text-slate-500 mb-1 font-medium">Doğru</div>
          <div className="text-2xl font-bold text-emerald-600">{stats.correct}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-sm text-slate-500 mb-1 font-medium">Yanlış</div>
          <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="text-sm text-slate-500 mb-1 font-medium">Boş</div>
          <div className="text-2xl font-bold text-slate-600">{stats.empty}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-sm text-blue-600 mb-1 font-bold uppercase tracking-wider">Net Puan</div>
            <div className="text-3xl font-black text-blue-800">{stats.netScore.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-slate-700">
          Detaylı Cevap Anahtarı
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3">Soru No</th>
                <th className="px-4 py-3">Cevabınız</th>
                <th className="px-4 py-3">Doğru Cevap</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => {
                const userAnswer = userAnswers[q.id];
                const isCorrect = userAnswer === q.correctAnswer;
                const isEmpty = !userAnswer;
                
                return (
                  <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">Soru {q.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{userAnswer || '-'}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 font-bold">{q.correctAnswer}</td>
                    <td className="px-4 py-3">
                      {isEmpty ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          <MinusCircle className="w-3 h-3" /> Boş
                        </span>
                      ) : isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> Doğru
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" /> Yanlış
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors"
        >
          Sınavı Tekrar Başlat
        </button>
      </div>
    </div>
  );
};

export default ResultSummary;