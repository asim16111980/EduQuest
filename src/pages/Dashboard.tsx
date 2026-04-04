import { Link } from 'react-router-dom'
import { Star, Trophy, Clock, ArrowRight, Gamepad2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProgressStore } from '@/store/gameStore'
import { getGradeById } from '@/data/grades'
import { getGamesByGrade } from '@/data/games'
import { Card, GameCard } from '@/components/ui/Card'
import { STAGE_COLORS, type Stage } from '@/types'

export function Dashboard() {
  const { user } = useAuthStore()
  const getPlayCount = useProgressStore((s) => s.getPlayCount)
  const getBestScore = useProgressStore((s) => s.getBestScore)

  if (!user) return null

  const grade = getGradeById(user.grade_id)
  const userGames = getGamesByGrade(user.grade_id)
  const stageColors = STAGE_COLORS[grade?.stage as Stage] || STAGE_COLORS.primary
  const playCount = getPlayCount()
  const bestScore = getBestScore()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome header */}
      <div
        className="rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${stageColors.primary}, ${stageColors.accent})` }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="shape w-48 h-48 bg-white" style={{ top: '-20%', right: '-10%', animationDelay: '0s' }} />
          <div className="shape w-32 h-32 bg-white" style={{ bottom: '-10%', left: '5%', animationDelay: '3s' }} />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="font-body text-lg opacity-90">
            You&apos;re in <strong>{grade?.name_en}</strong> ({grade?.name_ar})
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Gamepad2, label: 'Games Played', value: playCount, color: 'text-blue-500' },
          { icon: Star, label: 'Stars Earned', value: playCount * 2, color: 'text-amber-500' },
          { icon: Trophy, label: 'Best Score', value: bestScore, color: 'text-emerald-500' },
          { icon: Clock, label: 'Grade', value: `G${grade?.order}`, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} hover={false}>
            <div className="p-5 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="font-display text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="font-body text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Games */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-800">Your Games</h2>
          <p className="font-body text-gray-500 text-sm mt-1">{userGames.length} games available for {grade?.name_en}</p>
        </div>
        <Link to={`/grade/${grade?.id}`} className="text-sm font-body font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {userGames.map((game) => (
          <Link key={game.id} to={`/game/${game.id}`} className="block">
            <GameCard
              title={game.title}
              titleAr={game.title_ar}
              subject={game.subject}
              difficulty={game.difficulty}
              color={stageColors.primary}
              accent={stageColors.accent}
            />
          </Link>
        ))}
      </div>

      {/* Subjects */}
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Subjects</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from(new Set(userGames.map((g) => g.subject))).map((subj) => {
          const count = userGames.filter((g) => g.subject === subj).length
          const emojis: Record<string, string> = { math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️' }
          return (
            <Card key={subj} hover={false}>
              <div className="p-4 text-center">
                <span className="text-3xl">{emojis[subj] || '📖'}</span>
                <h3 className="font-display font-bold text-sm text-gray-700 mt-2 capitalize">{subj}</h3>
                <p className="font-body text-xs text-gray-400">{count} game{count > 1 ? 's' : ''}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
