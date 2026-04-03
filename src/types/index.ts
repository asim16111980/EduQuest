export interface User {
  id: string
  name: string
  email: string
  grade_id: number
  created_at: string
}

export interface Grade {
  id: number
  name_ar: string
  name_en: string
  stage: 'primary' | 'preparatory' | 'secondary'
  order: number
}

export interface Game {
  id: string
  title: string
  description: string
  subject: string
  grade_id: number
  difficulty: 'easy' | 'medium' | 'hard'
  thumbnail_url: string
}

export interface UserProgress {
  id: string
  user_id: string
  game_id: string
  score: number
  stars: number
  completed_at: string | null
}

export type Stage = 'primary' | 'preparatory' | 'secondary'

export const STAGE_COLORS: Record<Stage, { primary: string; accent: string; bg: string; light: string }> = {
  primary: { primary: '#3B82F6', accent: '#FBBF24', bg: '#EFF6FF', light: '#DBF4FF' },
  preparatory: { primary: '#10B981', accent: '#14B8A6', bg: '#ECFDF5', light: '#CCFBF1' },
  secondary: { primary: '#8B5CF6', accent: '#6366F1', bg: '#F5F3FF', light: '#EDE9FE' },
}

export const SUBJ_EMOJI: Record<string, string> = {
  math: '🔢',
  arabic: '📝',
  science: '🔬',
  english: '🔤',
  geography: '🌍',
  history: '🏛️',
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
