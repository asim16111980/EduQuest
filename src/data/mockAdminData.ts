/**
 * Mock data for admin dashboard — Egyptian student names, games progress, etc.
 * All data is in-memory and reset on page reload.
 */

export interface MockUser {
  id: string
  name_ar: string
  email: string
  grade_id: number
  created_at: string
  status: 'active' | 'suspended'
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u1', name_ar: 'أحمد محمد علي', email: 'ahmed.ali@school.eg', grade_id: 1, created_at: '2025-09-15', status: 'active' },
  { id: 'u2', name_ar: 'فاطمة حسن إبراهيم', email: 'fatima.hassan@school.eg', grade_id: 3, created_at: '2025-09-20', status: 'active' },
  { id: 'u3', name_ar: 'محمد أحمد حسن', email: 'mohamed.ahmed@school.eg', grade_id: 5, created_at: '2025-10-01', status: 'active' },
  { id: 'u4', name_ar: 'نور الدين سعيد', email: 'noureddin.said@school.eg', grade_id: 7, created_at: '2025-10-05', status: 'active' },
  { id: 'u5', name_ar: 'سارة محمود أحمد', email: 'sara.mahmoud@school.eg', grade_id: 2, created_at: '2025-10-10', status: 'active' },
  { id: 'u6', name_ar: 'عمر خالد يوسف', email: 'omar.khaled@school.eg', grade_id: 6, created_at: '2025-10-15', status: 'suspended' },
  { id: 'u7', name_ar: 'مريم عبد الرحمن', email: 'maryam.abdelrahman@school.eg', grade_id: 4, created_at: '2025-10-20', status: 'active' },
  { id: 'u8', name_ar: 'يوسف أحمد سعيد', email: 'youssif.ahmed@school.eg', grade_id: 8, created_at: '2025-11-01', status: 'active' },
  { id: 'u9', name_ar: 'هند حسين عبداللطيف', email: 'hind.hussein@school.eg', grade_id: 9, created_at: '2025-11-05', status: 'active' },
  { id: 'u10', name_ar: 'كريم سامي عبدالله', email: 'karim.sami@school.eg', grade_id: 10, created_at: '2025-11-10', status: 'active' },
  { id: 'u11', name_ar: 'ليلى أحمد محمد', email: 'laila.ahmed@school.eg', grade_id: 11, created_at: '2025-11-15', status: 'active' },
  { id: 'u12', name_ar: 'إسماعيل رضا', email: 'ismaeil.rida@school.eg', grade_id: 12, created_at: '2025-11-20', status: 'active' },
  { id: 'u13', name_ar: 'رنا سمير محمد', email: 'rana.samir@school.eg', grade_id: 1, created_at: '2025-12-01', status: 'active' },
  { id: 'u14', name_ar: 'حسن طارق علي', email: 'hasan.tariq@school.eg', grade_id: 3, created_at: '2025-12-05', status: 'suspended' },
  { id: 'u15', name_ar: 'دعاء محمد فاروق', email: 'dua.farouk@school.eg', grade_id: 5, created_at: '2025-12-10', status: 'active' },
  { id: 'u16', name_ar: 'طارق هشام أحمد', email: 'tariq.hisham@school.eg', grade_id: 7, created_at: '2025-12-15', status: 'active' },
  { id: 'u17', name_ar: 'جنى عمر صالح', email: 'jana.omar@school.eg', grade_id: 2, created_at: '2026-01-05', status: 'active' },
  { id: 'u18', name_ar: 'زياد محمد حسن', email: 'ziad.mohamed@school.eg', grade_id: 6, created_at: '2026-01-10', status: 'active' },
  { id: 'u19', name_ar: 'سلمى أحمد خالد', email: 'salma.ahmed@school.eg', grade_id: 4, created_at: '2026-01-15', status: 'active' },
  { id: 'u20', name_ar: 'آدم ياسر محمد', email: 'adam.yasser@school.eg', grade_id: 8, created_at: '2026-01-20', status: 'active' },
]

