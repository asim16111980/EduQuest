import React from 'react'
import { SUBJ_GRADIENTS, DIFF_COLORS, getDiffLabel, getSubjectArabic } from '@/types'

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
  gradeName?: string
  screenshotUrl?: string
  onClick?: () => void
  color?: string
  accent?: string
}

export function GameCard({
  title,
  titleAr,
  subject,
  difficulty,
  stars = 0,
  gradeName,
  screenshotUrl,
  onClick,
  color,
  accent,
}: GameCardProps) {
  const diff = DIFF_COLORS[difficulty]
  const bg = SUBJ_GRADIENTS[subject] || SUBJ_GRADIENTS.math
  const subjectAr = getSubjectArabic(subject)
  const diffLabel = getDiffLabel(difficulty)
  const hasScreenshot = screenshotUrl && screenshotUrl.length > 0

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-3xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer border-2 border-transparent hover:border-primary-200"
    >
      {/* Top section: screenshot or gradient */}
      <div className="relative h-36 overflow-hidden flex items-center justify-center" style={{ background: bg }}>
        {/* Screenshot image */}
        {hasScreenshot && (
          <img
            src={screenshotUrl!}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

        {/* Subject icon centered on top */}
        <span
          className="text-5xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110 relative z-10"
          style={{ lineHeight: 1 }}
        >
          {subjectAr}
        </span>

        {/* Difficulty badge */}
        <div className="absolute top-2 left-2 z-20">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: diff.bg, color: diff.text }}
          >
            {diffLabel}
          </span>
        </div>
      </div>

      {/* Bottom: info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-sm text-gray-800 truncate">{title}</h3>
        {titleAr && <p className="font-arabic text-xs text-gray-400 mt-0.5 truncate" dir="rtl">{titleAr}</p>}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-lg"
              style={{ backgroundColor: diff.bg, color: diff.text }}
            >
              {subjectAr}
            </span>
            {gradeName && <span className="text-xs text-gray-400 font-body">{gradeName}</span>}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onClick && onClick() }}
            className="text-xs font-bold px-3 py-1 rounded-lg text-white transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${color || '#3B82F6'}, ${accent || '#6366F1'})` }}
          >
            ▶ ألعب
          </button>
        </div>

        {/* Stars row */}
        {stars > 0 && (
          <div className="flex gap-0.5 mt-2">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-sm ${s <= stars ? '' : 'opacity-20'}`}>⭐</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
