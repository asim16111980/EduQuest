export interface User {
  id: string
  name: string
  email: string
  grade_id: number
  created_at: string
  role?: 'student' | 'admin'
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
  title_ar?: string
  description: string
  description_ar?: string
  subject: string
  grade_id: number
  difficulty: 'easy' | 'medium' | 'hard'
  thumbnail_url: string
  screenshotUrl?: string
  subjectIcon: string
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

const SUBJECT_ARABIC: Record<string, string> = {
  math: 'رياضيات',
  arabic: 'عربي',
  science: 'علوم',
  english: 'إنجليزي',
  geography: 'جغرافيا',
  history: 'تاريخ',
}

export const SUBJ_GRADIENTS: Record<string, string> = {
  math: 'linear-gradient(135deg, #1D9E75, #085041)',
  arabic: 'linear-gradient(135deg, #D85A30, #4A1B0C)',
  science: 'linear-gradient(135deg, #378ADD, #042C53)',
  english: 'linear-gradient(135deg, #7F77DD, #26215C)',
  geography: 'linear-gradient(135deg, #639922, #173404)',
  history: 'linear-gradient(135deg, #BA7517, #412402)',
}

export const DIFF_COLORS: Record<string, { bg: string; text: string }> = {
  easy: { bg: '#D1FAE5', text: '#065F46' },
  medium: { bg: '#FEF3C7', text: '#92400E' },
  hard: { bg: '#FEE2E2', text: '#991B1B' },
}

export function getDiffLabel(difficulty: 'easy' | 'medium' | 'hard'): string {
  return difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'
}

export function getSubjectArabic(subject: string): string {
  return SUBJECT_ARABIC[subject] || subject
}

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}
