import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className = '', onClick, hover = true }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-md overflow-hidden
        ${hover ? 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface GameCardProps {
  title: string
  titleAr?: string
  subject: string
  difficulty: 'easy' | 'medium' | 'hard'
  stars?: number
  onClick?: () => void
  color: string
  accent: string
}

export function GameCard({ title, titleAr, subject, difficulty, stars = 0, onClick, color, accent }: GameCardProps) {
  const diffColors = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' }
  const subjectEmojis: Record<string, string> = { math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️' }

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-primary-200"
    >
      {/* Thumbnail */}
      <div className="relative h-40 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
        <span className="text-6xl transform transition-transform duration-300 group-hover:scale-110">{subjectEmojis[subject] || '📖'}</span>
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${diffColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-gray-800 mb-1">{title}</h3>
        {titleAr && <p className="font-arabic text-sm text-gray-500 mb-3" dir="rtl">{titleAr}</p>}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{subject}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-lg ${s <= stars ? '' : 'opacity-20'}`}>
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}10, ${accent}10)` }}
      />
    </div>
  )
}
