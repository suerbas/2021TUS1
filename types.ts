export interface Question {
  id: number;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAnswer: string; // "A", "B", "C", "D", "E"
}

export interface ExamState {
  status: 'intro' | 'active' | 'finished';
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> selectedOption
  markedForReview: number[]; // List of question IDs
  timeLeft: number; // in seconds
}

export interface ExamStats {
  correct: number;
  incorrect: number;
  empty: number;
  netScore: number;
}