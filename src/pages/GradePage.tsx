import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { getGradeById } from '@/data/grades'
import { getGamesByGrade } from '@/data/games'
import { GameCard } from '@/components/ui/Card'
import { STAGE_COLORS, type Stage } from '@/types'

export function GradePage() {
  const { gradeId } = useParams<{ gradeId: string }>()
  const grade = getGradeById(Number(gradeId))
  const gameList = getGamesByGrade(Number(gradeId))

  if (!grade) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Grade not found</h2>
          <Link to="/dashboard" className="text-primary-600 font-body font-bold hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    )
  }

  const colors = STAGE_COLORS[grade.stage as Stage]

  // Group by subject
  const bySubject = gameList.reduce((acc, g) => {
    if (!acc[g.subject]) acc[g.subject] = []
    acc[g.subject].push(g)
    return acc
  }, {} as Record<string, typeof gameList>)

  const subjEmojis: Record<string, string> = { math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️' }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-body font-semibold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">{grade.name_en}</h1>
              <p className="font-arabic text-lg opacity-80" dir="rtl">{grade.name_ar}</p>
            </div>
          </div>
          <p className="font-body mt-3 opacity-90">{gameList.length} educational games available</p>
        </div>
      </div>

      {/* Games by subject */}
      {Object.entries(bySubject).map(([subject, subjectGames]) => (
        <div key={subject} className="mb-8">
          <h2 className="font-display text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <span className="text-2xl">{subjEmojis[subject] || '📖'}</span>
            <span className="capitalize">{subject}</span>
          </h2>
          <p className="font-body text-sm text-gray-400 mb-4">{subjectGames.length} game{subjectGames.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectGames.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`} className="block">
                <GameCard
                  title={game.title}
                  titleAr={(game as any).title_ar}
                  subject={game.subject}
                  difficulty={game.difficulty}
                  stars={0}
                  color={colors.primary}
                  accent={colors.accent}
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
