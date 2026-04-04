import { create } from 'zustand'

interface GameState {
  currentQuestion: number
  totalQuestions: number
  score: number
  correctAnswers: number
  timer: number
  isPlaying: boolean
  isGameOver: boolean
  options: string[]
  correctAnswer: string
  showResult: boolean
  selectedAnswer: string | null
  initGame: (total: number, questions: QuestionData[]) => void
  nextQuestion: () => void
  checkAnswer: (answer: string) => boolean
  endGame: () => void
  resetGame: () => void
  startTimer: (seconds: number) => void
  questions: QuestionData[]
}

export interface QuestionData {
  question: string
  questionAr?: string
  options: string[]
  correctAnswer: string
}

export const useGameStore = create<GameState>((set, get) => ({
  currentQuestion: 0,
  totalQuestions: 0,
  score: 0,
  correctAnswers: 0,
  timer: 0,
  isPlaying: false,
  isGameOver: false,
  options: [],
  correctAnswer: '',
  showResult: false,
  selectedAnswer: null,
  questions: [],

  initGame: (total, questions) =>
    set({
      totalQuestions: total,
      questions,
      currentQuestion: 0,
      score: 0,
      correctAnswers: 0,
      isPlaying: true,
      isGameOver: false,
      showResult: false,
      selectedAnswer: null,
      options: questions[0]?.options ?? [],
      correctAnswer: questions[0]?.correctAnswer ?? '',
      timer: 15,
    }),

  nextQuestion: () => {
    const { currentQuestion, questions } = get()
    const next = currentQuestion + 1
    if (next >= get().totalQuestions) {
      get().endGame()
      return
    }
    if (next < questions.length) {
      set({
        currentQuestion: next,
        options: questions[next].options,
        correctAnswer: questions[next].correctAnswer,
        selectedAnswer: null,
        showResult: false,
        timer: 15,
      })
    }
  },

  checkAnswer: (answer: string) => {
    const isCorrect = answer === get().correctAnswer
    if (isCorrect) {
      set((state) => ({
        score: state.score + 10,
        correctAnswers: state.correctAnswers + 1,
        showResult: true,
        selectedAnswer: answer,
      }))
    } else {
      set({ showResult: true, selectedAnswer: answer })
    }
    return isCorrect
  },

  endGame: () =>
    set({ isPlaying: false, isGameOver: true }),

  resetGame: () =>
    set({
      currentQuestion: 0,
      totalQuestions: 0,
      score: 0,
      correctAnswers: 0,
      isPlaying: false,
      isGameOver: false,
      options: [],
      correctAnswer: '',
      showResult: false,
      selectedAnswer: null,
      timer: 0,
      questions: [],
    }),

  startTimer: (seconds) => set({ timer: seconds }),
}))

interface ProgressState {
  progress: Record<string, { score: number; stars: number; completedAt: string }>
  updateProgress: (gameId: string, score: number, total: number) => void
  getProgress: (gameId: string) => { score: number; stars: number; completedAt: string } | null
  getPlayCount: () => number
  getBestScore: () => number
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: {},

  updateProgress: (gameId: string, score: number, total: number) => {
    const ratio = score / total
    const stars = ratio >= 0.8 ? 3 : ratio >= 0.5 ? 2 : ratio > 0 ? 1 : 0
    set((state) => ({
      progress: {
        ...state.progress,
        [gameId]: { score, stars, completedAt: new Date().toISOString() },
      },
    }))
  },

  getProgress: (gameId: string) => get().progress[gameId] ?? null,

  getPlayCount: () => Object.keys(get().progress).length,

  getBestScore: () => {
    const vals = Object.values(get().progress)
    return vals.reduce((max, p) => Math.max(max, p.score), 0)
  },
}))
