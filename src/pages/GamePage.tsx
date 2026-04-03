import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Timer, Star, Trophy, RotateCcw, Check, X, Zap } from 'lucide-react'
import { getGameById } from '@/data/games'
import { getGradeById } from '@/data/grades'
import { useGameStore, type QuestionData } from '@/store/gameStore'
import { useProgressStore } from '@/store/gameStore'
import { Button } from '@/components/ui/Button'
import { STAGE_COLORS, type Stage } from '@/types'

// ---------- Question generators by subject ----------
function generateQuestions(subject: string, gradeId: number): QuestionData[] {
  const qs: QuestionData[] = []

  if (subject === 'math') {
    const ops = gradeId <= 6
      ? (['+', '-'] as const)
      : gradeId <= 9
        ? (['+', '-', 'x'] as const)
        : (['+', '-', 'x', '÷'] as const)
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * (gradeId <= 3 ? 20 : gradeId <= 6 ? 50 : 100)) + 1
      const b = Math.floor(Math.random() * (gradeId <= 3 ? 10 : gradeId <= 6 ? 20 : 50)) + 1
      const op = ops[Math.floor(Math.random() * ops.length)]
      let ans: number
      switch (op) {
        case '+': ans = a + b; break
        case '-': ans = a - b; break
        case 'x': ans = a * b; break
        default: ans = b !== 0 ? Math.floor(a / Math.max(b, 1)) : 0
      }
      const correct = String(ans)
      const options = new Set<string>([correct])
      while (options.size < 4) {
        options.add(String(ans + Math.floor(Math.random() * 10) - 5))
      }
      qs.push({
        question: `${a} ${op === 'x' ? '×' : op === '÷' ? '÷' : op} ${b} = ?`,
        options: shuffle([...options]),
        correctAnswer: correct,
      })
    }
  } else if (subject === 'arabic') {
    const pairs = [
      { q: 'ما جمع كلمة "كتاب"؟', qEn: 'What is the plural of "book"?', opts: ['كُتُب', 'كَاتِب', 'مَكْتَبَة', 'كِتَابَة'], ans: 'كُتُب' },
      { q: 'ما مرادف كلمة "سعيد"؟', qEn: 'Synonym of "saeed"?', opts: ['فَرِح', 'حَزِين', 'غَاضِب', 'خَائِف'], ans: 'فَرِح' },
      { q: 'ما ضد كلمة "كبير"؟', qEn: 'Antonym of "kabeer"?', opts: ['صَغِير', 'طَوِيل', 'قَوِي', 'عَظِيم'], ans: 'صَغِير' },
      { q: 'ما مؤنث كلمة "مُعَلِّم"؟', qEn: 'Feminine of "teacher"?', opts: ['مُعَلِّمَة', 'مَدْرَسَة', 'تَعْلِيم', 'عِلْم'], ans: 'مُعَلِّمَة' },
      { q: 'ما نوع كلمة "يَدرُس"?', qEn: 'What type of word is "yadrus"?', opts: ['فِعْل', 'اِسْم', 'حَرْف', 'ظَرْف'], ans: 'فِعْل' },
      { q: 'أكمل: الشمس ___ في الصباح', qEn: 'Complete: The sun ___ in the morning', opts: ['تَشْرُق', 'تَغْرُب', 'تَنْزِل', 'تَسْقُط'], ans: 'تَشْرُق' },
      { q: 'ما إعراب كلمة "الطالبُ" في: جاء الطالبُ؟', qEn: 'Grammar of "al-talib" in "jaa\'a al-talib"?', opts: ['فَاعِل', 'مَفْعُول', 'مُبْتَدَأ', 'خَبَر'], ans: 'فَاعِل' },
      { q: 'ما المفرد من كلمة "أَطْفَال"؟', qEn: 'Singular of "atfaal"?', opts: ['طِفْل', 'طَفِيل', 'أَطْفَل', 'طُفُولَة'], ans: 'طِفْل' },
      { q: 'أي من التالي فعل ماضٍ؟', qEn: 'Which is a past tense verb?', opts: ['كَتَبَ', 'يَكْتُب', 'اكْتُبْ', 'كَاتِب'], ans: 'كَتَبَ' },
      { q: 'ما جمع "عَيْن"؟', qEn: 'Plural of "ayn"?', opts: ['أَعْيُن', 'عَيُون', 'أَعْيَان', 'عَائِنَة'], ans: 'أَعْيُن' },
    ]
    const picked = shuffle(pairs).slice(0, 10)
    picked.forEach((p) => qs.push({ question: p.q, questionAr: p.qEn, options: p.opts, correctAnswer: p.ans }))
  } else if (subject === 'science') {
    const qs_data = [
      { q: 'ما هي عاصمة مصر؟', qEn: 'What is the chemical symbol for water?', opts: ['H₂O', 'CO₂', 'O₂', 'NaCl'], ans: 'H₂O' },
      { qEn: 'What planet is closest to the sun?', opts: ['Mercury', 'Venus', 'Mars', 'Jupiter'], ans: 'Mercury' },
      { qEn: 'What gas do plants absorb?', opts: ['CO₂', 'O₂', 'N₂', 'H₂'], ans: 'CO₂' },
      { qEn: 'How many bones in adult human body?', opts: ['206', '300', '150', '250'], ans: '206' },
      { qEn: 'What is the boiling point of water?', opts: ['100°C', '90°C', '80°C', '120°C'], ans: '100°C' },
      { qEn: 'What is the largest organ?', opts: ['Skin', 'Heart', 'Liver', 'Brain'], ans: 'Skin' },
      { qEn: 'What force pulls objects down?', opts: ['Gravity', 'Magnetism', 'Friction', 'Tension'], ans: 'Gravity' },
      { qEn: 'What is the closest star to Earth?', opts: ['Sun', 'Proxima Centauri', 'Sirius', 'Vega'], ans: 'Sun' },
      { qEn: 'Photosynthesis needs light and ____?', opts: ['CO₂', 'N₂', 'He', 'Ne'], ans: 'CO₂' },
      { qEn: 'Speed of light is approximately?', opts: ['3x10⁸ m/s', '3x10⁶ m/s', '3x10¹⁰ m/s', '3x10⁴ m/s'], ans: '3x10⁸ m/s' },
    ]
    shuffle(qs_data).slice(0, 10).forEach((p) => qs.push({ question: p.q ?? p.qEn!, options: p.opts, correctAnswer: p.ans }))
  } else if (subject === 'english') {
    const en = [
      { q: 'What is the past tense of "go"?', opts: ['Went', 'Gone', 'Goed', 'Going'], ans: 'Went' },
      { q: 'Choose the correct: She ___ to school', opts: ['goes', 'go', 'going', 'gone'], ans: 'goes' },
      { q: 'What is the plural of "child"?', opts: ['Children', 'Childs', 'Childes', 'Childrens'], ans: 'Children' },
      { q: 'Opposite of "hot"?', opts: ['Cold', 'Warm', 'Cool', 'Mild'], ans: 'Cold' },
      { q: '"Beautiful" is a ___?', opts: ['Adjective', 'Noun', 'Verb', 'Adverb'], ans: 'Adjective' },
      { q: 'Past tense of "write"?', opts: ['Wrote', 'Written', 'Writed', 'Writing'], ans: 'Wrote' },
      { q: 'Which is correct?', opts: ['I have been', 'I has been', 'I have being', 'I has being'], ans: 'I have been' },
      { q: 'Synonym of "happy"?', opts: ['Joyful', 'Sad', 'Angry', 'Tired'], ans: 'Joyful' },
      { q: '"Quickly" is an ___?', opts: ['Adverb', 'Adjective', 'Noun', 'Pronoun'], ans: 'Adverb' },
      { q: 'Choose: He ___ football now', opts: ['is playing', 'plays', 'played', 'play'], ans: 'is playing' },
    ]
    shuffle(en).slice(0, 10).forEach((p) => qs.push({ question: p.q, options: p.opts, correctAnswer: p.ans }))
  } else if (subject === 'geography') {
    const geo = [
      { q: 'What is the longest river in the world?', opts: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], ans: 'Nile' },
      { q: 'Which continent is Egypt in?', opts: ['Africa', 'Asia', 'Europe', 'South America'], ans: 'Africa' },
      { q: 'Capital of Egypt?', opts: ['Cairo', 'Alexandria', 'Luxor', 'Aswan'], ans: 'Cairo' },
      { q: 'Largest ocean?', opts: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], ans: 'Pacific' },
      { q: 'How many continents?', opts: ['7', '5', '6', '8'], ans: '7' },
      { qEn: 'Which is a desert in Egypt?', opts: ['Sahara', 'Gobi', 'Kalahari', 'Mojave'], ans: 'Sahara' },
      { qEn: 'River flowing through Cairo?', opts: ['Nile', 'Amazon', 'Danube', 'Tigris'], ans: 'Nile' },
      { qEn: 'The Suez Canal connects?', opts: ['Mediterranean & Red Sea', 'Atlantic & Pacific', 'Indian & Arctic', 'Black & Caspian'], ans: 'Mediterranean & Red Sea' },
      { qEn: 'Capital of Saudi Arabia?', opts: ['Riyadh', 'Jeddah', 'Mecca', 'Dubai'], ans: 'Riyadh' },
      { qEn: 'Largest country by area?', opts: ['Russia', 'Canada', 'China', 'USA'], ans: 'Russia' },
    ]
    shuffle(geo).slice(0, 10).forEach((p) => qs.push({ question: p.q ?? p.qEn!, options: p.opts, correctAnswer: p.ans }))
  } else if (subject === 'history') {
    const hist = [
      { q: 'Who built the Great Pyramid?', opts: ['Khufu', 'Khafre', 'Tutankhamun', 'Ramesses'], ans: 'Khufu' },
      { q: 'When was the Suez Canal opened?', opts: ['1869', '1769', '1969', '1669'], ans: '1869' },
      { q: 'Ancient Egyptian writing system?', opts: ['Hieroglyphics', 'Cuneiform', 'Latin', 'Sanskrit'], ans: 'Hieroglyphics' },
      { q: 'Who was Cleopatra?', opts: ['Last Pharaoh', 'First Pharaoh', 'A Queen', 'A God'], ans: 'Last Pharaoh' },
      { q: 'When did the 1952 Egyptian Revolution happen?', opts: ['1952', '1948', '1960', '1945'], ans: '1952' },
      { q: 'The Rosetta Stone helped decode?', opts: ['Hieroglyphics', 'Cuneiform', 'Latin', 'Greek'], ans: 'Hieroglyphics' },
      { qEn: 'Who discovered Tutankhamun\'s tomb?', opts: ['Howard Carter', 'Zahi Hawass', 'Napoleon', 'Champollion'], ans: 'Howard Carter' },
      { qEn: 'The ancient city of Thebes is now?', opts: ['Luxor', 'Cairo', 'Aswan', 'Giza'], ans: 'Luxor' },
      { qEn: 'Egyptian president who led 1952?', opts: ['Nasser', 'Sadat', 'Mubarak', 'Farouk'], ans: 'Nasser' },
      { qEn: 'Temple at Abu Simbel was built by?', opts: ['Ramesses II', 'Khufu', 'Thutmose', 'Akhenaten'], ans: 'Ramesses II' },
    ]
    shuffle(hist).slice(0, 10).forEach((p) => qs.push({ question: p.q ?? p.qEn!, options: p.opts, correctAnswer: p.ans }))
  }

  return qs.length > 0 ? qs : [
    { question: 'Sample Question 1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
    { question: 'Sample Question 2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B' },
  ]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- Game Page Component ----------
export function GamePage() {
  const { gameId } = useParams<{ gameId: string }>()
  const game = getGameById(gameId!)
  const grade = game ? getGradeById(game.grade_id) : null

  const {
    currentQuestion, totalQuestions, score, correctAnswers,
    timer, isPlaying, isGameOver, options, correctAnswer,
    showResult, selectedAnswer, questions,
    initGame, nextQuestion, checkAnswer, resetGame,
  } = useGameStore()

  const updateProgress = useProgressStore((s) => s.updateProgress)
  const [started, setStarted] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timer <= 0) return
    const t = setTimeout(() => {
      useGameStore.setState({ timer: timer - 1 })
    }, 1000)
    return () => clearTimeout(t)
  }, [isPlaying, timer])

  const handleStart = useCallback(() => {
    if (!game) return
    const qs = generateQuestions(game.subject, game.grade_id)
    initGame(10, qs)
    setStarted(true)
  }, [game, initGame])

  const handleAnswer = (answer: string) => {
    if (showResult) return
    const isCorrect = checkAnswer(answer)
    setTimeout(() => nextQuestion(), 1200)
  }

  const handleEnd = () => {
    if (!gameId) return
    updateProgress(gameId, score, totalQuestions * 10)
  }

  useEffect(() => {
    if (isGameOver && gameId) {
      handleEnd()
    }
  }, [isGameOver, gameId])

  if (!game || !grade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Game not found</h2>
          <Link to="/dashboard" className="text-primary-600 font-body font-bold hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const colors = STAGE_COLORS[grade.stage as Stage]
  const emojis: Record<string, string> = { math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️' }

  // Pre-game screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to={`/grade/${grade.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-body font-semibold mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Games
        </Link>
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <div className="text-6xl mb-4">{emojis[game.subject] || '📖'}</div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">{game.title}</h1>
          {(game as any).title_ar && <p className="font-arabic text-lg text-gray-400 mb-4" dir="rtl">{(game as any).title_ar}</p>}
          <p className="font-body text-gray-500 mb-6">{game.description}</p>
          <div className="flex justify-center gap-4 mb-8">
            <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-body font-bold capitalize">{game.subject}</span>
            <span className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-sm font-body font-bold capitalize">{game.difficulty}</span>
            <span className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-sm font-body font-bold">10 Questions</span>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart} className="mx-auto">
            Start Game!
          </Button>
        </div>
      </div>
    )
  }

  // Game over screen
  if (isGameOver) {
    const stars = score >= (totalQuestions * 8) ? 3 : score >= (totalQuestions * 5) ? 2 : score > 0 ? 1 : 0
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100 animate-scale-in">
          <div className="text-6xl mb-4">{stars >= 2 ? '🎉' : stars === 1 ? '👍' : '💪'}</div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Game Over!</h1>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-4xl transition-all ${s <= stars ? 'animate-bounce' : 'opacity-20'}`} style={{ animationDelay: `${s * 0.2}s` }}>
                ⭐
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-2xl p-4">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-primary-500" />
              <div className="font-display text-2xl font-bold text-gray-800">{score}</div>
              <div className="font-body text-xs text-gray-400">Score</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <Check className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
              <div className="font-display text-2xl font-bold text-gray-800">{correctAnswers}</div>
              <div className="font-body text-xs text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <X className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="font-display text-2xl font-bold text-gray-800">{totalQuestions - correctAnswers}</div>
              <div className="font-body text-xs text-gray-400">Wrong</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={handleStart}><RotateCcw className="w-4 h-4 mr-2" /> Play Again</Button>
            <Button variant="outline" onClick={() => { resetGame(); setStarted(false) }}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
          </div>
        </div>
      </div>
    )
  }

  // Active game
  const currentQ = questions[currentQuestion]
  if (!currentQ) return null

  const progressPct = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-body text-sm font-bold text-gray-500">
            Question {currentQuestion + 1}/{totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-body text-sm font-bold text-amber-600">
              <Star className="w-4 h-4" /> {score}
            </span>
            <span className={`flex items-center gap-1 font-body text-sm font-bold ${timer <= 5 ? 'text-red-500 animate-pulse-gentle' : 'text-gray-500'}`}>
              <Timer className="w-4 h-4" /> {timer}s
            </span>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, backgroundColor: colors.primary }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100 animate-fade-in" key={currentQuestion}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{emojis[game.subject] || '📖'}</span>
          <span className="text-sm font-bold text-gray-400 font-body uppercase tracking-wider">{game.subject}</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">{currentQ.question}</h2>
        {currentQ.questionAr && <p className="font-arabic text-sm text-gray-400 mb-4" dir="rtl">{currentQ.questionAr}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          {currentQ.options.map((opt, i) => {
            let cls = 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
            if (showResult) {
              if (opt === correctAnswer) cls = 'border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200'
              else if (opt === selectedAnswer) cls = 'border-red-400 bg-red-50 ring-2 ring-red-200'
              else cls = 'border-gray-100 opacity-50'
            }

            const letters = ['A', 'B', 'C', 'D']
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-body font-bold text-gray-700 transition-all text-left ${cls} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-display font-bold flex-shrink-0 ${
                  showResult && opt === correctAnswer ? 'bg-emerald-500 text-white' :
                  showResult && opt === selectedAnswer ? 'bg-red-500 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {showResult && opt === correctAnswer ? <Check className="w-4 h-4" /> :
                   showResult && opt === selectedAnswer ? <X className="w-4 h-4" /> :
                   letters[i]}
                </span>
                <span className="text-sm">{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Correct/Wrong feedback */}
      {showResult && (
        <div className={`text-center p-4 rounded-2xl font-body font-bold animate-scale-in ${
          selectedAnswer === correctAnswer ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {selectedAnswer === correctAnswer ? (
            <span className="flex items-center justify-center gap-2"><Zap className="w-5 h-5" /> Correct! +10 points</span>
          ) : (
            <span className="flex items-center justify-center gap-2"><ArrowLeft className="w-5 h-5" /> Answer: {correctAnswer}</span>
          )}
        </div>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any