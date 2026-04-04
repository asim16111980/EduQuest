import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import type { Toast as ToastType } from '@/types'

interface ToastContainerProps {
  toasts: ToastType[]
  onRemove: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-sky-50 border-sky-200 text-sky-800',
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => onRemove(t.id), 4000)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts, onRemove])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 shadow-lg animate-slide-in-right ${colors[toast.type]}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-body font-semibold">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)} className="p-1 hover:bg-black/5 rounded-full">
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
