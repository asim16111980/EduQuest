/**
 * Admin shared UI components for EduQuest admin dashboard.
 * All components use RTL Arabic with Tajawal font.
 */
import { ReactNode, memo, useEffect, useCallback, useState } from 'react'

// ─── StatCard ─────────────────────────────────────────

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; up: boolean }
  color: string
}

// PERF: Memo prevents unnecessary re-renders on dashboard updates
export const AdminStatCard = memo(function AdminStatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full font-body ${
              trend.up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
            dir="ltr"
          >
            {trend.up ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-gray-800">{value}</p>
      <p className="text-sm font-body text-gray-500 mt-1">{label}</p>
    </div>
  )
})

// ─── Badge ───────────────────────────────────────────

interface AdminBadgeProps {
  text: string
  variant: 'subject' | 'stage' | 'difficulty' | 'status' | 'action'
}

const badgeStyles: Record<string, Record<string, string>> = {
  subject: {
    math: 'bg-blue-100 text-blue-700',
    arabic: 'bg-orange-100 text-orange-700',
    science: 'bg-emerald-100 text-emerald-700',
    english: 'bg-indigo-100 text-indigo-700',
    geography: 'bg-teal-100 text-teal-700',
    history: 'bg-purple-100 text-purple-700',
  },
  stage: {
    primary: 'bg-blue-100 text-blue-700',
    preparatory: 'bg-green-100 text-green-700',
    secondary: 'bg-purple-100 text-purple-700',
  },
  difficulty: {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  },
  status: {
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-red-100 text-red-700',
    inactive: 'bg-gray-100 text-gray-600',
  },
  action: {
    LOGIN: 'bg-emerald-100 text-emerald-700',
    LOGOUT: 'bg-gray-100 text-gray-600',
    DELETE_USER: 'bg-red-100 text-red-700',
    EDIT_USER: 'bg-amber-100 text-amber-700',
    ADD_GAME: 'bg-blue-100 text-blue-700',
    DELETE_GAME: 'bg-red-100 text-red-700',
    EDIT_GAME: 'bg-amber-100 text-amber-700',
    EDIT_GRADE: 'bg-amber-100 text-amber-700',
    EDIT_CONTENT: 'bg-blue-100 text-blue-700',
  },
}

export function AdminBadge({ text, variant }: AdminBadgeProps) {
  const styles = badgeStyles[variant]?.[text] ?? 'bg-gray-100 text-gray-600'
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-body ${styles}`}>{text}</span>
}

// ─── Switch ──────────────────────────────────────────

interface AdminSwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function AdminSwitch({ checked, onChange, label }: AdminSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      dir="ltr"
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-0' : 'translate-x-5'
        } ${checked ? 'left-0' : 'right-0.5'}`}
      />
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────

interface AdminModalProps {
  title: string
  children: ReactNode
  onConfirm?: () => void
  onCancel: () => void
  size?: 'sm' | 'md' | 'lg'
  confirmLabel?: string
  cancelLabel?: string
}

const modalSizes: Record<string, string> = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export function AdminModal({
  title,
  children,
  onConfirm,
  onCancel,
  size = 'md',
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
}: AdminModalProps) {
  // A11Y: Close modal with Escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }, [onCancel])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl p-6 w-full ${modalSizes[size]} animate-scale-in`}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-body font-semibold hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-body font-bold hover:shadow-lg transition-all"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ConfirmDialog ────────────────────────────────────

interface ConfirmDialogProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function AdminConfirmDialog({ title, message, onConfirm, onCancel, danger = true }: ConfirmDialogProps) {
  // A11Y: Close dialog with Escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }, [onCancel])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-scale-in"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
              danger ? 'bg-red-100' : 'bg-blue-100'
            }`}
          >
            <span className={`text-2xl ${danger ? 'text-red-500' : 'text-blue-500'}`}>⚠️</span>
          </div>
          <h3 className="font-display text-lg font-bold text-gray-800">{title}</h3>
          <p className="font-body text-sm text-gray-500 mt-2">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-body font-semibold hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-body font-bold text-white transition-all ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SessionTimer ─────────────────────────────────────


export function SessionTimer() {
  const [remaining, setRemaining] = useState(30 * 60)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const color = remaining <= 300 ? 'text-red-500' : remaining <= 600 ? 'text-amber-500' : 'text-gray-400'

  return (
    <span className={`font-body text-xs font-bold tabular-nums ${color}`} dir="ltr" aria-label="Session timeout remaining">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  )
}

// ─── DataTable ────────────────────────────────────────

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  filters?: { label: string; value: string }[][]
  onFilterChange?: (filters: Record<number, string>) => void
  paginated?: boolean
  pageSize?: number
  emptyMessage?: string
  loading?: boolean
}

export function AdminDataTable<T>({
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'بحث…',
  filters,
  onFilterChange,
  paginated = true,
  pageSize = 10,
  emptyMessage = 'لا توجد بيانات',
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [activeFilters, setActiveFilters] = useState<Record<number, string>>({})

  const filtered = data.filter((row) => {
    if (search) {
      // PERF: cast to Record for Object.values since T is not constrained to object
      const obj = row as Record<string, unknown>
      const match = Object.values(obj).some((v) =>
        typeof v === 'string' ? v.toLowerCase().includes(search.toLowerCase()) : String(v ?? '').toLowerCase().includes(search.toLowerCase())
      )
      if (!match) return false
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / pageSize)
  const pageData = paginated ? filtered.slice(page * pageSize, (page + 1) * pageSize) : filtered

  const handleFilterChange = (idx: number, value: string) => {
    const updated = { ...activeFilters, [idx]: value }
    setActiveFilters(updated)
    onFilterChange?.(updated)
    setPage(0)
  }

  return (
    <div>
      {searchable && (
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="w-full mb-4 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
          dir="rtl"
        />
      )}

      {filters && (
        <div className="flex gap-3 mb-4 flex-wrap">
          {filters.map((group, gi) => (
            <select
              key={gi}
              value={activeFilters[gi] ?? ''}
              onChange={(e) => handleFilterChange(gi, e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value=""> الكل</option>
              {group.map((f) => (
                <option value={f.value} key={f.value}>{f.label}</option>
              ))}
            </select>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : pageData.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-2">📭</span>
          <p className="font-body text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} className="px-4 py-3 text-right font-body font-bold text-gray-600 whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, ri) => (
                  <tr key={ri} className="border-t border-gray-100 hover:bg-gray-50">
                    {columns.map((col, ci) => (
                      <td key={ci} className="px-4 py-3 font-body text-gray-700 whitespace-nowrap">
                        {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginated && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 font-body text-sm text-gray-500">
              <span>{filtered.length} نتيجة</span>
              <div className="flex gap-1" dir="ltr">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`px-3 py-1.5 rounded-lg ${
                      page === i ? 'bg-primary-500 text-white' : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
