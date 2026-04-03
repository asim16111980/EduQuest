import type { Grade } from '@/types'

export const grades: Grade[] = [
  { id: 1, name_ar: 'الصف الأول', name_en: 'Grade 1', stage: 'primary', order: 1 },
  { id: 2, name_ar: 'الصف الثاني', name_en: 'Grade 2', stage: 'primary', order: 2 },
  { id: 3, name_ar: 'الصف الثالث', name_en: 'Grade 3', stage: 'primary', order: 3 },
  { id: 4, name_ar: 'الصف الرابع', name_en: 'Grade 4', stage: 'primary', order: 4 },
  { id: 5, name_ar: 'الصف الخامس', name_en: 'Grade 5', stage: 'primary', order: 5 },
  { id: 6, name_ar: 'الصف السادس', name_en: 'Grade 6', stage: 'primary', order: 6 },
  { id: 7, name_ar: 'الصف الأول الإعدادي', name_en: 'Grade 7', stage: 'preparatory', order: 7 },
  { id: 8, name_ar: 'الصف الثاني الإعدادي', name_en: 'Grade 8', stage: 'preparatory', order: 8 },
  { id: 9, name_ar: 'الصف الثالث الإعدادي', name_en: 'Grade 9', stage: 'preparatory', order: 9 },
  { id: 10, name_ar: 'الصف الأول الثانوي', name_en: 'Grade 10', stage: 'secondary', order: 10 },
  { id: 11, name_ar: 'الصف الثاني الثانوي', name_en: 'Grade 11', stage: 'secondary', order: 11 },
  { id: 12, name_ar: 'الصف الثالث الثانوي', name_en: 'Grade 12', stage: 'secondary', order: 12 },
]

export function getGradeById(id: number): Grade | undefined {
  return grades.find((g) => g.id === id)
}

export function getGradesByStage(stage: string): Grade[] {
  return grades.filter((g) => g.stage === stage)
}

export const stages = [
  { key: 'primary' as const, name_ar: 'الابتدائي', name_en: 'Primary', emoji: '🌟' },
  { key: 'preparatory' as const, name_ar: 'الإعدادي', name_en: 'Preparatory', emoji: '📚' },
  { key: 'secondary' as const, name_ar: 'الثانوي', name_en: 'Secondary', emoji: '🎓' },
]