// Generate mock questions per game subject
export function generateMockQuestions(subject: string): {
  id: string
  question_ar: string
  options: string[]
  correct: number
  difficulty: 'easy' | 'medium' | 'hard'
}[] {
  const base: Record<string, any[]> = {
    math: [
      { question_ar: 'ما ناتج ٧ × ٨ ؟', options: ['٥٤', '٥٦', '٥٨', '٦٤'], correct: 1 },
      { question_ar: 'كم يساوي ١/٢ + ١/٤ ؟', options: ['٣/٤', '٢/٦', '١/٦', '٢/٤'], correct: 0 },
      { question_ar: 'ما هي قيمة ٣² + ٤² ؟', options: ['٢٤', '٢٥', '٧', '١٢'], correct: 1 },
      { question_ar: 'حل المعادلة: ٢س + ٦ = ٢٠', options: ['٥', '٦', '٧', '٨'], correct: 2 },
      { question_ar: 'ما محيط المربع الذي ضلعه ٩ سم ؟', options: ['١٨ سم', '٢٧ سم', '٣٦ سم', '٨١ سم'], correct: 2 },
    ],
    arabic: [
      { question_ar: 'ما إعراب كلمة "الكتابَ" في جملة: قرأتُ الكتابَ ؟', options: ['مفعول به', 'فاعل', 'مبتدأ', 'خبر'], correct: 0 },
      { question_ar: 'ما نوع الفعل "اقرَأ" ؟', options: ['ماضٍ', 'مضارع', 'أمر', 'اسم'], correct: 2 },
      { question_ar: 'ما جمع كلمة "كتاب" ؟', options: ['كَتَب', 'كُتُب', 'مكتوبات', 'أجمعها'], correct: 1 },
      { question_ar: 'ما نوع همزة "أحمد" ؟', options: ['همزة قطع', 'همزة وصل', 'همزة متطرفة', 'همزة متوسطة'], correct: 0 },
      { question_ar: 'ما المفرد من "علماء" ؟', options: ['عالِم', 'عِلم', 'معلم', 'تعليم'], correct: 0 },
    ],
    science: [
      { question_ar: 'ما هو العضو المسؤول عن تنقية الدم ؟', options: ['القلب', 'الكبد', 'الكلى', 'الرئة'], correct: 2 },
      { question_ar: 'كم عدد كواكب المجموعة الشمسية ؟', options: ['٧', '٨', '٩', '١٠'], correct: 1 },
      { question_ar: 'ما هي وحدة قياس القوة ؟', options: ['جول', 'نيوتن', 'واط', 'متر'], correct: 1 },
      { question_ar: 'ما العنصر الكيميائي الذي رمزه O ؟', options: ['ذهب', 'حديد', 'أكسجين', 'هيدروجين'], correct: 2 },
      { question_ar: 'كم عدد خلايا النحل في الخلية الواحدة تقريباً ؟', options: ['١٠٠٠', '١٠٠٠٠', '٥٠٠٠٠', '١٠٠٠٠٠'], correct: 2 },
    ],
    english: [
      { question_ar: 'Which is the past tense of "go" ?', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
      { question_ar: 'Choose the correct sentence:', options: ['He don\'t like it', 'He doesn\'t like it', 'He not like it', 'He no like it'], correct: 1 },
      { question_ar: 'What is the opposite of "heavy" ?', options: ['big', 'light', 'small', 'tall'], correct: 1 },
      { question_ar: '"She is reading a book" — what tense is this?', options: ['Simple present', 'Present continuous', 'Past simple', 'Future'], correct: 1 },
      { question_ar: 'Choose the correct article: ___ apple', options: ['a', 'an', 'the', '—'], correct: 1 },
    ],
    geography: [
      { question_ar: 'ما هو أطول نهر في العالم ؟', options: ['النيل', 'الأمازون', 'المسيسيبي', 'اليانغتسي'], correct: 0 },
      { question_ar: 'في أي قارة تقع مصر ؟', options: ['آسيا', 'أفريقيا', 'أوروبا', 'أمريكا الشمالية'], correct: 1 },
      { question_ar: 'ما عاصمة المملكة العربية السعودية ؟', options: ['جدة', 'الرياض', 'مكة', 'المدينة'], correct: 1 },
      { question_ar: 'كم عدد محافظات جمهورية مصر العربية ؟', options: ['٢٥', '٢٧', '٣٠', '٣٢'], correct: 1 },
      { question_ar: 'ما أكبر صحراء في العالم ؟', options: ['صحراء الربع الخالي', 'الصحراء الكبرى', 'صحراء غوبي', 'صحراء النميب'], correct: 1 },
    ],
    history: [
      { question_ar: 'في أي عام تم بناء هرم خوفو ؟', options: ['٢٥٠٠ ق.م', '٢٠٠٠ ق.م', '١٥٠٠ ق.م', '١٠٠ ق.م'], correct: 0 },
      { question_ar: 'من هو أول رئيس لجمهورية مصر العربية ؟', options: ['جمال عبدالناصر', 'محمد نجيب', 'أنور السادات', 'حسني مبارك'], correct: 1 },
      { question_ar: 'متى تم افتتاح قناة السويس ؟', options: ['١٨٠٠', '١٨٤٨', '١٨٦٩', '١٩٠٠'], correct: 2 },
      { question_ar: 'من اكتشف مقبرة توت عنخ آمون ؟', options: ['هوارد كارتر', 'شامبليون', 'باتلر', 'ماريت'], correct: 0 },
      { question_ar: 'ما اسم الثورة التي حدثت في ٢٣ يوليو ١٩٥ ؟', options: ['ثورة ٢٥ يناير', 'ثورة ٢٣ يوليو', 'ثورة ٣٠ يونيو', 'ثورة ١٩١٩'], correct: 1 },
    ],
  }
  return (base[subject] ?? base.math).map((q, i) => ({
    id: `q-${Date.now()}-${i}`,
    ...q,
    difficulty: i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard' as const,
  }))
}

// Mock game play counts
export function getMockPlayCount(gameId: string): number {
  const seed = gameId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return (seed * 7) % 500 + 10
}

// Mock active users per date range
export const mockWeeklyActiveUsers = [124, 198, 176, 210, 245, 189, 156]

// Mock subject popularity
export const mockSubjectPopularity = [
  { subject: 'math', percent: 28 },
  { subject: 'arabic', percent: 22 },
  { subject: 'science', percent: 18 },
  { subject: 'english', percent: 15 },
  { subject: 'geography', percent: 10 },
  { subject: 'history', percent: 7 },
]

// Mock top students
export const mockTopStudents = [
  { rank: 1, name: 'أحمد محمد علي', grade_ar: 'الصف الأول الإعدادي', avgScore: 98, stars: 47 },
  { rank: 2, name: 'فاطمة حسن إبراهيم', grade_ar: 'الصف الثالث الابتدائي', avgScore: 95, stars: 42 },
  { rank: 3, name: 'كريم سامي عبدالله', grade_ar: 'الصف الأول الثانوي', avgScore: 92, stars: 39 },
  { rank: 4, name: 'نور الدين سعيد', grade_ar: 'الصف الأول الإعدادي', avgScore: 89, stars: 36 },
  { rank: 5, name: 'مريم عبد الرحمن', grade_ar: 'الصف الرابع الابتدائي', avgScore: 87, stars: 34 },
  { rank: 6, name: 'يوسف أحمد سعيد', grade_ar: 'الصف الثاني الإعدادي', avgScore: 85, stars: 31 },
  { rank: 7, name: 'هند حسين عبداللطيف', grade_ar: 'الصف الثالث الإعدادي', avgScore: 83, stars: 29 },
  { rank: 8, name: 'سارة محمود أحمد', grade_ar: 'الصف الثاني الابتدائي', avgScore: 81, stars: 27 },
  { rank: 9, name: 'سلمى أحمد خالد', grade_ar: 'الصف الرابع الابتدائي', avgScore: 79, stars: 25 },
  { rank: 10, name: 'دعاء محمد فاروق', grade_ar: 'الصف الخامس الابتدائي', avgScore: 76, stars: 23 },
]
