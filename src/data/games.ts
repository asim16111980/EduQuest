import type { Game } from '@/types'

export const games: Game[] = [
  // Grade 1
  { id: 'g1-math-count', title: 'Counting Adventure', title_ar: 'مغامرة العد', description: 'Count objects and learn numbers 1-100', description_ar: 'عد الأشياء وتعلم الأرقام من 1 إلى 100', subject: 'math', grade_id: 1, difficulty: 'easy', thumbnail_url: '' },
  { id: 'g1-arabic-letters', title: 'Arabic Letter Match', title_ar: 'تطابق الحروف العربية', description: 'Match Arabic letters with their shapes', description_ar: 'طابق الحروف العربية مع أشكالها', subject: 'arabic', grade_id: 1, difficulty: 'easy', thumbnail_url: '' },
  { id: 'g1-english-colors', title: 'Color Words', title_ar: 'كلمات الألوان', description: 'Learn English color names', description_ar: 'تعلم أسماء الألوان بالإنجليزية', subject: 'english', grade_id: 1, difficulty: 'easy', thumbnail_url: '' },

  // Grade 2
  { id: 'g2-math-add', title: 'Addition Challenge', title_ar: 'تحدي الجمع', description: 'Practice addition up to 20', description_ar: 'تدرب على الجمع حتى 20', subject: 'math', grade_id: 2, difficulty: 'easy', thumbnail_url: '' },
  { id: 'g2-arabic-words', title: 'Word Builder', title_ar: 'بناء الكلمات', description: 'Build simple Arabic words from letters', description_ar: 'كون كلمات عربية بسيطة من الحروف', subject: 'arabic', grade_id: 2, difficulty: 'easy', thumbnail_url: '' },
  { id: 'g2-science-animals', title: 'Animal Kingdom', title_ar: 'مملكة الحيوانات', description: 'Learn about different animals and their homes', description_ar: 'تعرف على الحيوانات ومساكنها', subject: 'science', grade_id: 2, difficulty: 'easy', thumbnail_url: '' },

  // Grade 3
  { id: 'g3-math-mult', title: 'Multiplication Quest', title_ar: 'رحلة الضرب', description: 'Master multiplication tables 1-10', description_ar: 'اتقن جداول الضرب من 1 إلى 10', subject: 'math', grade_id: 3, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g3-arabic-sentences', title: 'Sentence Maker', title_ar: 'صانع الجمل', description: 'Create correct Arabic sentences', description_ar: 'كون جمل عربية صحيحة', subject: 'arabic', grade_id: 3, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g3-science-plants', title: 'Plant Life', title_ar: 'حياة النباتات', description: 'Learn about plant parts and growth', description_ar: 'تعرف على أجزاء النبات ونموه', subject: 'science', grade_id: 3, difficulty: 'medium', thumbnail_url: '' },

  // Grade 4
  { id: 'g4-math-division', title: 'Division Explorer', title_ar: 'مستكشف القسمة', description: 'Master division with fun puzzles', description_ar: 'اتقن القسمة مع ألغاز ممتعة', subject: 'math', grade_id: 4, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g4-arabic-grammar', title: 'Grammar Hero', title_ar: 'بطل القواعد', description: 'Learn basic Arabic grammar rules', description_ar: 'تعلم قواعد اللغة العربية الأساسية', subject: 'arabic', grade_id: 4, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g4-english-verbs', title: 'Verb Tense Master', title_ar: 'سيد الأزمنة', description: 'Practice English present and past tense', description_ar: 'تدرب على الأزمنة الإنجليزية', subject: 'english', grade_id: 4, difficulty: 'medium', thumbnail_url: '' },

  // Grade 5
  { id: 'g5-math-fractions', title: 'Fraction Factory', title_ar: 'مصنع الكسور', description: 'Master fractions through visual puzzles', description_ar: 'اتقن الكسور من خلال ألغاز بصرية', subject: 'math', grade_id: 5, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g5-science-energy', title: 'Energy Explorer', title_ar: 'مستكشف الطاقة', description: 'Learn about forms of energy', description_ar: 'تعرف على أشكال الطاقة', subject: 'science', grade_id: 5, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g5-english-vocab', title: 'Vocabulary Tower', title_ar: 'برج المفردات', description: 'Build your English vocabulary', description_ar: 'ابنِ مفرداتك الإنجليزية', subject: 'english', grade_id: 5, difficulty: 'medium', thumbnail_url: '' },

  // Grade 6
  { id: 'g6-math-decimals', title: 'Decimal Dash', title_ar: 'سباق الكسور العشرية', description: 'Practice decimal operations', description_ar: 'تدرب على عمليات الكسور العشرية', subject: 'math', grade_id: 6, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g6-arabic-writing', title: 'Creative Writer', title_ar: 'كاتب مبدع', description: 'Practice Arabic paragraph writing', description_ar: 'تدرب على كتابة الفقرات العربية', subject: 'arabic', grade_id: 6, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g6-science-body', title: 'Body Systems', title_ar: 'أجهزة الجسم', description: 'Explore human body systems', description_ar: 'استكشف أجهزة جسم الإنسان', subject: 'science', grade_id: 6, difficulty: 'hard', thumbnail_url: '' },

  // Grade 7
  { id: 'g7-math-algebra', title: 'Algebra Starter', title_ar: 'بداية الجبر', description: 'Introduction to algebraic expressions', description_ar: 'مقدمة في التعبيرات الجبرية', subject: 'math', grade_id: 7, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g7-science-matter', title: 'Matter Lab', title_ar: 'مختبر المادة', description: 'Explore states and properties of matter', description_ar: 'استكشف حالات المادة وخصائصها', subject: 'science', grade_id: 7, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g7-english-grammar', title: 'Grammar Quest', title_ar: 'مهمة القواعد', description: 'Master English grammar fundamentals', description_ar: 'أتقن أساسيات القواعد الإنجليزية', subject: 'english', grade_id: 7, difficulty: 'medium', thumbnail_url: '' },
  { id: 'g7-arabic-eloquence', title: 'Eloquence Challenge', title_ar: 'تحدي الفصاحة', description: 'Improve Arabic expression skills', description_ar: 'حسّن مهارات التعبير العربي', subject: 'arabic', grade_id: 7, difficulty: 'hard', thumbnail_url: '' },

  // Grade 8
  { id: 'g8-math-equations', title: 'Equation Solver', title_ar: 'حل المعادلات', description: 'Solve linear equations and inequalities', description_ar: 'حل المعادلات والمتباينات الخطية', subject: 'math', grade_id: 8, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g8-science-cells', title: 'Cell Explorer', title_ar: 'مستكشف الخلايا', description: 'Discover the world of cells', description_ar: 'اكتشف عالم الخلايا', subject: 'science', grade_id: 8, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g8-geography-maps', title: 'Map Master', title_ar: 'سيد الخرائط', description: 'Learn geography through map puzzles', description_ar: 'تعلم الجغرافيا من خلال خرائط', subject: 'geography', grade_id: 8, difficulty: 'medium', thumbnail_url: '' },

  // Grade 9
  { id: 'g9-math-geometry', title: 'Geometry Wizard', title_ar: 'ساحر الهندسة', description: 'Master geometric shapes and theorems', description_ar: 'أتقن الأشكال والنظريات الهندسية', subject: 'math', grade_id: 9, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g9-science-physics', title: 'Physics Playground', title_ar: 'ملعب الفيزياء', description: 'Explore forces and motion', description_ar: 'استكشف القوى والحركة', subject: 'science', grade_id: 9, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g9-history-egypt', title: 'Egypt Through Time', title_ar: 'مصر عبر الزمن', description: 'Journey through Egyptian history', description_ar: 'رحلة عبر تاريخ مصر', subject: 'history', grade_id: 9, difficulty: 'medium', thumbnail_url: '' },

  // Grade 10
  { id: 'g10-math-functions', title: 'Function Machine', title_ar: 'آلة الدوال', description: 'Understand functions and graphs', description_ar: 'افهم الدوال والرسوم البيانية', subject: 'math', grade_id: 10, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g10-science-chem', title: 'Chemistry Lab', title_ar: 'مختبر الكيمياء', description: 'Explore chemical reactions and the periodic table', description_ar: 'استكشف التفاعلات الكيميائية والجدول الدوري', subject: 'science', grade_id: 10, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g10-english-essay', title: 'Essay Builder', description_ar: 'بنّاء المقالات', description: 'Structure and write English essays', description: 'هيكلة وكتابة المقالات الإنجليزية', subject: 'english', grade_id: 10, difficulty: 'hard', thumbnail_url: '' },

  // Grade 11
  { id: 'g11-math-calc', title: 'Calculus Quest', title_ar: 'رحلة التفاضل', description: 'Introduction to derivatives', description_ar: 'مقدمة في الاشتقاق', subject: 'math', grade_id: 11, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g11-science-bio', title: 'Biology Deep Dive', title_ar: 'الغوص في البيولوجيا', description: 'Advanced biology concepts', description_ar: 'مفاهيم البيولوجيا المتقدمة', subject: 'science', grade_id: 11, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g11-history-modern', title: 'Modern History', title_ar: 'التاريخ الحديث', description: 'Explore modern world history', description_ar: 'استكشف تاريخ العالم الحديث', subject: 'history', grade_id: 11, difficulty: 'hard', thumbnail_url: '' },

  // Grade 12
  { id: 'g12-math-integral', title: 'Integration Master', title_ar: 'سيد التكامل', description: 'Master integration techniques', description_ar: 'أتقن تقنيات التكامل', subject: 'math', grade_id: 12, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g12-science-physics2', title: 'Advanced Physics', title_ar: 'الفيزياء المتقدمة', description: 'Electricity, magnetism and waves', description_ar: 'الكهربية والمغناطيسية والموجات', subject: 'science', grade_id: 12, difficulty: 'hard', thumbnail_url: '' },
  { id: 'g12-arabic-lit', title: 'Arabic Literature', title_ar: 'الأدب العربي', description: 'Explore classical Arabic literature', description_ar: 'استكشف الأدب العربي الكلاسيكي', subject: 'arabic', grade_id: 12, difficulty: 'hard', thumbnail_url: '' },
]

export function getGamesByGrade(gradeId: number): Game[] {
  return games.filter((g) => g.grade_id === gradeId)
}

export function getGameById(id: string): Game | undefined {
  return games.find((g) => g.id === id)
}
